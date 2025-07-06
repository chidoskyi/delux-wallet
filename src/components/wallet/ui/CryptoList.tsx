import React from "react"   
import { CryptoAccount, Screen } from "@/src/lib/types"
import { formatBalance } from "../../../utils/formatBalance"


interface CryptoListProps {
  cryptoList: CryptoAccount[]
  setSelectedCoin: (coin: CryptoAccount) => void
  setCurrentScreen: (screen: Screen) => void
}


// Helper function to get crypto icon/color
const getCryptoDisplay = (symbol: string) => {
  const displays: Record<string, { icon: string; color: string }> = {
    BTC: { icon: "₿", color: "bg-orange-500" },
    ETH: { icon: "Ξ", color: "bg-blue-500" },
    USDT: { icon: "₮", color: "bg-green-500" },
    BNB: { icon: "B", color: "bg-yellow-500" },
    ADA: { icon: "A", color: "bg-blue-600" },
    DOT: { icon: "●", color: "bg-pink-500" },
    LINK: { icon: "⬢", color: "bg-blue-400" },
  };
  
  return displays[symbol] || { icon: symbol?.charAt(0) || "?", color: "bg-gray-500" };
};

export const CryptoList = ({
  cryptoList,
  setSelectedCoin,
  setCurrentScreen,
}: CryptoListProps) => {
  if (!cryptoList || cryptoList.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No cryptocurrencies found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cryptoList.map((crypto) => {
        // Use the actual flat structure from your data
        const symbol = crypto.symbol;
        const name = crypto.name;
        const balance = crypto.balance;
        const price = crypto.price;
        const icon = crypto.icon;
        const color = crypto.color;
        
        // Format balance properly
        const formattedBalance = formatBalance(balance, symbol, 8);
        
        // Format price as currency
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(parseFloat(price.toString()));

        // Calculate USD value of balance
        const balanceUSDValue = parseFloat(balance.toString()) * parseFloat(price.toString());
        const formattedBalanceUSD = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(balanceUSDValue);

        
        
        return (
          <div
            key={crypto.address} // Use address as unique key
            className="flex items-center justify-between cursor-pointer hover:bg-gray-800 rounded-lg p-2 -m-2"
            onClick={() => {
              setSelectedCoin(crypto)
              setCurrentScreen("coin-detail")
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{icon}</span>
              </div>
              <div>
                <p className="font-medium">{symbol}</p>
                <div className="flex item-center jusitify-center gap-3">
                <p className="text-gray-400 text-sm">{formattedPrice}</p>
                {crypto.change24h && (
                <p className={`text-xs mt-auto ${crypto.change24h.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                  {crypto.change24h}
                </p>
              )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formattedBalance}</p>
              {/*  below is where the converted balance should be  */}
              <p className="text-gray-400 text-sm">
                {formattedBalanceUSD}
              </p>
              
            </div>
          </div>
        );
      })}
    </div>
  )
}