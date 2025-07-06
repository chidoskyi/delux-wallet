# wallet/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Wallet, CryptoCurrency, Account, Transaction, WalletSecurity, PasscodeAttempt

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'is_verified', 'is_staff', 'is_superuser', 'two_factor_enabled', 'biometric_enabled', 'date_joined')
    list_filter = ('is_verified', 'is_staff', 'is_superuser', 'two_factor_enabled', 'biometric_enabled')
    search_fields = ('email', 'username')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Security Settings', {'fields': ('two_factor_enabled', 'biometric_enabled')}),
        ('Passcode Info', {
            'fields': (
                'passcode_hash',
                'passcode_salt',
                'passcode_set_at',
                'passcode_attempts',
                'passcode_locked_until',
            )
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {'fields': ('phone_number', 'is_verified')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'is_imported', 'backup_completed', 'created_at', 'updated_at')
    search_fields = ('user__email', 'name')
    list_filter = ('is_imported', 'backup_completed')

@admin.register(CryptoCurrency)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol', 'network', 'is_active', 'created_at')
    list_filter = ('network', 'is_active')
    search_fields = ('name', 'symbol', 'contract_address')

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'cryptocurrency', 'address', 'account_index', 'balance', 'is_active', 'created_at')
    list_filter = ('cryptocurrency', 'is_active')
    search_fields = ('address', 'wallet__user__email')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_hash', 'account', 'transaction_type', 'status', 'amount', 'created_at')
    list_filter = ('transaction_type', 'status')
    search_fields = ('transaction_hash', 'from_address', 'to_address')

@admin.register(WalletSecurity)
class WalletSecurityAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'failed_attempts', 'locked_until', 'backup_reminder_enabled', 'last_backup_reminder', 'last_login_ip', 'last_login_at')
    list_filter = ('backup_reminder_enabled',)
    search_fields = ('wallet__user__email',)


@admin.register(PasscodeAttempt)
class PasscodeAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'ip_address', 'success', 'attempted_at', 'user_agent')
    list_filter = ('success', 'attempted_at')
    search_fields = ('user__email', 'ip_address', 'user_agent')
    ordering = ('-attempted_at',)
    readonly_fields = ('user', 'ip_address', 'success', 'attempted_at', 'user_agent')

    def has_add_permission(self, request):
        return False  # Disable manual addition via admin

    def has_change_permission(self, request, obj=None):
        return False  # Make the logs read-only

    def has_delete_permission(self, request, obj=None):
        return True  # Optional: allow or disallow deletion
