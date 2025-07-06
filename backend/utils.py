# wallet/utils/crypto.py
import hashlib
import hmac
import secrets
import binascii
from mnemonic import Mnemonic
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from django.conf import settings
import base64
import os
from typing import Tuple, List
from eth_account import Account
from bitcoin import *
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache
import requests
import logging
# Add proper BIP32 import
try:
    from hdwallet import BIP32HDWallet
    from hdwallet.cryptocurrencies import BitcoinMainNet
except ImportError:
    # Fallback if hdwallet is not available
    BIP32HDWallet = None

class WalletCrypto:
    """Handles all cryptographic operations for wallet creation and management"""
    
    def __init__(self):
        self.mnemo = Mnemonic("english")
        # Enable mnemonic features - do this once when your app starts
        Account.enable_unaudited_hdwallet_features()
    
    def generate_mnemonic(self, strength: int = 128) -> str:
        """
        Generate a BIP39 mnemonic phrase
        strength: 128 (12 words), 160 (15 words), 192 (18 words), 224 (21 words), 256 (24 words)
        """
        return self.mnemo.generate(strength=strength)
    
    def validate_mnemonic(self, mnemonic: str) -> bool:
        """Validate if mnemonic phrase is valid"""
        return self.mnemo.check(mnemonic)
    
    def mnemonic_to_seed(self, mnemonic: str, passphrase: str = "") -> bytes:
        """Convert mnemonic to seed using BIP39"""
        return self.mnemo.to_seed(mnemonic, passphrase)
    
    def derive_private_key(self, seed: bytes, derivation_path: str = "m/44'/60'/0'/0/0") -> str:
        """
        Derive private key from seed using BIP44 derivation path
        Default path is for Ethereum (m/44'/60'/0'/0/0)
        """
        # This is simplified - in production, use proper BIP32/BIP44 implementation
        # For now, we'll use eth_account for Ethereum keys
        account = Account.from_mnemonic(self.seed_to_mnemonic(seed))
        return account.key.hex()
    
    def seed_to_mnemonic(self, seed: bytes) -> str:
        """Convert seed back to mnemonic (helper function)"""
        # This is a simplified approach - in production, store mnemonic securely
        return self.mnemo.to_mnemonic(seed[:16])  # Use first 16 bytes for 12-word mnemonic
    
    def private_key_to_address(self, private_key: str, crypto_type: str = "ethereum") -> str:
        """Generate address from private key for different cryptocurrencies"""
        if crypto_type.lower() == "ethereum":
            account = Account.from_key(private_key)
            return account.address
        elif crypto_type.lower() == "bitcoin":
            # Bitcoin address generation
            public_key = privkey_to_pubkey(private_key)
            return pubkey_to_address(public_key)
        else:
            raise ValueError(f"Unsupported cryptocurrency: {crypto_type}")
    
    def get_ethereum_public_key(self, private_key: str) -> str:
        """Get Ethereum public key from private key"""
        from eth_keys import keys
        # Remove '0x' prefix if present
        if private_key.startswith('0x'):
            private_key = private_key[2:]
        
        # Convert to PrivateKey object
        pk = keys.PrivateKey(bytes.fromhex(private_key))
        return pk.public_key.to_hex()
    
    def encrypt_data(self, data: str, password: str) -> str:
        """Encrypt sensitive data with password"""
        # Generate salt
        salt = os.urandom(16)
        
        # Derive key from password
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        
        # Encrypt data
        fernet = Fernet(key)
        encrypted_data = fernet.encrypt(data.encode())
        
        # Prepend version byte and salt
        return base64.b64encode(b'\x01' + salt + encrypted_data).decode()
    
    def decrypt_data(self, encrypted_data: str, password: str) -> str:
        """Decrypt data with password"""
        try:
            # Decode the data
            combined_data = base64.b64decode(encrypted_data.encode())
            
            # Check if we have version byte
            if len(combined_data) > 0 and combined_data[0] == 1:  # Version 1
                salt = combined_data[1:17]  # Skip version byte
                encrypted_data = combined_data[17:]
            else:
                # Legacy format without version byte
                salt = combined_data[:16]
                encrypted_data = combined_data[16:]
            
            # Derive key from password
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
            
            # Decrypt data
            fernet = Fernet(key)
            decrypted_data = fernet.decrypt(encrypted_data)
            
            return decrypted_data.decode()
        except Exception as e:
            raise ValueError("Invalid password or corrupted data")
    
    def generate_ethereum_wallet(self, mnemonic: str = None) -> dict:
        """Generate complete Ethereum wallet"""
        if not mnemonic:
            mnemonic = self.generate_mnemonic()
        
        # Validate mnemonic
        if not self.validate_mnemonic(mnemonic):
            raise ValueError("Invalid mnemonic phrase")
        
        # Generate account from mnemonic
        account = Account.from_mnemonic(mnemonic)
        
        # Get private key
        private_key = account.key.hex()
        
        # Get public key using helper method
        public_key = self.get_ethereum_public_key(private_key)
        
        return {
            'mnemonic': mnemonic,
            'private_key': private_key,
            'public_key': public_key,
            'address': account.address,
            'crypto_type': 'ethereum'
        }
    
    def generate_bitcoin_wallet(self, mnemonic: str = None) -> dict:
        """Generate complete Bitcoin wallet"""
        if not mnemonic:
            mnemonic = self.generate_mnemonic()
    
        # Validate mnemonic
        if not self.validate_mnemonic(mnemonic):
            raise ValueError("Invalid mnemonic phrase")
        
        # Method 1: Using hdwallet library (preferred)
        if BIP32HDWallet:
            try:
                # Initialize HD wallet
                hdwallet = BIP32HDWallet(cryptocurrency=BitcoinMainNet)
                hdwallet.from_mnemonic(mnemonic=mnemonic)
                
                # Derive according to BIP44 path: m/44'/0'/0'/0/0
                hdwallet.from_path("m/44'/0'/0'/0/0")
                
                return {
                    'mnemonic': mnemonic,
                    'private_key': hdwallet.private_key(),
                    'public_key': hdwallet.public_key(),
                    'address': hdwallet.p2pkh_address(),  # Legacy Bitcoin address
                    'crypto_type': 'bitcoin'
                }
            except Exception as e:
                print(f"HDWallet method failed: {e}")
                # Fall back to method 2
        
        # Method 2: Using bitcoin library with manual derivation
        try:
            seed = self.mnemonic_to_seed(mnemonic)
            
            # Simple derivation using HMAC-SHA512 (simplified BIP32)
            # This is a basic implementation - for production use proper BIP32 library
            def derive_key(seed_bytes, path="m/44'/0'/0'/0/0"):
                # This is a simplified derivation - use proper BIP32 in production
                master_key = hmac.new(b"Bitcoin seed", seed_bytes, hashlib.sha512).digest()
                private_key_int = int.from_bytes(master_key[:32], byteorder='big')
                
                # Ensure private key is valid for secp256k1
                private_key_int = private_key_int % 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
                
                # Convert to hex
                private_key_hex = hex(private_key_int)[2:].zfill(64)
                return private_key_hex
            
            private_key = derive_key(seed)
            
            # Generate public key and address using bitcoin library
            public_key = privkey_to_pubkey(private_key)
            address = pubkey_to_address(public_key)
            
            return {
                'mnemonic': mnemonic,
                'private_key': private_key,
                'public_key': public_key,
                'address': address,
                'crypto_type': 'bitcoin'
            }
            
        except Exception as e:
            raise ValueError(f"Failed to generate Bitcoin wallet: {str(e)}")
    
    def generate_multi_crypto_wallet(self, mnemonic: str = None) -> dict:
        """Generate wallet supporting multiple cryptocurrencies"""
        if not mnemonic:
            mnemonic = self.generate_mnemonic()
        
        # Generate Ethereum wallet
        eth_wallet = self.generate_ethereum_wallet(mnemonic)
        
        # Generate Bitcoin wallet
        btc_wallet = self.generate_bitcoin_wallet(mnemonic)
        
        return {
            'mnemonic': mnemonic,
            'wallets': {
                'ethereum': {
                    'private_key': eth_wallet['private_key'],
                    'public_key': eth_wallet['public_key'],
                    'address': eth_wallet['address']
                },
                'bitcoin': {
                    'private_key': btc_wallet['private_key'],
                    'public_key': btc_wallet['public_key'],
                    'address': btc_wallet['address']
                }
            }
        }
        
    def validate_wallet_password(self, password: str) -> dict:
            """Validate wallet password strength"""
            issues = []
            
            if len(password) < 8:
                issues.append("Password must be at least 8 characters long")
            
            if not any(c.isupper() for c in password):
                issues.append("Password should contain at least one uppercase letter")
            
            if not any(c.islower() for c in password):
                issues.append("Password should contain at least one lowercase letter")
            
            if not any(c.isdigit() for c in password):
                issues.append("Password should contain at least one number")
            
            # Check for common weak passwords
            weak_passwords = ['password', '12345678', 'qwerty123', 'password123']
            if password.lower() in weak_passwords:
                issues.append("Password is too common and easily guessable")
            
            return {
                'is_valid': len(issues) == 0,
                'issues': issues,
                'strength': 'strong' if len(issues) == 0 else 'weak'
            }

    def validate_address_format(self, address: str, crypto_type: str) -> bool:
        """Validate cryptocurrency address format"""
        if crypto_type.lower() == "ethereum":
            # Ethereum address validation
            import re
            eth_pattern = r'^0x[a-fA-F0-9]{40}$'
            return bool(re.match(eth_pattern, address))
        
        elif crypto_type.lower() == "bitcoin":
            # Bitcoin address validation (simplified)
            import re
            # Legacy (P2PKH) addresses start with 1
            # SegWit (P2SH) addresses start with 3
            # Bech32 addresses start with bc1
            btc_pattern = r'^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$'
            return bool(re.match(btc_pattern, address))
        
        return False

    def secure_mnemonic_generation(self, entropy_source: str = None) -> str:
        """Generate mnemonic with additional entropy source"""
        if entropy_source:
            # Add user-provided entropy to system entropy
            import hashlib
            user_entropy = hashlib.sha256(entropy_source.encode()).digest()
            system_entropy = secrets.token_bytes(16)
            combined_entropy = hashlib.sha256(user_entropy + system_entropy).digest()[:16]
            
            # Use combined entropy for mnemonic generation
            return self.mnemo.to_mnemonic(combined_entropy)
        
        return self.generate_mnemonic()

    def backup_wallet_data(self, wallet_data: dict, backup_password: str) -> str:
        """Create encrypted backup of wallet data"""
        import json
        
        # Prepare backup data
        backup_data = {
            'version': '1.0',
            'timestamp': int(time.time()),
            'wallet_name': wallet_data.get('wallet_name', 'Unknown'),
            'mnemonic': wallet_data['mnemonic'],
            'addresses': {}
        }
        
        # Add addresses for each currency
        if 'wallets' in wallet_data:
            for currency, data in wallet_data['wallets'].items():
                backup_data['addresses'][currency] = {
                    'address': data['address'],
                    'public_key': data['public_key']
                    # Note: Never include private keys in backups
                }
        
        # Encrypt backup
        backup_json = json.dumps(backup_data)
        encrypted_backup = self.encrypt_data(backup_json, backup_password)
        
        return encrypted_backup

# Utility functions
def generate_secure_password(length: int = 32) -> str:
    """Generate cryptographically secure password"""
    return secrets.token_urlsafe(length)

def hash_password(password: str, salt: str = None) -> Tuple[str, str]:
    """Hash password with salt"""
    if not salt:
        salt = secrets.token_hex(16)
    
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return password_hash.hex(), salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verify password against hash"""
    computed_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return computed_hash.hex() == password_hash


def get_current_prices():
    prices = cache.get('crypto_prices')
    if prices is not None:
        return prices
    try:
        response = requests.get(settings.COINGECKO_API_URL + '/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
        if response.status_code == 200:
            data = response.json()
            prices = {
                'BTC': data.get('bitcoin', {}).get('usd', 0),
                'ETH': data.get('ethereum', {}).get('usd', 0),
            }
            cache.set('crypto_prices', prices, 60)  # cache for 60 seconds
            return prices
        else:
            # Fallback to zero or log
            return {'BTC': 0, 'ETH': 0}
    except Exception:
        return {'BTC': 0, 'ETH': 0}
    
def refresh_balance(self, force=False):

        logger = logging.getLogger(__name__)
        # If the balance was updated recently and not forced, skip
        if not force and self.last_balance_update and (timezone.now() - self.last_balance_update) < timedelta(minutes=5):
            return
        symbol = self.cryptocurrency.symbol
        try:
            if symbol == 'ETH':
                api_key = getattr(settings, 'ETHERSCAN_API_KEY', '')
                url = f"{settings.ETHERSCAN_API_URL}?module=account&action=balance&address={self.address}&tag=latest&apikey={api_key}"
                response = requests.get(url, timeout=5)
                response.raise_for_status()
                data = response.json()
                if data.get('status') == '1':
                    balance_wei = int(data['result'])
                    balance_eth = balance_wei / 10**18
                    self.balance = balance_eth
                    self.last_balance_update = timezone.now()
                    self.save()
                else:
                    logger.error(f"Etherscan error: {data.get('message', 'Unknown error')} for address {self.address}")
            elif symbol == 'BTC':
                url = f"{settings.BLOCKCHAIR_API_URL}/bitcoin/dashboards/address/{self.address}"
                response = requests.get(url, timeout=5)
                response.raise_for_status()
                data = response.json()
                address_data = data.get('data', {}).get(self.address)
                if address_data:
                    balance_sat = address_data.get('address', {}).get('balance', 0)
                    if balance_sat is not None:
                        balance_btc = balance_sat / 10**8
                        self.balance = balance_btc
                        self.last_balance_update = timezone.now()
                        self.save()
                else:
                    logger.error(f"Blockchair error: no data for address {self.address}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error updating balance for {symbol} account {self.address}: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error updating balance: {str(e)}")