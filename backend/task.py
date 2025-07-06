from celery import shared_task
from .models import Account
from .services import BlockchainAPIService
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_all_balances():
    """Background task to update all account balances"""
    api_service = BlockchainAPIService()
    accounts = Account.objects.filter(is_active=True)
    
    updated_count = 0
    failed_count = 0
    
    for account in accounts:
        try:
            account.update_balance_from_blockchain(force=True)
            updated_count += 1
        except Exception as e:
            logger.error(f"Failed to update balance for {account.id}: {str(e)}")
            failed_count += 1
    
    logger.info(f"Balance update completed: {updated_count} success, {failed_count} failed")
    return {'updated': updated_count, 'failed': failed_count}

@shared_task
def update_account_balance(account_id):
    """Background task to update a specific account balance"""
    try:
        account = Account.objects.get(id=account_id)
        account.update_balance_from_blockchain(force=True)
        return {'success': True, 'balance': str(account.balance)}
    except Account.DoesNotExist:
        return {'success': False, 'error': 'Account not found'}
    except Exception as e:
        return {'success': False, 'error': str(e)}
