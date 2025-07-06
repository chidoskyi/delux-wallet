import os
import sys
import django

# 1. Add project path to Python path FIRST
sys.path.append('C:/Users/NetPhixs/Desktop/dulux_app')

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# 3. Initialize Django IMMEDIATELY
try:
    django.setup()
except Exception as e:
    print(f"Failed to initialize Django: {e}")
    raise

# 4. Verify Django is properly initialized
from django.conf import settings
print(f"DEBUG: Using settings from {settings.SETTINGS_MODULE}")
print(f"DEBUG: INSTALLED_APPS: {settings.INSTALLED_APPS}")

from backend.utils import WalletCrypto
from django.test import RequestFactory
from backend.serializers import CreateWalletSerializer



def test_comprehensive_wallet_integration():
    """Comprehensive wallet creation and validation test"""
    print("🚀 Starting Comprehensive Wallet Integration Test...")
    
    # Test data
    test_cases = [
        {
            'name': 'Standard Wallet Creation',
            'data': {
                'wallet_name': 'Test Wallet Standard',
                'wallet_password': 'SecurePass123!'
            }
        },
        {
            'name': 'Imported Wallet Creation',
            'data': {
                'wallet_name': 'Test Wallet Imported',
                'wallet_password': 'SecurePass123!',
                'mnemonic': 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'='*20} Test Case {i}: {test_case['name']} {'='*20}")
        
        try:
            # Create test user
            user, created = User.objects.get_or_create(
                username=f'testuser_{i}',
                defaults={
                    'email': f'user{i}@example.com',
                    'password': 'testpass123'
                }
            )
            
            if created:
                user.set_password('testpass123')
                user.save()
            
            # Clean up existing wallet
            if hasattr(user, 'wallet'):
                user.wallet.delete()
            
            # Create mock request
            factory = RequestFactory()
            request = factory.post('/')
            request.user = user
            
            # Test serializer
            serializer = CreateWalletSerializer(
                data=test_case['data'],
                context={'request': request}
            )
            
            if serializer.is_valid():
                print("✅ Serializer validation passed")
                
                # Create wallet
                result = serializer.save()
                wallet = result['wallet']
                mnemonic = result['mnemonic']
                
                # Validate wallet creation
                assert wallet.user == user, "Wallet user mismatch"
                assert wallet.name == test_case['data']['wallet_name'], "Wallet name mismatch"
                assert wallet.accounts.count() >= 2, "Insufficient accounts created"
                
                print(f"✅ Wallet created: {wallet.name}")
                print(f"  - ID: {wallet.id}")
                print(f"  - Accounts: {wallet.accounts.count()}")
                
                # Test account validation
                for account in wallet.accounts.all():
                    crypto = WalletCrypto()
                    address_valid = crypto.validate_address_format(
                        account.address, 
                        account.cryptocurrency.name.lower()
                    )
                    assert address_valid, f"Invalid {account.cryptocurrency.name} address format"
                    print(f"  - ✅ {account.cryptocurrency.name}: {account.address}")
                
                # Test mnemonic decryption
                if test_case['data'].get('mnemonic'):
                    decrypted = wallet.get_mnemonic(test_case['data']['wallet_password'])
                    assert decrypted == test_case['data']['mnemonic'], "Mnemonic mismatch"
                    print("✅ Imported mnemonic verified")
                else:
                    assert mnemonic is not None, "No mnemonic returned for new wallet"
                    decrypted = wallet.get_mnemonic(test_case['data']['wallet_password'])
                    assert decrypted == mnemonic, "Generated mnemonic mismatch"
                    print("✅ Generated mnemonic verified")
                
                # Test private key access
                for account in wallet.accounts.all():
                    try:
                        private_key = account.get_private_key(test_case['data']['wallet_password'])
                        assert len(private_key) > 20, f"Invalid private key length for {account.cryptocurrency.name}"
                        print(f"  - ✅ {account.cryptocurrency.name} private key accessible")
                    except Exception as e:
                        print(f"  - ❌ {account.cryptocurrency.name} private key error: {e}")
                        raise
                
                # Test password validation
                crypto = WalletCrypto()
                password_validation = crypto.validate_wallet_password(test_case['data']['wallet_password'])
                print(f"  - Password strength: {password_validation['strength']}")
                
                print(f"✅ {test_case['name']} completed successfully")
                
            else:
                print(f"❌ Serializer validation failed: {serializer.errors}")
                raise AssertionError("Serializer validation failed")
            
            # Cleanup
            if hasattr(user, 'wallet'):
                user.wallet.delete()
            user.delete()
            
        except Exception as e:
            print(f"❌ {test_case['name']} failed: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    print(f"\n{'='*60}")
    print("🎉 ALL COMPREHENSIVE WALLET TESTS PASSED!")
    print("Your wallet integration is working perfectly!")
    print("="*60)

if __name__ == "__main__":
    test_comprehensive_wallet_integration()