# wallet/services.py
import requests
import logging
from decimal import Decimal
from django.conf import settings
from django.core.cache import cache
from typing import Dict, Optional, List

logger = logging.getLogger(__name__)

class BlockchainAPIService:
    """Service for fetching blockchain data with multiple API fallbacks"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'DeluxWalletApp/1.0'
        })
    
    def get_eth_balance(self, address: str) -> Optional[Decimal]:
        """Get ETH balance with multiple API fallbacks"""
        apis = [
            self._get_eth_balance_etherscan,
            self._get_eth_balance_alchemy,
            self._get_eth_balance_infura,
        ]
        
        for api_func in apis:
            try:
                balance = api_func(address)
                if balance is not None:
                    return balance
            except Exception as e:
                logger.warning(f"ETH API failed: {e}")
                continue
        
        logger.error(f"All ETH APIs failed for address: {address}")
        return None
    
    def _get_eth_balance_etherscan(self, address: str) -> Optional[Decimal]:
        """Etherscan API"""
        api_key = getattr(settings, 'ETHERSCAN_API_KEY', '')
        url = f"{settings.ETHERSCAN_API_URL}"
        if not api_key:
            return None
        params = {
            'module': 'account',
            'action': 'balance',
            'address': address,
            'tag': 'latest',
            'apikey': api_key
        }
        
        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get('status') == '1':
            balance_wei = int(data['result'])
            return Decimal(balance_wei) / Decimal(10**18)
        return None
    
    def _get_eth_balance_alchemy(self, address: str) -> Optional[Decimal]:
        """Alchemy API"""
        api_key = getattr(settings, 'ALCHEMY_API_KEY', '')
        if not api_key:
            return None
            
        url = f"https://eth-mainnet.alchemyapi.io/v2/{api_key}"
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [address, "latest"],
            "id": 1
        }
        
        response = self.session.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'result' in data:
            balance_wei = int(data['result'], 16)
            return Decimal(balance_wei) / Decimal(10**18)
        return None
    
    def _get_eth_balance_infura(self, address: str) -> Optional[Decimal]:
        """Infura API"""
        api_key = getattr(settings, 'INFURA_API_KEY', '')
        if not api_key:
            return None
            
        url = f"https://mainnet.infura.io/v3/{api_key}"
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [address, "latest"],
            "id": 1
        }
        
        response = self.session.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'result' in data:
            balance_wei = int(data['result'], 16)
            return Decimal(balance_wei) / Decimal(10**18)
        return None
    
    def get_btc_balance(self, address: str) -> Optional[Decimal]:
        """Get BTC balance with multiple API fallbacks"""
        apis = [
            self._get_btc_balance_blockchain_info,
            self._get_btc_balance_blockchair,
            self._get_btc_balance_blockcypher,
        ]
        
        for api_func in apis:
            try:
                balance = api_func(address)
                if balance is not None:
                    return balance
            except Exception as e:
                logger.warning(f"BTC API failed: {e}")
                continue
        
        logger.error(f"All BTC APIs failed for address: {address}")
        return None
    
    def _get_btc_balance_blockchain_info(self, address: str) -> Optional[Decimal]:
        """Blockchain.info API"""
        url = f"https://blockchain.info/balance?active={address}"
        response = self.session.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if address in data:
            satoshis = data[address]['balance']
            return Decimal(satoshis) / Decimal(10**8)
        return None
    
    def _get_btc_balance_blockchair(self, address: str) -> Optional[Decimal]:
        """Blockchair API"""
        url = f"https://api.blockchair.com/bitcoin/dashboards/address/{address}"
        response = self.session.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'data' in data and address in data['data']:
            balance_satoshis = data['data'][address]['address']['balance']
            return Decimal(balance_satoshis) / Decimal(10**8)
        return None
    
    def _get_btc_balance_blockcypher(self, address: str) -> Optional[Decimal]:
        """BlockCypher API"""
        url = f"https://api.blockcypher.com/v1/btc/main/addrs/{address}/balance"
        response = self.session.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'balance' in data:
            return Decimal(data['balance']) / Decimal(10**8)
        return None


class CryptoPriceService:
    """Service for fetching cryptocurrency prices with multiple API fallbacks"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'DeluxWalletApp/1.0'
        })
    
    def get_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get prices for multiple cryptocurrencies"""
        cache_key = f"crypto_prices_{'-'.join(sorted(symbols))}"
        cached_prices = cache.get(cache_key)
        
        if cached_prices:
            return cached_prices
        
        # Try multiple APIs
        apis = [
            self._get_prices_coingecko,
            self._get_prices_coinmarketcap,
            self._get_prices_binance,
        ]
        
        for api_func in apis:
            try:
                prices = api_func(symbols)
                if prices:
                    # Cache for 60 seconds
                    cache.set(cache_key, prices, 60)
                    return prices
            except Exception as e:
                logger.warning(f"Price API failed: {e}")
                continue
        
        # Return stale cache if available
        stale_prices = cache.get(cache_key) or {symbol: 0.0 for symbol in symbols}
        logger.error("All price APIs failed, returning stale/empty prices")
        return stale_prices
    
    def _get_prices_coingecko(self, symbols: List[str]) -> Optional[Dict[str, float]]:
        """CoinGecko API"""
        # Map symbols to CoinGecko IDs
        symbol_to_id = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDT': 'tether',
            'USDC': 'usd-coin',
            'BNB': 'binancecoin',
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'MATIC': 'matic-network',
        }
        
        ids = [symbol_to_id.get(symbol) for symbol in symbols if symbol in symbol_to_id]
        if not ids:
            return None
        
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            'ids': ','.join(ids),
            'vs_currencies': 'usd',
            'precision': 2
        }
        
        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        prices = {}
        for symbol in symbols:
            coin_id = symbol_to_id.get(symbol)
            if coin_id and coin_id in data:
                prices[symbol] = data[coin_id]['usd']
        
        return prices if prices else None
    
    def _get_prices_coinmarketcap(self, symbols: List[str]) -> Optional[Dict[str, float]]:
        """CoinMarketCap API"""
        api_key = getattr(settings, 'COINMARKETCAP_API_KEY', '')
        if not api_key:
            return None
        
        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"
        headers = {
            'X-CMC_PRO_API_KEY': api_key,
            'Accept': 'application/json'
        }
        params = {
            'symbol': ','.join(symbols),
            'convert': 'USD'
        }
        
        response = self.session.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        prices = {}
        if 'data' in data:
            for symbol in symbols:
                if symbol in data['data']:
                    prices[symbol] = data['data'][symbol]['quote']['USD']['price']
        
        return prices if prices else None
    
    def _get_prices_binance(self, symbols: List[str]) -> Optional[Dict[str, float]]:
        """Binance API (free, no API key required)"""
        url = "https://api.binance.com/api/v3/ticker/price"
        
        response = self.session.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        prices = {}
        for item in data:
            symbol = item['symbol']
            # Convert BTCUSDT to BTC, ETHUSDT to ETH, etc.
            if symbol.endswith('USDT'):
                base_symbol = symbol[:-4]
                if base_symbol in symbols:
                    prices[base_symbol] = float(item['price'])
        
        return prices if prices else None
