# wallet/views_wallet.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from typing import List

from .serializers_wallet import WalletCreationSerializer, WalletImportSerializer
from .models import Wallet, CryptoCurrency, Account
from .utils import WalletCrypto
import random

class InitialWalletView(APIView):
    """View for initial wallet setup options after login"""
    permission_classes = [IsAuthenticated]
    
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
    permission_classes = [IsAuthenticated]
    
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
                        'setup_endpoint': '/api/v1/auth/passcode/setup/'
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
                        'view_wallet': '/api/v1/wallet/detail/',
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
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Check if user already has a wallet
            if hasattr(request.user, 'wallet'):
                return Response({
                    'error': 'User already has a wallet'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = WalletImportSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Create wallet with imported mnemonic
            with transaction.atomic():
                wallet = Wallet.objects.create(
                    user=request.user,
                    name=serializer.validated_data['wallet_name'],
                    is_imported=True
                )
                
                # Encrypt and store mnemonic
                wallet.set_mnemonic(
                    serializer.validated_data['mnemonic'],
                    serializer.validated_data['wallet_password']
                )
                
                return Response({
                    'message': 'Wallet imported successfully',
                    'wallet': {
                        'id': str(wallet.id),
                        'name': wallet.name,
                        'created_at': wallet.created_at
                    },
                    'next': {
                        'view_wallet': '/api/v1/wallet/detail/'
                    }
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
