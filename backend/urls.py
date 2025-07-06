# wallet/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

app_name = 'wallet'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'),
    
    # Passcode management
    path('auth/passcode/setup/', views.setup_passcode, name='setup_passcode'),
    path('auth/passcode/verify/', views.verify_passcode, name='verify_passcode'),
    path('auth/passcode/change/', views.change_passcode, name='change_passcode'),
    path('auth/passcode/status/', views.passcode_status, name='passcode_status'),

    # Mnemonic utilities
    path('mnemonic/generate/', views.generate_mnemonic, name='generate_mnemonic'),
    path('mnemonic/validate/', views.validate_mnemonic, name='validate_mnemonic'),
    
    # Wallet management
    path('wallet/setup/', views.InitialWalletView.as_view(), name='wallet_setup'),
    path('wallet/create/new/', views.CreateNewWalletView.as_view(), name='create_new_wallet'),
    path('wallet/import/', views.ImportWalletView.as_view(), name='import_wallet'),
    path('wallet/detail/', views.WalletDetailView.as_view(), name='wallet_detail'),
    path('wallet/status/', views.wallet_status, name='wallet_status'),
    path('wallet/accounts/', views.WalletAccountsView.as_view(), name='wallet_accounts'),
    path('wallet/verify-password/', views.verify_wallet_password, name='verify_wallet_password'),
    path('wallet/backup/', views.backup_wallet, name='backup_wallet'),
    path('wallet/reveal-mnemonic/', views.reveal_mnemonic, name='reveal_mnemonic'),
    
    # Cryptocurrencies
    path('currencies/', views.SupportedCurrenciesView.as_view(), name='supported_currencies'),

    # Account Balnces
    path('wallet/balances/', views.AccountBalancesView.as_view(), name='account_balances'),

    # Prices
    # path('prices/', views.crypto_prices, name='prices'),
    path('crypto/prices/', views.enhanced_crypto_prices, name='enhanced_crypto_prices'),
    path('wallet/account/<uuid:account_id>/refresh/', views.refresh_account_balance, name='refresh_account_balance'),
    path('wallet/balances/refresh/', views.refresh_all_balances, name='refresh_all_balances'),
]