# wallet/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from .models import User, Wallet, Account, CryptoCurrency, PasscodeAttempt
from .utils import WalletCrypto

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm', 'phone_number')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password are required.')
        
        return attrs
    
class PasscodeSetupSerializer(serializers.Serializer):
    """Serializer for setting up 4-digit passcode"""
    passcode = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    passcode_confirm = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    
    def validate(self, attrs):
        if attrs['passcode'] != attrs['passcode_confirm']:
            raise serializers.ValidationError("Passcodes don't match.")
        return attrs
    
    def save(self, user):
        """Set passcode for the user"""
        passcode = self.validated_data['passcode']
        user.set_passcode(passcode)
        return user

class PasscodeVerificationSerializer(serializers.Serializer):
    """Serializer for verifying passcode"""
    passcode = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    
    def validate_passcode(self, value):
        user = self.context['request'].user
        
        # Check if user has set a passcode
        if not user.has_passcode():
            raise serializers.ValidationError("No passcode has been set for this account.")
        
        # Check if account is locked
        if user.is_passcode_locked():
            remaining_time = user.get_passcode_lock_remaining_time()
            raise serializers.ValidationError(
                f"Account is locked due to too many failed attempts. "
                f"Try again in {remaining_time} minutes."
            )
        
        return value

class PasscodeChangeSerializer(serializers.Serializer):
    """Serializer for changing passcode"""
    current_passcode = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    new_passcode = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    new_passcode_confirm = serializers.CharField(
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    
    def validate(self, attrs):
        if attrs['new_passcode'] != attrs['new_passcode_confirm']:
            raise serializers.ValidationError("New passcodes don't match.")
        
        if attrs['current_passcode'] == attrs['new_passcode']:
            raise serializers.ValidationError("New passcode must be different from current passcode.")
        
        return attrs
    
    def validate_current_passcode(self, value):
        user = self.context['request'].user
        
        if not user.has_passcode():
            raise serializers.ValidationError("No passcode has been set for this account.")
        
        if user.is_passcode_locked():
            remaining_time = user.get_passcode_lock_remaining_time()
            raise serializers.ValidationError(
                f"Account is locked due to too many failed attempts. "
                f"Try again in {remaining_time} minutes."
            )
        
        if not user.verify_passcode(value):
            raise serializers.ValidationError("Current passcode is incorrect.")
        
        return value

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    has_passcode = serializers.SerializerMethodField()
    passcode_locked = serializers.SerializerMethodField()
    passcode_lock_remaining_time = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone_number', 'is_verified', 
                 'two_factor_enabled', 'biometric_enabled', 'created_at',
                 'has_passcode', 'passcode_locked', 'passcode_lock_remaining_time')
        read_only_fields = ('id', 'created_at', 'is_verified')
    
    def get_has_passcode(self, obj):
        return obj.has_passcode()
    
    def get_passcode_locked(self, obj):
        return obj.is_passcode_locked()
    
    def get_passcode_lock_remaining_time(self, obj):
        return obj.get_passcode_lock_remaining_time()

class CryptoCurrencySerializer(serializers.ModelSerializer):
    """Serializer for cryptocurrency info"""
    class Meta:
        model = CryptoCurrency
        fields = '__all__'

# class CreateWalletSerializer(serializers.Serializer):
#     """Serializer for creating a new wallet - now requires passcode verification"""
#     wallet_name = serializers.CharField(max_length=100, default="My Wallet")
#     wallet_password = serializers.CharField(write_only=True, min_length=8)
#     passcode = serializers.CharField(
#         write_only=True,
#         min_length=4,
#         max_length=4,
#         validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
#     )
#     mnemonic = serializers.CharField(required=False, help_text="Leave empty to generate new mnemonic")
    
#     def validate_mnemonic(self, value):
#         if value:
#             crypto = WalletCrypto()
#             if not crypto.validate_mnemonic(value):
#                 raise serializers.ValidationError("Invalid mnemonic phrase")
#         return value
    
#     def validate_passcode(self, value):
#         user = self.context['request'].user
        
#         # Check if user has set a passcode
#         if not user.has_passcode():
#             raise serializers.ValidationError(
#                 "You must set up a 4-digit passcode before creating a wallet."
#             )
        
#         # Check if account is locked
#         if user.is_passcode_locked():
#             remaining_time = user.get_passcode_lock_remaining_time()
#             raise serializers.ValidationError(
#                 f"Account is locked due to too many failed attempts. "
#                 f"Try again in {remaining_time} minutes."
#             )
        
#         # Verify the passcode
#         if not user.verify_passcode(value):
#             raise serializers.ValidationError("Invalid passcode.")
        
#         return value
    
#     def create(self, validated_data):
#         user = self.context['request'].user
#         crypto = WalletCrypto()
        
#         # Check if user already has a wallet
#         if hasattr(user, 'wallet'):
#             raise serializers.ValidationError("User already has a wallet")
        
#         wallet_name = validated_data['wallet_name']
#         wallet_password = validated_data['wallet_password']
#         mnemonic = validated_data.get('mnemonic')
        
#         # Log the passcode verification attempt
#         request = self.context['request']
#         PasscodeAttempt.objects.create(
#             user=user,
#             ip_address=self._get_client_ip(request),
#             success=True,
#             user_agent=request.META.get('HTTP_USER_AGENT', '')
#         )
        
#         # Generate or use provided mnemonic
#         if not mnemonic:
#             mnemonic = crypto.generate_mnemonic()
#             is_imported = False
#         else:
#             is_imported = True
        
#         # Create wallet
#         wallet = Wallet.objects.create(
#             user=user,
#             name=wallet_name,
#             is_imported=is_imported
#         )
        
#         # Encrypt and store mnemonic
#         wallet.set_mnemonic(mnemonic, wallet_password)
        
#         # Generate default cryptocurrency accounts
#         self._create_default_accounts(wallet, mnemonic, wallet_password)
        
#         return {
#             'wallet': wallet,
#             'mnemonic': mnemonic if not is_imported else None  # Only return mnemonic for new wallets
#         }
    
#     def _get_client_ip(self, request):
#         """Get client IP address from request"""
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip = x_forwarded_for.split(',')[0]
#         else:
#             ip = request.META.get('REMOTE_ADDR')
#         return ip
    
#     def _create_default_accounts(self, wallet, mnemonic, password):
#         """Create default cryptocurrency accounts"""
#         crypto = WalletCrypto()
        
#         # Get or create default cryptocurrencies
#         eth_currency, _ = CryptoCurrency.objects.get_or_create(
#             name="Ethereum",
#             symbol="ETH",
#             network="mainnet",
#             defaults={
#                 'derivation_path': "m/44'/60'/0'/0/0",
#                 'decimals': 18
#             }
#         )
        
#         btc_currency, _ = CryptoCurrency.objects.get_or_create(
#             name="Bitcoin",
#             symbol="BTC",
#             network="mainnet",
#             defaults={
#                 'derivation_path': "m/44'/0'/0'/0/0",
#                 'decimals': 8
#             }
#         )
        
#         # Generate multi-currency wallet
#         wallet_data = crypto.generate_multi_crypto_wallet(mnemonic)
        
#         # Create Ethereum account
#         eth_account = Account.objects.create(
#             wallet=wallet,
#             cryptocurrency=eth_currency,
#             address=wallet_data['wallets']['ethereum']['address'],
#             public_key=wallet_data['wallets']['ethereum']['public_key'],
#             account_index=0
#         )
#         eth_account.set_private_key(wallet_data['wallets']['ethereum']['private_key'], password)
        
#         # Create Bitcoin account
#         btc_account = Account.objects.create(
#             wallet=wallet,
#             cryptocurrency=btc_currency,
#             address=wallet_data['wallets']['bitcoin']['address'],
#             public_key=wallet_data['wallets']['bitcoin']['public_key'],
#             account_index=0
#         )
#         btc_account.set_private_key(wallet_data['wallets']['bitcoin']['private_key'], password)

class WalletSerializer(serializers.ModelSerializer):
    """Serializer for wallet info"""
    accounts_count = serializers.SerializerMethodField()
    total_balance_usd = serializers.SerializerMethodField()
    
    class Meta:
        model = Wallet
        fields = ('id', 'name', 'is_imported', 'backup_completed', 
                 'accounts_count', 'total_balance_usd', 'created_at', 'last_accessed')
        read_only_fields = ('id', 'created_at', 'last_accessed')
    
    def get_accounts_count(self, obj):
        """Return the number of blockchain accounts in this multi-coin wallet (Trust Wallet style)"""
        # Trust Wallet uses a Multi-Coin Wallet structure where each blockchain 
        # has its own account derived from the same mnemonic using BIP44/BIP84 derivation paths
        # Example: Bitcoin (m/44'/0'/0'/0/0), Ethereum (m/44'/60'/0'/0/0), etc.
        
        # Define supported blockchains (like Trust Wallet's registry)
        supported_chains = [
            'bitcoin',      # BIP44 coin type 0
            'ethereum',     # BIP44 coin type 60
            'binance',      # BIP44 coin type 714
            'polygon',      # Uses same derivation as Ethereum
            'litecoin',     # BIP44 coin type 2
            # Add more chains as needed
        ]
        
        # Trust Wallet typically shows one account per blockchain
        # Each account represents the default derivation path for that chain
        return len(supported_chains)
    
    def get_total_balance_usd(self, obj):
        """Calculate total portfolio balance across all blockchain accounts (Trust Wallet style)"""
        # Trust Wallet calculates balance by:
        # 1. Using BIP39 mnemonic to derive addresses for each supported blockchain
        # 2. Querying blockchain APIs for each address balance
        # 3. Converting all balances to USD using real-time rates
        # 4. Summing the total portfolio value
        
        try:
            total_balance_usd = 0.0
            
            # Chain configurations (like Trust Wallet's registry)
            chain_configs = {
                'bitcoin': {
                    'coin_type': 0,
                    'derivation_path': "m/84'/0'/0'/0/0",  # BIP84 for native segwit
                    'api_endpoint': 'blockchair.com/bitcoin/dashboards/address/',
                },
                'ethereum': {
                    'coin_type': 60,
                    'derivation_path': "m/44'/60'/0'/0/0",  # BIP44 standard
                    'api_endpoint': 'api.etherscan.io/api',
                },
                'binance': {
                    'coin_type': 714,
                    'derivation_path': "m/44'/714'/0'/0/0",
                    'api_endpoint': 'api.bscscan.com/api',
                },
                # Add more chains as needed
            }
            
            # This is where you'd implement actual balance fetching:
            # for chain_name, config in chain_configs.items():
            #     try:
            #         # 1. Derive address from mnemonic using derivation path
            #         address = self._derive_address(obj, config['derivation_path'])
            #         
            #         # 2. Query blockchain API for balance
            #         balance = self._get_chain_balance(address, config['api_endpoint'])
            #         
            #         # 3. Convert to USD using current exchange rates
            #         usd_value = self._convert_to_usd(balance, chain_name)
            #         
            #         total_balance_usd += usd_value
            #     except Exception as e:
            #         # Continue with other chains if one fails
            #         continue
            
            # For now, return 0.0 - implement the actual fetching logic above
            return total_balance_usd
            
        except Exception as e:
            # Return 0.0 if balance calculation fails (wallet should still load)
            return 0.0
    
    # Helper methods you'd need to implement:
    # def _derive_address(self, wallet_obj, derivation_path):
    #     """Derive address from wallet mnemonic using BIP32/BIP44 derivation"""
    #     pass
    #     
    # def _get_chain_balance(self, address, api_endpoint):
    #     """Query blockchain API for address balance"""
    #     pass
    #     
    # def _convert_to_usd(self, balance, chain_name):
    #     """Convert blockchain balance to USD using current rates"""
    #     pass

class PasscodeRequiredActionSerializer(serializers.Serializer):
    """Base serializer for actions that require passcode verification"""
    passcode = serializers.CharField(
        write_only=True,
        min_length=4,
        max_length=4,
        validators=[RegexValidator(r'^\d{4}$', 'Passcode must be exactly 4 digits.')]
    )
    
    def validate_passcode(self, value):
        user = self.context['request'].user
        
        # Check if user has set a passcode
        if not user.has_passcode():
            raise serializers.ValidationError("No passcode has been set for this account.")
        
        # Check if account is locked
        if user.is_passcode_locked():
            remaining_time = user.get_passcode_lock_remaining_time()
            raise serializers.ValidationError(
                f"Account is locked due to too many failed attempts. "
                f"Try again in {remaining_time} minutes."
            )
        
        # Verify the passcode
        if not user.verify_passcode(value):
            # Log failed attempt
            request = self.context['request']
            PasscodeAttempt.objects.create(
                user=user,
                ip_address=self._get_client_ip(request),
                success=False,
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            raise serializers.ValidationError("Invalid passcode.")
        
        # Log successful attempt
        request = self.context['request']
        PasscodeAttempt.objects.create(
            user=user,
            ip_address=self._get_client_ip(request),
            success=True,
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return value
    
    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class RevealMnemonicSerializer(PasscodeRequiredActionSerializer):
    """Serializer for revealing mnemonic phrase"""
    wallet_password = serializers.CharField(write_only=True)

class BackupWalletSerializer(PasscodeRequiredActionSerializer):
    """Serializer for confirming wallet backup"""
    wallet_password = serializers.CharField(write_only=True)

class MnemonicVerificationSerializer(serializers.Serializer):
    """Serializer for verifying specific words from mnemonic phrase"""
    word_positions = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True
    )
    word_answers = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )
    mnemonic = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        words = attrs['mnemonic'].split()
        positions = attrs['word_positions']
        answers = attrs['word_answers']
        
        if len(positions) != len(answers):
            raise serializers.ValidationError("Number of positions and answers don't match")
            
        for pos, answer in zip(positions, answers):
            if pos < 1 or pos > len(words):
                raise serializers.ValidationError(f"Invalid word position: {pos}")
            if words[pos-1] != answer:  # pos-1 because positions are 1-based
                raise serializers.ValidationError("Incorrect word verification")
        
        return attrs

class WalletCreationSerializer(serializers.Serializer):
    """Serializer for creating a new wallet with mnemonic verification"""
    wallet_name = serializers.CharField(max_length=100, default="My Wallet")
    wallet_password = serializers.CharField(write_only=True, min_length=8)
    mnemonic = serializers.CharField(write_only=True, required=False)  # Optional for generation
    verification = MnemonicVerificationSerializer(required=False)  # Required
    def validate_mnemonic(self, value):
        if value:
            crypto = WalletCrypto()
            if not crypto.validate_mnemonic(value):
                raise serializers.ValidationError("Invalid mnemonic phrase")
        return value

class WalletImportSerializer(PasscodeRequiredActionSerializer):
    """Serializer for importing an existing wallet"""
    wallet_name = serializers.CharField(max_length=100, default="My Wallet")
    wallet_password = serializers.CharField(write_only=True, min_length=8)
    mnemonic = serializers.CharField(write_only=True)

    def validate_mnemonic(self, value):
        from .utils import WalletCrypto
        crypto = WalletCrypto()
        if not crypto.validate_mnemonic(value):
            raise serializers.ValidationError("Invalid mnemonic phrase")
        return value
