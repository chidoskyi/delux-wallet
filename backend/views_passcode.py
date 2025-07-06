# wallet/views_passcode.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    PasscodeSetupSerializer,
    PasscodeVerificationSerializer,
    PasscodeChangeSerializer,
)

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
    """Get user's passcode status"""
    user = request.user
    return Response({
        'has_passcode': user.has_passcode(),
        'is_locked': user.is_passcode_locked(),
        'lock_remaining_time': user.get_passcode_lock_remaining_time() if user.is_passcode_locked() else 0
    })
