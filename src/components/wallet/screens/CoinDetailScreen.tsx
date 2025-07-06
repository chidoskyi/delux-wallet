import React, { useState, useEffect } from "react"
import { Button } from "../../ui/button";
import { ArrowLeft, Bell, CreditCard, ArrowDown, ArrowUp, Building, Zap, Copy } from "lucide-react"
import { CryptoAccount, Transaction, Screen } from "@/src/lib/types"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatBalance } from "../../../utils/formatBalance"

interface CoinDetailScreenProps {
  coin: CryptoAccount
  setCurrentScreen: (screen: Screen) => void
  transactions: Transaction[]
  cryptoData?: any // Add crypto data prop
}

export const CoinDetailScreen = ({
  coin,
  setCurrentScreen,
  transactions,
  cryptoData
}: CoinDetailScreenProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("1D")
  const [activeTab, setActiveTab] = useState("Holdings")
  const [chartData, setChartData] = useState([])

  // Fix: Use coin.balance and coin.symbol instead of undefined variables
  const formattedBalance = formatBalance(coin.balance, coin.symbol, 8);

  // Get current crypto data for this coin
  const currentCoinData = cryptoData?.[coin.symbol]

  // Generate realistic chart data based on current price and 24h change
  const generateChartData = (period: string) => {
    const currentPrice = currentCoinData?.price_usd 
    const change24h = currentCoinData?.change_24h || 0
    const high24h = currentCoinData?.high_24h || currentPrice * 1.02
    const low24h = currentCoinData?.low_24h || currentPrice * 0.98

    let dataPoints = []
    let numPoints = 24 // Default for 1D
    let timeFormat = 'HH:mm'

    switch (period) {
      case '1H':
        numPoints = 12
        timeFormat = 'HH:mm'
        break
      case '1D':
        numPoints = 24
        timeFormat = 'HH:mm'
        break
      case '1W':
        numPoints = 7
        timeFormat = 'MMM DD'
        break
      case '1M':
        numPoints = 30
        timeFormat = 'MMM DD'
        break
      case '1Y':
        numPoints = 12
        timeFormat = 'MMM'
        break
      case 'All':
        numPoints = 50
        timeFormat = 'MMM'
        break
    }

    // Generate data points with some realistic variation
    for (let i = 0; i < numPoints; i++) {
      const progress = i / (numPoints - 1)
      const randomVariation = (Math.random() - 0.5) * 0.02 // ±1% random variation
      const trendVariation = (change24h / 100) * progress // Apply 24h change over time
      
      let price = currentPrice * (1 + trendVariation + randomVariation)
      
      // Ensure price stays within 24h high/low bounds
      price = Math.max(low24h, Math.min(high24h, price))
      
      let timeLabel = ''
      const now = new Date()
      
      if (period === '1H') {
        const time = new Date(now.getTime() - (numPoints - 1 - i) * 5 * 60 * 1000)
        timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } else if (period === '1D') {
        const time = new Date(now.getTime() - (numPoints - 1 - i) * 60 * 60 * 1000)
        timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } else if (period === '1W') {
        const time = new Date(now.getTime() - (numPoints - 1 - i) * 24 * 60 * 60 * 1000)
        timeLabel = time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      } else if (period === '1M') {
        const time = new Date(now.getTime() - (numPoints - 1 - i) * 24 * 60 * 60 * 1000)
        timeLabel = time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      } else if (period === '1Y' || period === 'All') {
        const time = new Date(now.getTime() - (numPoints - 1 - i) * 30 * 24 * 60 * 60 * 1000)
        timeLabel = time.toLocaleDateString('en-US', { month: 'short' })
      }

      dataPoints.push({
        time: timeLabel,
        price: price,
        formattedPrice: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      })
    }

    return dataPoints
  }

  useEffect(() => {
    setChartData(generateChartData(selectedPeriod))
  }, [selectedPeriod, currentCoinData])

  // Format large numbers
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatSupply = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    return value.toLocaleString()
  }

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white font-semibold">
            {payload[0].payload.formattedPrice}
          </p>
        </div>
      )
    }
    return null
  }

  const isPositiveChange = currentCoinData?.change_24h >= 0
  const lineColor = isPositiveChange ? "#10b981" : "#ef4444"

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
          onClick={() => setCurrentScreen("wallet-home")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{coin.symbol}</h1>
          <p className="text-sm text-gray-400">{coin.symbol} | {coin.name}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Zap className="h-6 w-6" />
        </Button>
      </div>

      {/* Price Section */}
      <div className="text-center px-4 mb-8">
        <h2 className="text-4xl font-bold mb-2">
          ${currentCoinData?.price_usd?.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) || coin.price}
        </h2>
        <p className={`flex items-center justify-center gap-1 ${isPositiveChange ? "text-green-400" : "text-red-400"}`}>
          <span>{isPositiveChange ? "↑" : "↓"}</span>
          <span>
            ${Math.abs(currentCoinData?.price_usd * (currentCoinData?.change_24h / 100) || 0).toFixed(6)} 
            ({currentCoinData?.change_24h?.toFixed(2) || coin.change_24h}%)
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="px-4 mb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis hide />
              <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#374151', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: lineColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Period Buttons */}
      <div className="flex justify-center gap-6 mb-8 px-4">
        {["1H", "1D", "1W", "1M", "1Y", "All"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`text-sm ${
              period === selectedPeriod 
                ? "text-white font-medium" 
                : "text-gray-400"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        {["Holdings", "History", "About"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === activeTab
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Holdings Tab Content */}
      {activeTab === "Holdings" && (
        <div className="px-4 pb-24">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">My Balance</h3>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${coin.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold">{coin.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-gray-400 text-xs ">{formattedBalance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${((parseFloat(formattedBalance) || 0) * (currentCoinData?.price_usd || 0)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className={`text-xs ${isPositiveChange ? "text-green-400" : "text-red-400"}`}>
                    {isPositiveChange ? "+" : ""}{((parseFloat(formattedBalance) || 0) * (currentCoinData?.price_usd * (currentCoinData?.change_24h / 100) || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Staking Banner */}
            {/* <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 border border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚀</span>
                </div>
                <div>
                  <p className="font-medium">Earn yield on your {coin.symbol} today</p>
                  <p className="text-green-400 text-sm font-medium">Stake now</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* History Tab Content */}
      {activeTab === "History" && (
        <div className="px-4 pb-24">
          <div className="space-y-3">
            {transactions
              .filter((tx) => tx.asset === coin.symbol || tx.asset.includes(coin.symbol))
              .slice(0, 10)
              .map((tx) => (
                <div key={tx.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "send" ? "bg-red-500" : tx.type === "receive" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {tx.type === "send" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : tx.type === "receive" ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <Building className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{tx.type}</p>
                      <p className="text-gray-400 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${tx.type === "receive" ? "text-green-400" : "text-white"}`}>
                      {tx.type === "receive" ? "+" : "-"}
                      {tx.amount}
                    </p>
                    <p className="text-gray-400 text-xs">{tx.usdAmount}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* About Tab Content */}
      {activeTab === "About" && (
        <div className="px-4 pb-24">
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white">
                    {currentCoinData?.market_cap ? formatMarketCap(currentCoinData.market_cap) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white">
                    {currentCoinData?.volume_24h ? formatVolume(currentCoinData.volume_24h) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h High</span>
                  <span className="text-white">
                    ${currentCoinData?.high_24h?.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Low</span>
                  <span className="text-white">
                    ${currentCoinData?.low_24h?.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Circulating Supply</span>
                  <span className="text-white">
                    {currentCoinData?.circulating_supply ? 
                      `${formatSupply(currentCoinData.circulating_supply)} ${coin.symbol}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">All-Time High</span>
                  <span className="text-white">
                    ${currentCoinData?.ath?.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap Rank</span>
                  <span className="text-white">
                    #{currentCoinData?.market_cap_rank || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center justify-around py-4">
         {/* Send */}
  <div className="text-center">
    <button 
      className="flex flex-col items-center gap-2"
      onClick={() => setCurrentScreen("send")}
    >
      <div className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-lg p-1">
        <ArrowUp className="h-5 w-5 text-gray-400" />
      </div>
      <span className="text-xs text-gray-400">Send</span>
    </button>
  </div>
          
         {/* Receive */}
  <div className="text-center">
    <button 
      className="flex flex-col items-center gap-2"
      onClick={() => setCurrentScreen("receive")}
    >
      <div className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-lg p-1">
        <Copy className="h-5 w-5 text-gray-400" />
      </div>
      <span className="text-xs text-gray-400">Receive</span>
    </button>
  </div>
          
         {/* Swap */}
  <div className="text-center">
    <button className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 flex items-center justify-center  border border-gray-600 rounded-lg p-5 hover:border-gray-400">
        <span className="text-gray-400">⇄</span>
      </div>
      <span className="text-xs text-gray-400">Swap</span>
    </button>
  </div>
          
         {/* Buy */}
  <div className="text-center">
    <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setCurrentScreen("buy")}
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center  justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-white font-medium">Buy</span>
          </button>
  </div>
          
           {/* Sell */}
  <div className="text-center">
    <button className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-lg p-1">
        <Building className="h-5 w-5 text-gray-400" />
      </div>
      <span className="text-xs text-gray-400">Sell</span>
    </button>
  </div>
        </div>
      </div>
    </div>
  )
}

