# wallet/middleware.py
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve

PASSCODE_REQUIRED_PATHS = [
    'create_wallet',  # Creating new wallet
    'import_wallet',  # Importing existing wallet
    'backup_wallet',  # Backing up wallet
    'reveal_mnemonic',  # Revealing mnemonic phrase
    'wallet_detail'   # Viewing wallet details
]

EXEMPT_PATHS = [
    'login',
    'register',
    'token_obtain',
    'token_refresh',
    'setup_passcode',
    'verify_passcode',
    'passcode_status'
]

class PasscodeRequirementMiddleware(MiddlewareMixin):
    """Middleware to enforce passcode setup before sensitive wallet operations"""
    
    def process_request(self, request):
        # Skip for non-authenticated users
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None
            
        # Get the resolved URL name
        resolved = resolve(request.path)
        url_name = resolved.url_name

        # Skip exempt paths
        if url_name in EXEMPT_PATHS:
            return None
            
        # Check if path requires passcode
        if url_name in PASSCODE_REQUIRED_PATHS:
            if not request.user.has_passcode():
                return JsonResponse({
                    'error': 'Passcode setup required',
                    'message': 'Please set up a 4-digit passcode to proceed with this operation.',
                    'next_steps': {
                        'requires_passcode_setup': True,
                        'setup_endpoint': '/api/v1/auth/passcode/setup/'
                    }
                }, status=status.HTTP_403_FORBIDDEN)
                
        return None
