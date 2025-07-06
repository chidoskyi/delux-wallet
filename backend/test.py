# test_wallet_creation.py
import os
import sys
import django

# Add your project path
sys.path.append('C:/Users/NetPhixs/Desktop/dulux_app')


# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend.utils import WalletCrypto

def test_wallet_creation():
    """Test wallet creation functionality"""
    print("Testing Wallet Creation...")
    
    crypto = WalletCrypto()
    
    # Test 1: Generate mnemonic
    print("\n1. Testing mnemonic generation...")
    mnemonic = crypto.generate_mnemonic()
    print(f"Generated mnemonic: {mnemonic}")
    print(f"Mnemonic valid: {crypto.validate_mnemonic(mnemonic)}")
    
    # Test 2: Generate Ethereum wallet
    print("\n2. Testing Ethereum wallet generation...")
    try:
        eth_wallet = crypto.generate_ethereum_wallet(mnemonic)
        print(f"Ethereum Address: {eth_wallet['address']}")
        print(f"Private Key: {eth_wallet['private_key'][:20]}...")  # Show only first 20 chars
        print(f"Public Key: {eth_wallet['public_key'][:20]}...")
    except Exception as e:
        print(f"Ethereum wallet generation failed: {e}")
    
    # Test 3: Generate Bitcoin wallet
    print("\n3. Testing Bitcoin wallet generation...")
    try:
        btc_wallet = crypto.generate_bitcoin_wallet(mnemonic)
        print(f"Bitcoin Address: {btc_wallet['address']}")
        print(f"Private Key: {btc_wallet['private_key'][:20]}...")
        print(f"Public Key: {btc_wallet['public_key'][:20]}...")
    except Exception as e:
        print(f"Bitcoin wallet generation failed: {e}")
    
    # Test 4: Generate multi-crypto wallet
    print("\n4. Testing multi-crypto wallet generation...")
    try:
        multi_wallet = crypto.generate_multi_crypto_wallet(mnemonic)
        print(f"Mnemonic: {multi_wallet['mnemonic']}")
        print(f"Ethereum Address: {multi_wallet['wallets']['ethereum']['address']}")
        print(f"Bitcoin Address: {multi_wallet['wallets']['bitcoin']['address']}")
    except Exception as e:
        print(f"Multi-crypto wallet generation failed: {e}")
    
    # Test 5: Test encryption/decryption
    print("\n5. Testing encryption/decryption...")
    try:
        test_data = "This is sensitive wallet data"
        password = "test_password_123"
        
        encrypted = crypto.encrypt_data(test_data, password)
        print(f"Encrypted data: {encrypted[:50]}...")
        
        decrypted = crypto.decrypt_data(encrypted, password)
        print(f"Decrypted data: {decrypted}")
        print(f"Encryption/Decryption successful: {test_data == decrypted}")
    except Exception as e:
        print(f"Encryption/Decryption failed: {e}")

if __name__ == "__main__":
    test_wallet_creation()