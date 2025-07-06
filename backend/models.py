# wallet/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.core.cache import cache
from django.conf import settings
import logging
from backend.mixin import EnhancedAccountMixin
import requests
from decimal import Decimal
import uuid
from datetime import datetime
from datetime import datetime, timedelta
from django.utils import timezone
from .utils import WalletCrypto, hash_password, verify_password
# Configure logging
logger = logging.getLogger(__name__)

class User(AbstractUser):
    """Extended user model for wallet application"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Security settings
    two_factor_enabled = models.BooleanField(default=False)
    biometric_enabled = models.BooleanField(default=False)

    # Passcode settings
    passcode_hash = models.CharField(max_length=128, blank=True, null=True)
    passcode_salt = models.CharField(max_length=32, blank=True, null=True)
    passcode_set_at = models.DateTimeField(null=True, blank=True)
    passcode_attempts = models.IntegerField(default=0)
    passcode_locked_until = models.DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    def set_passcode(self, passcode: str):
        """Hash and store the 4-digit passcode"""
        if len(passcode) != 4 or not passcode.isdigit():
            raise ValueError("Passcode must be exactly 4 digits")
        
        passcode_hash, salt = hash_password(passcode)
        self.passcode_hash = passcode_hash
        self.passcode_salt = salt
        self.passcode_set_at = timezone.now()
        self.passcode_attempts = 0
        self.passcode_locked_until = None
        self.save()
    
    def verify_passcode(self, passcode: str) -> bool:
        """Verify the provided passcode"""
        if not self.passcode_hash or not self.passcode_salt:
            return False
        
        # Check if account is locked
        if self.is_passcode_locked():
            return False
        
        # Verify passcode
        is_valid = verify_password(passcode, self.passcode_hash, self.passcode_salt)
        
        if is_valid:
            # Reset failed attempts on successful verification
            self.passcode_attempts = 0
            self.passcode_locked_until = None
            self.save()
        else:
            # Increment failed attempts
            self.passcode_attempts += 1
            
            # Lock account after 5 failed attempts for 15 minutes
            if self.passcode_attempts >= 5:
                self.passcode_locked_until = timezone.now() + timedelta(minutes=15)
            
            self.save()
        
        return is_valid
    
    def is_passcode_locked(self) -> bool:
        """Check if passcode verification is locked due to failed attempts"""
        if not self.passcode_locked_until:
            return False
        return timezone.now() < self.passcode_locked_until
    
    def has_passcode(self) -> bool:
        """Check if user has set a passcode"""
        return bool(self.passcode_hash and self.passcode_salt)
    
    def get_passcode_lock_remaining_time(self) -> int:
        """Get remaining lock time in minutes"""
        if not self.is_passcode_locked():
            return 0
        
        remaining = self.passcode_locked_until - timezone.now()
        return max(0, int(remaining.total_seconds() / 60))
    
    def disable_passcode(self):
        """Clear all passcode-related fields"""
        self.passcode_hash = None
        self.passcode_salt = None
        self.passcode_set_at = None
        self.passcode_attempts = 0
        self.passcode_locked_until = None
        self.save()


class Wallet(models.Model):
    """Main wallet model containing encrypted mnemonic and wallet info"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    name = models.CharField(max_length=100, default="My Wallet")
    
    # Encrypted mnemonic phrase - NEVER store in plain text
    encrypted_mnemonic = models.TextField()
    encryption_salt = models.CharField(max_length=255, null=True, blank=True)
    
    # Wallet metadata
    is_imported = models.BooleanField(default=False)  # True if imported, False if generated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Security
    backup_completed = models.BooleanField(default=False)
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email}'s {self.name}"
    
    def set_mnemonic(self, mnemonic: str, password: str):
        """Encrypt and store mnemonic phrase"""
        crypto = WalletCrypto()
        self.encrypted_mnemonic = crypto.encrypt_data(mnemonic, password)
        self.save()
    
    def get_mnemonic(self, password: str) -> str:
        """Decrypt and return mnemonic phrase"""
        crypto = WalletCrypto()
        return crypto.decrypt_data(self.encrypted_mnemonic, password)

class CryptoCurrency(models.Model):
    """Supported cryptocurrencies"""
    NETWORK_CHOICES = [
        ('mainnet', 'Mainnet'),
        ('testnet', 'Testnet'),
        ('ropsten', 'Ropsten'),
        ('goerli', 'Goerli'),
        ('bsc', 'Binance Smart Chain'),
        ('polygon', 'Polygon'),
    ]
    
    name = models.CharField(max_length=50)  # Bitcoin, Ethereum, etc.
    symbol = models.CharField(max_length=10)  # BTC, ETH, etc.
    network = models.CharField(max_length=20, choices=NETWORK_CHOICES, default='mainnet')
    contract_address = models.CharField(max_length=42, blank=True, null=True)  # For tokens
    decimals = models.IntegerField(default=18)
    is_active = models.BooleanField(default=True)
    logo_url = models.URLField(blank=True, null=True)
    
    # Blockchain specific info
    derivation_path = models.CharField(max_length=50, default="m/44'/60'/0'/0/0")  # BIP44 path
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['symbol', 'network']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.symbol}) - {self.network}"

class Account(EnhancedAccountMixin, models.Model):
    """Individual cryptocurrency accounts within a wallet"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='accounts')
    cryptocurrency = models.ForeignKey(CryptoCurrency, on_delete=models.CASCADE)
    
    # Account info
    address = models.CharField(max_length=100)  # Public address
    encrypted_private_key = models.TextField()  # Encrypted private key
    public_key = models.TextField(blank=True, null=True)
    
    # Account metadata
    account_index = models.IntegerField(default=0)  # For HD wallets
    balance = models.DecimalField(max_digits=30, decimal_places=18, default=0)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_balance_update = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['wallet', 'cryptocurrency', 'account_index']
        ordering = ['cryptocurrency__name', 'account_index']
    
    def __str__(self):
        return f"{self.wallet.user.email} - {self.cryptocurrency.symbol} Account"
    
    def set_private_key(self, private_key: str, password: str):
        """Encrypt and store private key"""
        crypto = WalletCrypto()
        self.encrypted_private_key = crypto.encrypt_data(private_key, password)
        self.save()
    
    def get_private_key(self, password: str) -> str:
        """Decrypt and return private key"""
        crypto = WalletCrypto()
        return crypto.decrypt_data(self.encrypted_private_key, password)
    
    def update_balance_from_blockchain(self, force=False):
        """Use the enhanced balance fetching from the mixin"""
        return super().update_balance_from_blockchain(force=force)



class Transaction(models.Model):
    """Transaction history for accounts"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('failed', 'Failed'),
    ]
    
    TYPE_CHOICES = [
        ('send', 'Send'),
        ('receive', 'Receive'),
        ('swap', 'Swap'),
        ('stake', 'Stake'),
        ('unstake', 'Unstake'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    
    # Transaction details
    transaction_hash = models.CharField(max_length=100, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Amounts
    amount = models.DecimalField(max_digits=30, decimal_places=18)
    fee = models.DecimalField(max_digits=30, decimal_places=18, default=0)
    gas_price = models.DecimalField(max_digits=30, decimal_places=18, null=True, blank=True)
    gas_used = models.IntegerField(null=True, blank=True)
    
    # Addresses
    from_address = models.CharField(max_length=100)
    to_address = models.CharField(max_length=100)
    
    # Blockchain info
    block_number = models.BigIntegerField(null=True, blank=True)
    block_hash = models.CharField(max_length=100, null=True, blank=True)
    transaction_index = models.IntegerField(null=True, blank=True)
    nonce = models.BigIntegerField(null=True, blank=True)
    
    # Metadata
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount} {self.account.cryptocurrency.symbol}"

class WalletSecurity(models.Model):
    """Security settings and logs for wallets"""
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='security')
    
    # Security settings
    pin_hash = models.CharField(max_length=128, blank=True, null=True)
    pin_salt = models.CharField(max_length=32, blank=True, null=True)
    failed_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    
    # Backup settings
    backup_reminder_enabled = models.BooleanField(default=True)
    last_backup_reminder = models.DateTimeField(null=True, blank=True)
    
    # Security logs
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Security for {self.wallet.user.email}"
    

class PasscodeAttempt(models.Model):
    """Track passcode verification attempts for security"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passcode_attempt_logs')
    ip_address = models.GenericIPAddressField()
    success = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-attempted_at']
    
    def __str__(self):
        status = "Success" if self.success else "Failed"
        return f"{self.user.email} - {status} - {self.attempted_at}"