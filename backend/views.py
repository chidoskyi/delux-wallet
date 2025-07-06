# wallet/views.py
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import authenticate
from django.db import transaction
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from datetime import datetime
from typing import List
import logging
import requests
import random

from wallet.services import CryptoPriceService

from .models import User, Wallet, Account, CryptoCurrency, Transaction, PasscodeAttempt
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer, WalletSerializer, CryptoCurrencySerializer,
    PasscodeRequiredActionSerializer, WalletCreationSerializer, WalletImportSerializer,
    MnemonicVerificationSerializer
)
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    PasscodeSetupSerializer,
    PasscodeVerificationSerializer,
    PasscodeChangeSerializer,
)
from .utils import WalletCrypto

logger = logging.getLogger(__name__)

# In your view:
# logger.debug(f"Encrypting private key: {private_key}")
# encrypted_data = crypto.encrypt_data(private_key, password)
# logger.debug(f"Encryption result: {encrypted_data[:20]}...")

class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'next_steps': {
                'requires_passcode_setup': True,
                'message': 'Please set up a 4-digit passcode to secure your wallet operations.',
                'setup_endpoint': '/api/v1/auth/passcode/setup/'
            }
        }, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
        
        # Determine next steps based on user status
        has_wallet = hasattr(user, 'wallet')
        has_passcode = user.has_passcode()
        
        if has_wallet:
            if has_passcode:
                response_data['next_steps'] = {
                    'requires_passcode_verification': True,
                    'message': 'Please enter your passcode to access your wallet',
                    'verify_endpoint': '/auth/passcode/verify/',
                    'next_view': '/wallet/detail/'
                }
            else:
                response_data['next_steps'] = {
                    'requires_passcode_setup': True,
                    'message': 'Please set up a 4-digit passcode to access your wallet',
                    'setup_endpoint': '/auth/passcode/setup/',
                    'next_view': '/wallet/detail/'
                }
        else:
            if has_passcode:
                response_data['next_steps'] = {
                    'setup_wallet': True,
                    'message': 'Choose to create a new wallet or import an existing one',
                    'setup_endpoint': '/wallet/setup/',
                    'options': {
                        'create_new': {
                            'endpoint': '/wallet/create/new/',
                            'description': 'Create a new wallet with generated mnemonic phrase',
                            'requires_passcode': False
                        },
                        'import_existing': {
                            'endpoint': '/wallet/import/',
                            'description': 'Import an existing wallet using mnemonic phrase',
                            'requires_passcode': False
                        }
                    }
                }
            else:
                response_data['next_steps'] = {
                    'requires_passcode_setup': True,
                    'message': 'Please set up a 4-digit passcode before creating or importing a wallet',
                    'setup_endpoint': '/auth/passcode/setup/',
                    'next_view': '/wallet/setup/'
                }
        
        return Response(response_data)

class UserProfileView(generics.RetrieveUpdateAPIView):  
    """User profile endpoint"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_mnemonic(request):
    """Generate a new mnemonic phrase"""
    try:
        strength = request.data.get('strength', 128)  # 12 words by default
        
        # Validate strength
        if strength not in [128, 160, 192, 224, 256]:
            return Response({
                'error': 'Invalid strength. Must be 128, 160, 192, 224, or 256'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        crypto = WalletCrypto()
        mnemonic = crypto.generate_mnemonic(strength)
        
        return Response({
            'mnemonic': mnemonic,
            'word_count': len(mnemonic.split())
        })
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def validate_mnemonic(request):
    """Validate a mnemonic phrase"""
    try:
        mnemonic = request.data.get('mnemonic')
        
        if not mnemonic:
            return Response({
                'error': 'Mnemonic phrase is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        crypto = WalletCrypto()
        is_valid = crypto.validate_mnemonic(mnemonic)
        
        return Response({
            'is_valid': is_valid,
            'word_count': len(mnemonic.split()) if is_valid else 0
        })
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_wallet_password(request):
    """Verify wallet password"""
    try:
        wallet = request.user.wallet
        password = request.data.get('password')
        
        if not password:
            return Response({
                'error': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Try to decrypt mnemonic with provided password
            mnemonic = wallet.get_mnemonic(password)
            return Response({
                'valid': True,
                'message': 'Password is correct'
            })
        except ValueError:
            return Response({
                'valid': False,
                'message': 'Invalid password'
            })
    
    except Wallet.DoesNotExist:
        return Response({
            'error': 'No wallet found for this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def backup_wallet(request):
    """Mark wallet as backed up after user confirms storing mnemonic phrase"""
    try:
        # First ensure user has set up a passcode
        if not request.user.has_passcode():
            return Response({
                'error': 'Passcode setup required',
                'message': 'Please set up a passcode to confirm wallet backup.',
                'next_steps': {
                    'requires_passcode_setup': True,
                    'setup_endpoint': '/api/v1/auth/passcode/setup/'
                }
            }, status=status.HTTP_403_FORBIDDEN)
            
        # Verify passcode using PasscodeRequiredActionSerializer
        passcode_serializer = PasscodeRequiredActionSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if not passcode_serializer.is_valid():
            return Response({
                'error': 'Passcode verification required',
                'details': passcode_serializer.errors,
                'next_steps': {
                    'requires_passcode_verification': True,
                    'verify_endpoint': '/api/v1/auth/passcode/verify/',
                    'next_view': '/api/v1/wallet/backup/'
                }
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get wallet with select_for_update to prevent race conditions
            wallet = Wallet.objects.select_for_update().get(user=request.user)
            
            # Verify wallet password
            wallet_password = request.data.get('wallet_password')
            if not wallet_password:
                return Response({
                    'error': 'Wallet password is required to confirm backup',
                    'message': 'Please provide your wallet password to verify mnemonic backup'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Verify password by attempting to decrypt mnemonic
                mnemonic = wallet.get_mnemonic(wallet_password)
                
                # Verify that user has confirmed each requirement
                backup_confirmations = request.data.get('backup_confirmations', [])
                required_confirmations = [
                    'wrote_down',
                    'stored_safely',
                    'understand_importance'
                ]
                
                missing_confirmations = [
                    conf for conf in required_confirmations 
                    if conf not in backup_confirmations
                ]
                
                if missing_confirmations:
                    return Response({
                        'error': 'Incomplete backup confirmation',
                        'message': 'Please confirm all backup requirements',
                        'missing_confirmations': missing_confirmations,
                        'required_confirmations': {
                            'wrote_down': 'I have written down my mnemonic phrase',
                            'stored_safely': 'I have stored it in a secure location',
                            'understand_importance': 'I understand its importance for wallet recovery'
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Mark wallet as backed up
                wallet.backup_completed = True
                wallet.save()
                
                return Response({
                    'success': True,
                    'message': 'Wallet backup confirmed successfully',
                    'backup_completed': True,
                    'next_steps': {
                        'view_wallet': '/api/v1/wallet/detail/'
                    }
                })
            
            except ValueError:
                return Response({
                    'error': 'Invalid wallet password',
                    'message': 'Please provide the correct wallet password'
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except Wallet.DoesNotExist:
            return Response({
                'error': 'No wallet found',
                'message': 'Please create or import a wallet first'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        logger.error(f"Unexpected error during wallet backup confirmation: {str(e)}", exc_info=True)
        return Response({
            'error': 'An unexpected error occurred',
            'message': 'Please try again or contact support if the problem persists'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reveal_mnemonic(request):
    """Reveal mnemonic phrase (requires password)"""
    try:
        wallet = request.user.wallet
        password = request.data.get('password')
        
        if not password:
            return Response({
                'error': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mnemonic = wallet.get_mnemonic(password)
            return Response({
                'mnemonic': mnemonic,
                'warning': 'Keep your mnemonic phrase secure and never share it with anyone'
            })
        
        except ValueError:
            return Response({
                'error': 'Invalid password'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Wallet.DoesNotExist:
        return Response({
            'error': 'No wallet found for this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SupportedCurrenciesView(generics.ListAPIView):
    """List all supported cryptocurrencies"""
    queryset = CryptoCurrency.objects.filter(is_active=True)
    serializer_class = CryptoCurrencySerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def wallet_status(request):
    """Get wallet status and basic info"""
    try:
        user = request.user
        
        # First check if user has a passcode set up
        if not user.has_passcode():
            return Response({
                'error': 'Passcode setup required',
                'message': 'Please set up a 4-digit passcode to access wallet.',
                'next_steps': {
                    'requires_passcode_setup': True,
                    'setup_endpoint': '/api/v1/auth/passcode/setup/'
                }
            }, status=status.HTTP_403_FORBIDDEN)
            
        # Verify passcode using PasscodeRequiredActionSerializer
        passcode_serializer = PasscodeRequiredActionSerializer(
            data=request.query_params,
            context={'request': request}
        )
        
        if not passcode_serializer.is_valid():
            return Response({
                'error': 'Passcode verification failed',
                'details': passcode_serializer.errors,
                'requires_passcode': True
            }, status=status.HTTP_403_FORBIDDEN)
        
        has_wallet = hasattr(user, 'wallet')
        
        if has_wallet:
            wallet = user.wallet
            return Response({
                'has_wallet': True,
                'wallet_id': wallet.id,
                'wallet_name': wallet.name,
                'backup_completed': wallet.backup_completed,
                'accounts_count': wallet.accounts.filter(is_active=True).count(),
                'created_at': wallet.created_at,
            })
        else:
            return Response({
                'has_wallet': False,
                'message': 'No wallet found. Create a new wallet to get started.'
            })
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setup_passcode(request):
    """Set up a new 4-digit passcode"""
    serializer = PasscodeSetupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save(user=request.user)
        return Response({
            'message': 'Passcode setup successful',
            'has_passcode': True
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disable_passcode(request):
    """Disable the existing passcode"""
    user = request.user
    user.disable_passcode()
    return Response({
        'message': 'Passcode disabled successfully',
        'has_passcode': False
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_passcode(request):
    """Verify an existing passcode"""
    serializer = PasscodeVerificationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        success = request.user.verify_passcode(serializer.validated_data['passcode'])
        return Response({
            'valid': success,
            'locked': request.user.is_passcode_locked(),
            'lock_remaining_time': request.user.get_passcode_lock_remaining_time() if request.user.is_passcode_locked() else 0
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_passcode(request):
    """Change existing passcode"""
    serializer = PasscodeChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        new_passcode = serializer.validated_data['new_passcode']
        user.set_passcode(new_passcode)
        return Response({
            'message': 'Passcode changed successfully',
            'has_passcode': True
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def passcode_status(request):
    """Get user's passcode and wallet status"""
    user = request.user
    has_wallet = hasattr(user, 'wallet') and user.wallet is not None

    return Response({
        'has_passcode': user.has_passcode(),
        'is_locked': user.is_passcode_locked(),
        'lock_remaining_time': user.get_passcode_lock_remaining_time() if user.is_passcode_locked() else 0,
        'has_wallet': has_wallet
    })




class InitialWalletView(APIView):
    """View for initial wallet setup options after login"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if hasattr(request.user, 'wallet'):
            return Response({
                'error': 'User already has a wallet',
                'existing_wallet': {
                    'id': str(request.user.wallet.id),
                    'name': request.user.wallet.name,
                    'created_at': request.user.wallet.created_at
                }
            }, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({
            'message': 'Please choose to create a new wallet or import an existing one',
            'options': {
                'create_new': {
                    'endpoint': '/api/v1/wallet/create/new/',
                    'description': 'Create a new wallet with generated mnemonic phrase'
                },
                'import_existing': {
                    'endpoint': '/api/v1/wallet/import/',
                    'description': 'Import an existing wallet using mnemonic phrase'
                }
            }
        })

class CreateNewWalletView(APIView):
    """View for creating a new wallet with mnemonic verification"""
    permission_classes = [permissions.IsAuthenticated]
    
    def _verify_mnemonic_words(self, mnemonic: str, positions: List[int], answers: List[str]) -> bool:
        """Helper method to verify specific words from the mnemonic phrase"""
        if not mnemonic or not positions or not answers:
            return False
            
        words = mnemonic.split()
        if len(positions) != len(answers):
            return False
            
        for pos, answer in zip(positions, answers):
            # Convert position to 0-based index
            idx = pos - 1
            if idx < 0 or idx >= len(words) or words[idx].lower() != answer.lower():
                return False
        return True
    
    def post(self, request):
        try:
            # Check if user already has a wallet
            if hasattr(request.user, 'wallet'):
                return Response({
                    'error': 'User already has a wallet'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # First ensure user has set up a passcode
            if not request.user.has_passcode():
                return Response({
                    'error': 'Passcode setup required',
                    'message': 'Please set up a 4-digit passcode before creating a wallet.',
                    'next_steps': {
                        'requires_passcode_setup': True,
                        'setup_endpoint': '/auth/passcode/setup/'
                    }
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Step 1: Generate new mnemonic if not in verification phase
            if 'verification' not in request.data:
                crypto = WalletCrypto()
                mnemonic = crypto.generate_mnemonic()
                words = mnemonic.split()
                
                # Select random words for verification (3 words)
                verify_positions = sorted(random.sample(range(1, len(words) + 1), 3))
                
                return Response({
                    'step': 'verify_mnemonic',
                    'mnemonic': mnemonic,
                    'security_warning': {
                        'message': 'Write down your mnemonic phrase securely.',
                        'importance': 'HIGH - This is your only backup!',
                        'backup_tips': [
                            'Write it down on paper',
                            'Store in a secure location',
                            'Never share with anyone',
                            'Never store digitally',
                            'Verify before proceeding'
                        ]
                    },
                    'verification': {
                        'word_positions': verify_positions,
                        'message': 'Please verify the following words from your mnemonic phrase',
                        'instructions': [
                            f'Word #{pos}' for pos in verify_positions
                        ]
                    }
                })
            
            # Step 2: Verify and create wallet
            serializer = WalletCreationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify mnemonic words match
            verification_data = serializer.validated_data['verification']
            mnemonic = serializer.validated_data['mnemonic']    
            
            if not self._verify_mnemonic_words(
                mnemonic=mnemonic,
                positions=verification_data['word_positions'],
                answers=verification_data['word_answers']
            ):
                return Response({
                    'error': 'Mnemonic verification failed',
                    'message': 'The words you entered do not match the mnemonic phrase'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create wallet with verified mnemonic
            with transaction.atomic():
                wallet = Wallet.objects.create(
                    user=request.user,
                    name=serializer.validated_data['wallet_name'],
                    is_imported=False  # This is a new wallet
                )
                
                # Encrypt and store mnemonic
                wallet_password = serializer.validated_data['wallet_password']
                wallet.set_mnemonic(mnemonic, wallet_password)
                
                # Create default accounts (Bitcoin and Ethereum)
                crypto = WalletCrypto()
                wallet_data = crypto.generate_multi_crypto_wallet(mnemonic)
                
                # Create Ethereum account
                eth_currency, _ = CryptoCurrency.objects.get_or_create(
                    name="Ethereum",
                    symbol="ETH",
                    network="mainnet",
                    defaults={
                        'derivation_path': "m/44'/60'/0'/0/0",
                        'decimals': 18
                    }
                )
                
                eth_account = Account.objects.create(
                    wallet=wallet,
                    cryptocurrency=eth_currency,
                    address=wallet_data['wallets']['ethereum']['address'],
                    public_key=wallet_data['wallets']['ethereum']['public_key'],
                    account_index=0
                )
                eth_account.set_private_key(wallet_data['wallets']['ethereum']['private_key'], wallet_password)
                
                # Create Bitcoin account
                btc_currency, _ = CryptoCurrency.objects.get_or_create(
                    name="Bitcoin",
                    symbol="BTC",
                    network="mainnet",
                    defaults={
                        'derivation_path': "m/44'/0'/0'/0/0",
                        'decimals': 8
                    }
                )
                
                btc_account = Account.objects.create(
                    wallet=wallet,
                    cryptocurrency=btc_currency,
                    address=wallet_data['wallets']['bitcoin']['address'],
                    public_key=wallet_data['wallets']['bitcoin']['public_key'],
                    account_index=0
                )
                btc_account.set_private_key(wallet_data['wallets']['bitcoin']['private_key'], wallet_password)
                
                return Response({
                    'success': True,
                    'message': 'Wallet created successfully',
                    'wallet': {
                        'id': str(wallet.id),
                        'name': wallet.name,
                        'created_at': wallet.created_at,
                        'accounts_created': [
                            {'name': 'Bitcoin', 'symbol': 'BTC', 'address': btc_account.address},
                            {'name': 'Ethereum', 'symbol': 'ETH', 'address': eth_account.address}
                        ]
                    },
                    'next': {
                        'view_wallet': '/wallet/detail/',
                        'backup_reminder': 'Make sure you have securely stored your mnemonic phrase'
                    }
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            transaction.rollback()
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImportWalletView(APIView):
    """View for importing an existing wallet"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # First ensure user has set up a passcode
            if not request.user.has_passcode():
                return Response({
                    'error': 'Passcode setup required',
                    'message': 'Please set up a passcode before importing a wallet',
                    'next_steps': {
                        'requires_passcode_setup': True,
                        'setup_endpoint': '/api/v1/auth/passcode/setup/',
                        'next_view': '/api/v1/wallet/import/'
                    }
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Verify passcode using PasscodeRequiredActionSerializer
            passcode_serializer = PasscodeRequiredActionSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if not passcode_serializer.is_valid():
                return Response({
                    'error': 'Passcode verification required',
                    'details': passcode_serializer.errors,
                    'next_steps': {
                        'requires_passcode_verification': True,
                        'verify_endpoint': '/api/v1/auth/passcode/verify/',
                        'next_view': '/api/v1/wallet/import/'
                    }
                }, status=status.HTTP_403_FORBIDDEN)

            with transaction.atomic():
                # Check if user already has a wallet with select_for_update to prevent race condition
                try:
                    wallet = Wallet.objects.select_for_update().get(user=request.user)
                    return Response({
                        'error': 'User already has a wallet',
                        'existing_wallet': {
                            'id': str(wallet.id),
                            'name': wallet.name,
                            'created_at': wallet.created_at
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
                except Wallet.DoesNotExist:
                    pass

                # Validate mnemonic and import wallet
                serializer = WalletImportSerializer(
                    data=request.data,
                    context={'request': request}
                )
                
                if not serializer.is_valid():
                    return Response({
                        'error': 'Validation failed',
                        'details': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    # Validate mnemonic format and checksum
                    mnemonic = serializer.validated_data['mnemonic']
                    crypto = WalletCrypto()
                    if not crypto.validate_mnemonic(mnemonic):
                        return Response({
                            'error': 'Invalid mnemonic phrase',
                            'message': 'The mnemonic phrase provided is not valid. Please check and try again.'
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Create wallet with imported mnemonic
                    wallet = Wallet.objects.create(
                        user=request.user,
                        name=serializer.validated_data['wallet_name'],
                        is_imported=True
                    )
                    
                    wallet_password = serializer.validated_data['wallet_password']
                    
                    # Encrypt and store mnemonic
                    wallet.set_mnemonic(mnemonic, wallet_password)
                    
                    # Create default accounts from imported mnemonic
                    wallet_data = crypto.generate_multi_crypto_wallet(mnemonic)
                    
                    # Create Ethereum account
                    eth_currency, _ = CryptoCurrency.objects.get_or_create(
                        name="Ethereum",
                        symbol="ETH",
                        network="mainnet",
                        defaults={
                            'derivation_path': "m/44'/60'/0'/0/0",
                            'decimals': 18
                        }
                    )
                    
                    eth_account = Account.objects.create(
                        wallet=wallet,
                        cryptocurrency=eth_currency,
                        address=wallet_data['wallets']['ethereum']['address'],
                        public_key=wallet_data['wallets']['ethereum']['public_key'],
                        account_index=0
                    )
                    eth_account.set_private_key(wallet_data['wallets']['ethereum']['private_key'], wallet_password)
                    
                    # Create Bitcoin account
                    btc_currency, _ = CryptoCurrency.objects.get_or_create(
                        name="Bitcoin",
                        symbol="BTC",
                        network="mainnet",
                        defaults={
                            'derivation_path': "m/44'/0'/0'/0/0",
                            'decimals': 8
                        }
                    )
                    
                    btc_account = Account.objects.create(
                        wallet=wallet,
                        cryptocurrency=btc_currency,
                        address=wallet_data['wallets']['bitcoin']['address'],
                        public_key=wallet_data['wallets']['bitcoin']['public_key'],
                        account_index=0
                    )
                    btc_account.set_private_key(wallet_data['wallets']['bitcoin']['private_key'], wallet_password)
                    
                    return Response({
                        'success': True,
                        'message': 'Wallet imported successfully',
                        'wallet': {
                            'id': str(wallet.id),
                            'name': wallet.name,
                            'created_at': wallet.created_at,
                            'accounts_created': [
                                {'name': 'Bitcoin', 'symbol': 'BTC', 'address': btc_account.address},
                                {'name': 'Ethereum', 'symbol': 'ETH', 'address': eth_account.address}
                            ]
                        },
                        'next_steps': {
                            'verify_backup': True,
                            'backup_endpoint': '/api/v1/wallet/backup/',
                            'message': 'Please confirm that you have safely stored your mnemonic phrase',
                            'next_view': '/api/v1/wallet/detail/'
                        }
                    }, status=status.HTTP_201_CREATED)
                    
                except Exception as e:
                    logger.error(f"Failed to import wallet: {str(e)}", exc_info=True)
                    raise ValidationError('Failed to import wallet. Please verify your mnemonic phrase and try again.')
                
        except ValidationError as e:
            return Response({
                'error': 'Validation failed',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            transaction.rollback()
            logger.error(f"Unexpected error during wallet import: {str(e)}", exc_info=True)
            return Response({
                'error': 'An unexpected error occurred',
                'message': 'Please try again or contact support if the problem persists'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

 # wallet/views_passcode.py





class WalletDetailView(generics.RetrieveAPIView):
    """Get wallet details"""
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        try:
            return self.request.user.wallet
        except Wallet.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        # First ensure user has set up a passcode
        if not request.user.has_passcode():
            return Response({
                'error': 'Passcode setup required',
                'message': 'Please set up a 4-digit passcode to view wallet details.',
                'next_steps': {
                    'requires_passcode_setup': True,
                    'setup_endpoint': '/api/v1/auth/passcode/setup/'
                }
            }, status=status.HTTP_403_FORBIDDEN)
            
        # Verify passcode using PasscodeRequiredActionSerializer
        passcode_serializer = PasscodeRequiredActionSerializer(
            data=request.query_params,
            context={'request': request}
        )
        
        if not passcode_serializer.is_valid():
            return Response({
                'error': 'Passcode verification failed',
                'details': passcode_serializer.errors,
                'requires_passcode': True
            }, status=status.HTTP_403_FORBIDDEN)
            
        wallet = self.get_object()
        if not wallet:
            return Response({
                'error': 'No wallet found for this user',
                'can_create_wallet': True,
                'endpoints': {
                    'create_wallet': '/api/v1/wallet/create/new/',
                    'import_wallet': '/api/v1/wallet/import/'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)


class AccountBalancesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            wallet = request.user.wallet
            accounts = wallet.accounts.filter(is_active=True)
            
            total_balance = 0.0
            balances = []

            for account in accounts:
                account.update_balance_from_blockchain(force=False)
                bal = float(account.balance)
                total_balance += bal

                balances.append({
                    'symbol': account.cryptocurrency.symbol,
                    'balance': bal,
                    'address': account.address,
                    'last_updated': account.last_balance_update
                })

            return Response({
                'balances': balances,
                'total_balance': total_balance  # Aggregated total
            })

        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet not found'}, status=404)

class WalletAccountsView(APIView):
    """Get all accounts in wallet"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # First ensure user has set up a passcode
            if not request.user.has_passcode():
                return Response({
                    'error': 'Passcode setup required',
                    'message': 'Please set up a 4-digit passcode to view wallet accounts.',
                    'next_steps': {
                        'requires_passcode_setup': True,
                        'setup_endpoint': '/api/v1/auth/passcode/setup/'
                    }
                }, status=status.HTTP_403_FORBIDDEN)
                
            # Verify passcode using PasscodeRequiredActionSerializer
            passcode_serializer = PasscodeRequiredActionSerializer(
                data=request.query_params,
                context={'request': request}
            )
            
            if not passcode_serializer.is_valid():
                return Response({
                    'error': 'Passcode verification failed',
                    'details': passcode_serializer.errors,
                    'requires_passcode': True
                }, status=status.HTTP_403_FORBIDDEN)
            
            wallet = request.user.wallet
            accounts = wallet.accounts.filter(is_active=True)
            
            accounts_data = []
            for account in accounts:
                accounts_data.append({
                    'id': account.id,
                    'cryptocurrency': CryptoCurrencySerializer(account.cryptocurrency).data,
                    'address': account.address,
                    'balance': str(account.balance),
                    'account_index': account.account_index,
                    'last_balance_update': account.last_balance_update,
                })
            
            return Response({
                'accounts': accounts_data,
                'total_accounts': len(accounts_data)
            })
        
        except Wallet.DoesNotExist:
            return Response({
                'error': 'No wallet found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def enhanced_crypto_prices(request):
    """Enhanced crypto prices endpoint with multiple API fallbacks"""
    symbols = request.GET.get('symbols', 'BTC,ETH').split(',')
    symbols = [s.strip().upper() for s in symbols]
    
    price_service = CryptoPriceService()
    prices = price_service.get_prices(symbols)
    
    return Response({
        'prices': prices,
        'timestamp': datetime.now().isoformat(),
        'symbols_requested': symbols
    })

@api_view(['GET'])
def refresh_account_balance(request, account_id):
    """Manually refresh a specific account balance"""
    try:
        account = Account.objects.get(id=account_id, wallet__user=request.user)
        account.update_balance_from_blockchain(force=True)
        
        return Response({
            'success': True,
            'balance': str(account.balance),
            'last_updated': account.last_balance_update
        })
    except Account.DoesNotExist:
        return Response({'error': 'Account not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def refresh_all_balances(request):
    """Refresh all account balances for the user"""
    try:
        wallet = request.user.wallet
        accounts = wallet.accounts.filter(is_active=True)
        
        updated_accounts = []
        for account in accounts:
            old_balance = account.balance
            account.update_balance_from_blockchain(force=True)
            
            updated_accounts.append({
                'symbol': account.cryptocurrency.symbol,
                'address': account.address,
                'old_balance': str(old_balance),
                'new_balance': str(account.balance),
                'changed': old_balance != account.balance
            })
        
        return Response({
            'success': True,
            'updated_accounts': updated_accounts,
            'total_accounts': len(updated_accounts)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)