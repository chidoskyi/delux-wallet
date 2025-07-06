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

# 5. Import your custom User model
from backend.models import User  # Changed from django.contrib.auth.models
from backend.utils import WalletCrypto
from backend.serializers import CreateWalletSerializer
from django.test import RequestFactory

def test_django_integration():
    """Test Django integration with wallet creation"""
    print("Testing Django Integration...")
    
    # Create test user
    print("\n1. Creating test user...")
    user, created = User.objects.get_or_create(
        username='testuser_integration',
        defaults={
            'email': 'user1@example.com',
            'username': 'Test',
            'password': 'chidosky',
        }
    )
    
    if created:
        user.set_password('chidosky')
        user.save()
        print("✅ Test user created")
    else:
        print("✅ Using existing test user")
        # Clean up existing wallet
        if hasattr(user, 'wallet'):
            user.wallet.delete()
    
    # Test serializer directly
    print("\n2. Testing CreateWalletSerializer...")
    try:
        # Mock request
        factory = RequestFactory()
        request = factory.post('/')
        request.user = user
        
        # Test data
        serializer_data = {
            'wallet_name': 'Test Wallet Integration',
            'wallet_password': 'chidosky'
        }
        
        # Create serializer
        serializer = CreateWalletSerializer(
            data=serializer_data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            print("✅ Serializer validation passed")
            
            # Save wallet
            result = serializer.save()
            wallet = result['wallet']
            mnemonic = result['mnemonic']
            
            print(f"✅ Wallet created successfully!")
            print(f"  - Wallet ID: {wallet.id}")
            print(f"  - Wallet Name: {wallet.name}")
            print(f"  - Is Imported: {wallet.is_imported}")
            print(f"  - Mnemonic: {mnemonic}")
            print(f"  - Accounts created: {wallet.accounts.count()}")
            
            # Show account details
            for account in wallet.accounts.all():
                print(f"  - {account.cryptocurrency.name} ({account.cryptocurrency.symbol}): {account.address}")
            
            # Test mnemonic decryption
            print("\n3. Testing mnemonic decryption...")
            decrypted_mnemonic = wallet.get_mnemonic('chidosky')
            print(f"✅ Mnemonic decrypted: {decrypted_mnemonic}")
            
            # Test private key decryption
            print("\n4. Testing private key decryption...")
            for account in wallet.accounts.all():
                try:
                    private_key = account.get_private_key('chidosky')
                    print(f"✅ {account.cryptocurrency.name} private key: {private_key[:20]}...")
                except Exception as e:
                    print(f"❌ Failed to decrypt {account.cryptocurrency.name} private key: {e}")
            
        else:
            print(f"❌ Serializer validation failed: {serializer.errors}")
            
    except Exception as e:
        print(f"❌ Django integration test failed: {e}")
        import traceback
        traceback.print_exc()
    
    # Cleanup
    print("\n5. Cleaning up...")
    try:
        if hasattr(user, 'wallet'):
            user.wallet.delete()
        user.delete()
        print("✅ Cleanup completed")
    except Exception as e:
        print(f"Cleanup warning: {e}")
    
    print("\n" + "="*50)
    print("✅ DJANGO INTEGRATION TEST COMPLETED")
    print("="*50)

if __name__ == "__main__":
    test_django_integration()