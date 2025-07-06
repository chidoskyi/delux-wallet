import { CryptoList } from "../ui/CryptoList"
import React from "react"
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Building,
  CreditCard,
  Copy,
  Eye,
  Settings,
  Zap,
} from "lucide-react"
import { Button } from "../../ui/button";
import { Screen, CryptoAccount, NFT, Transaction, WalletHomeScreenProps } from "@/src/lib/types"


export const WalletHomeScreen = ({
  activeTab,
  setActiveTab,
  setCurrentScreen,
  totalPortfolioValue,
  cryptoList,
  nfts,
  transactions,
  setSelectedNFT,
  setSelectedCoin,
}: WalletHomeScreenProps) => {
  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(balance)
  }

  

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Settings 
          className="h-6 w-6 cursor-pointer hover:text-gray-300 transition-colors" 
          onClick={() => setCurrentScreen("settings")} 
        />
        <h1 className="text-xl font-semibold">Home</h1>
        <div className="flex items-center gap-2">
          <Bell 
            className="h-6 w-6 cursor-pointer hover:text-gray-300 transition-colors" 
            onClick={() => setCurrentScreen("price-alerts")} 
          />
          <div
            className="w-6 h-6 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => setCurrentScreen("wallet-management")}
          />
        </div>
      </div>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-800 rounded-full py-3 px-4 pl-10 text-white placeholder-gray-400"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Account */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400">H545417</span>
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4 text-gray-400 cursor-pointer" />
            <Bell className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Balance */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-light">{formatBalance(totalPortfolioValue)}</span>
            <Eye className="h-5 w-5 text-gray-400 cursorpointer"  />
          </div>
          <Button
            variant="ghost"
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors cursor-pointer"
            onClick={() => setCurrentScreen("transaction-history")}
          >
            View Transaction History
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-8 px-10">
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


          {/* <div className="flex justify-between mb-8">
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 mb-2"
              onClick={() => setCurrentScreen("send")}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <p className="text-sm text-gray-400">Send</p>
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 mb-2"
              onClick={() => setCurrentScreen("receive")}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            <p className="text-sm text-gray-400">Receive</p>
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 mb-2"
              onClick={() => setCurrentScreen("buy")}
            >
              <CreditCard className="h-6 w-6" />
            </Button>
            <p className="text-sm text-gray-400">Buy</p>
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 mb-2"
              onClick={() => setCurrentScreen("swap")}
            >
              <Building className="h-6 w-6" />
            </Button>
            <p className="text-sm text-gray-400">Swap</p>
          </div>
        </div> */}

        {/* Connect Banner */}
        <div className="mb-6">
          <p className="text-center text-gray-400 text-sm mb-4">
            Access, secure and withdraw assets
          </p>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 rounded-lg transition-colors">
            🔒 Connect Delux recovery to TRUSTWALLET
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === "crypto" ? "border-white text-white" : "border-transparent text-gray-400"}`}
            onClick={() => setActiveTab("crypto")}
          >
            Crypto
          </button>
          <button
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === "nfts" ? "border-white text-white" : "border-transparent text-gray-400"}`}
            onClick={() => setActiveTab("nfts")}
          >
            NFTs
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "crypto" ? (
          <CryptoList
            cryptoList={cryptoList}
            setSelectedCoin={setSelectedCoin}
            setCurrentScreen={setCurrentScreen}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  setSelectedNFT(nft)
                  setCurrentScreen("nft-detail")
                }}
              >
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="font-medium text-sm truncate">{nft.name}</p>
                <p className="text-gray-400 text-xs truncate">{nft.collection}</p>
                <p className="text-blue-400 text-sm">{nft.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}