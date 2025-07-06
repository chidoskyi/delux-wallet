# Enhanced Account model methods
from django.utils import timezone
from datetime import timedelta
import logging
from backend.services import BlockchainAPIService

logger = logging.getLogger(__name__)


class EnhancedAccountMixin:
    """Mixin to enhance the Account model with better balance fetching"""
    
    def update_balance_from_blockchain(self, force=False):
        """Enhanced balance update with multiple API fallbacks"""
        # Skip if updated recently (unless forced)
        if not force and self.last_balance_update:
            time_since_update = timezone.now() - self.last_balance_update
            if time_since_update < timedelta(minutes=5):
                return
        
        api_service = BlockchainAPIService()
        symbol = self.cryptocurrency.symbol
        new_balance = None
        
        try:
            if symbol == 'ETH':
                new_balance = api_service.get_eth_balance(self.address)
            elif symbol == 'BTC':
                new_balance = api_service.get_btc_balance(self.address)
            # Add other cryptocurrencies here
            
            if new_balance is not None:
                self.balance = new_balance
                self.last_balance_update = timezone.now()
                self.save()
                logger.info(f"Updated {symbol} balance for {self.address}: {new_balance}")
            else:
                logger.error(f"Failed to get {symbol} balance for {self.address}")
                
        except Exception as e:
            logger.error(f"Error updating {symbol} balance: {str(e)}")