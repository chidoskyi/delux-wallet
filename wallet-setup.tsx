"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Settings, Copy, Bell, Eye, ArrowUp, ArrowDown, CreditCard, Building } from "lucide-react"

type Screen =
  | "landing"
  | "set-passcode"
  | "enter-passcode"
  | "seed-phrase-1"
  | "seed-phrase-4"
  | "seed-phrase-complete"
  | "wallet-home"
  | "send"
  | "send-confirm"
  | "receive"
  | "buy"
  | "swap"
  | "settings"
  | "security"
  | "networks"
  | "about"
  | "transaction-history"
  | "nft-gallery"
  | "nft-detail"
  | "wallet-management"
  | "price-alerts"
  | "staking"
  | "dapp-browser"
  | "coin-detail"

const seedWords = [
  "recall",
  "thrive",
  "day",
  "march",
  "canvas",
  "educate",
  "there",
  "wrap",
  "jump",
  "income",
  "produce",
  "concert",
]

const wordOptions = [
  "produce",
  "wrap",
  "canvas",
  "day",
  "income",
  "thrive",
  "recall",
  "there",
  "educate",
  "march",
  "jump",
  "concert",
]

export default function TrustWalletClone() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [passcode, setPasscode] = useState("")
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [swapFrom, setSwapFrom] = useState("BTC")
  const [swapTo, setSwapTo] = useState("ETH")
  const [swapAmount, setSwapAmount] = useState("")

  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"crypto" | "nfts">("crypto")
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "send",
      asset: "BTC",
      amount: "0.001",
      usdAmount: "$108.99",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      date: "2025-05-23",
      time: "14:30",
      status: "completed",
      fee: "$2.50",
    },
    {
      id: 2,
      type: "receive",
      asset: "ETH",
      amount: "0.5",
      usdAmount: "$1,622.84",
      address: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
      date: "2025-05-22",
      time: "09:15",
      status: "completed",
      fee: "$0.00",
    },
    {
      id: 3,
      type: "swap",
      asset: "BNB → USDT",
      amount: "2.5 → 1,612.5",
      usdAmount: "$1,612.50",
      date: "2025-05-21",
      time: "16:45",
      status: "completed",
      fee: "$8.12",
    },
  ])

  const [nfts, setNfts] = useState([
    {
      id: 1,
      name: "Bored Ape #1234",
      collection: "Bored Ape Yacht Club",
      image: "/placeholder.svg?height=200&width=200",
      price: "15.5 ETH",
      usdPrice: "$50,325.67",
    },
    {
      id: 2,
      name: "CryptoPunk #5678",
      collection: "CryptoPunks",
      image: "/placeholder.svg?height=200&width=200",
      price: "25.2 ETH",
      usdPrice: "$81,831.84",
    },
    {
      id: 3,
      name: "Azuki #9012",
      collection: "Azuki",
      image: "/placeholder.svg?height=200&width=200",
      price: "8.7 ETH",
      usdPrice: "$28,238.34",
    },
  ])

  const [wallets, setWallets] = useState([
    { id: 1, name: "Main Wallet", address: "H545417", balance: "$0.00", isActive: true },
    { id: 2, name: "Trading Wallet", address: "H789123", balance: "$2,450.67", isActive: false },
    { id: 3, name: "DeFi Wallet", address: "H456789", balance: "$15,234.89", isActive: false },
  ])

  const [priceAlerts, setPriceAlerts] = useState([
    { id: 1, asset: "BTC", condition: "above", price: "$110,000", isActive: true },
    { id: 2, asset: "ETH", condition: "below", price: "$3,000", isActive: true },
    { id: 3, asset: "BNB", condition: "above", price: "$700", isActive: false },
  ])

  const [cryptoList, setCryptoList] = useState([
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$108,999.14",
      change: "+2.5%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-orange-500",
      icon: "₿",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,245.67",
      change: "+1.8%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-blue-500",
      icon: "E",
    },
    {
      name: "BNB",
      symbol: "BNB",
      price: "$645.23",
      change: "+0.9%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-yellow-500",
      icon: "B",
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$234.56",
      change: "+3.2%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-purple-500",
      icon: "S",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      price: "$1.23",
      change: "-0.5%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-blue-600",
      icon: "A",
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      price: "$2.45",
      change: "+4.1%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-purple-600",
      icon: "M",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      price: "$23.45",
      change: "+1.2%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-blue-400",
      icon: "L",
    },
    {
      name: "Avalanche",
      symbol: "AVAX",
      price: "$45.67",
      change: "+2.8%",
      balance: "0.000000",
      usdBalance: "$0.00",
      color: "bg-red-500",
      icon: "A",
    },
  ])

  const [selectedCoin, setSelectedCoin] = useState<any>(null)

  const handlePasscodeInput = (digit: string) => {
    if (digit === "delete") {
      setPasscode((prev) => prev.slice(0, -1))
    } else if (passcode.length < 4) {
      setPasscode((prev) => prev + digit)
    }
  }

  const handleWordSelect = (word: string) => {
    if (currentScreen === "seed-phrase-1" && word === "recall") {
      setSelectedWords(["recall"])
      setCurrentScreen("seed-phrase-4")
    } else if (currentScreen === "seed-phrase-4" && word === "march") {
      setSelectedWords(["recall", "thrive", "day", "march"])
      setCurrentScreen("seed-phrase-complete")
    }
  }

  const PasscodeKeypad = () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="ghost"
          size="lg"
          className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl font-medium"
          onClick={() => handlePasscodeInput(num.toString())}
        >
          {num}
        </Button>
      ))}
      <Button variant="ghost" size="lg" className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
        🎧
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl font-medium"
        onClick={() => handlePasscodeInput("0")}
      >
        0
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="h-16 w-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl"
        onClick={() => handlePasscodeInput("delete")}
      >
        ×
      </Button>
    </div>
  )

  const PasscodeIndicator = () => (
    <div className="flex gap-4 justify-center mb-8">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-full border-2 ${
            index < passcode.length ? "bg-white border-white" : "border-gray-500"
          }`}
        />
      ))}
    </div>
  )
  
  if (currentScreen === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Trust Wallet</h1>
              <p className="text-white/80">Your gateway to the decentralized web</p>
            </div>
            <div className="space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setCurrentScreen("set-passcode")}
              >
                Create a new wallet
              </Button>
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                I already have a wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentScreen === "set-passcode") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setCurrentScreen("landing")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Logout</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold mb-4">Set passcode</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Secure your digital assets. Set a four-digit passcode that you can easily remember. This code will be
              required to access your wallet every time you log in
            </p>
          </div>

          <PasscodeIndicator />

          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">Passcode adds an extra layer of security when using Hitrex recovery</p>
          </div>

          <PasscodeKeypad />

          {passcode.length === 4 && (
            <div className="mt-8">
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                onClick={() => setCurrentScreen("seed-phrase-1")}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentScreen === "enter-passcode") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Logout</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-xl font-medium mb-8">Enter your 4 digit passcode</h1>
          </div>

          <PasscodeIndicator />

          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">Passcode adds an extra layer of security when using Hitrex recovery</p>
          </div>

          <PasscodeKeypad />
        </div>
      </div>
    )
  }

  if (currentScreen === "seed-phrase-1") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setCurrentScreen("set-passcode")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Logout</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Back up secret phrase</h1>

            <div className="mb-6">
              <h2 className="text-xl mb-4">
                What is the <span className="text-yellow-500">first</span> word?
              </h2>
              <p className="text-gray-400 text-sm">
                Click on the first word of your 12-word seed phrase from the words below:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {wordOptions.slice(0, 9).map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 py-3"
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {wordOptions.slice(9).map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 py-3"
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "seed-phrase-4") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setCurrentScreen("seed-phrase-1")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Logout</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Back up secret phrase</h1>

            <div className="mb-6">
              <h2 className="text-xl mb-2">
                What is the <span className="text-yellow-500">fourth</span> word?
              </h2>
              <p className="text-yellow-500 text-sm mb-4">recall,thrive,day,</p>
              <p className="text-gray-400 text-sm">
                Click on the fourth word of your 12-word seed phrase from the words below:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {["produce", "wrap", "canvas", "income", "there", "educate", "march", "jump", "concert"].map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 py-3"
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </Button>
              ))}
            </div>

            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              onClick={() => setCurrentScreen("seed-phrase-1")}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "seed-phrase-complete") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={() => setCurrentScreen("seed-phrase-4")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Logout</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Back up secret phrase</h1>
            <p className="text-gray-400 text-sm mb-8">
              Memorize and backup your 12 word seed phrase to protect your assets. Do not share without anyone
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {seedWords.map((word, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center">
                  <span className="text-gray-400 text-sm mr-3">{index + 1}.</span>
                  <span className="text-white">{word}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-gray-400 text-sm">Yes, I have memorized my 12 word seed phrase</p>
            </div>

            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              onClick={() => setCurrentScreen("wallet-home")}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "wallet-home") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Settings className="h-6 w-6 cursor-pointer" onClick={() => setCurrentScreen("settings")} />
          <h1 className="text-xl font-semibold">Home</h1>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 cursor-pointer" onClick={() => setCurrentScreen("price-alerts")} />
            <div
              className="w-6 h-6 bg-gray-700 rounded cursor-pointer"
              onClick={() => setCurrentScreen("wallet-management")}
            ></div>
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
              <Copy className="h-4 w-4 text-gray-400" />
              <Bell className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Balance */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-light">$ 0.00</span>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              className="text-blue-400 text-sm"
              onClick={() => setCurrentScreen("transaction-history")}
            >
              View Transaction History
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mb-8">
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
          </div>

          {/* Connect Banner */}
          <div className="mb-6">
            <p className="text-center text-gray-400 text-sm mb-4">Access, secure and withdraw assets</p>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3">
              🔒 Connect Hitrex recovery to TRUSTWALLET
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
            /* Crypto List */
            <div className="space-y-4">
              {cryptoList.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-800 rounded-lg p-2 -m-2"
                  onClick={() => {
                    setSelectedCoin(crypto)
                    setCurrentScreen("coin-detail")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{crypto.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{crypto.symbol}</p>
                      <p className="text-gray-400 text-sm">{crypto.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{crypto.balance}</p>
                    <p className={`text-sm ${crypto.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                      {crypto.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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

  // Transaction History Screen
  if (currentScreen === "transaction-history") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Transaction History</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "send" ? "bg-red-500" : tx.type === "receive" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {tx.type === "send" ? (
                        <ArrowUp className="h-5 w-5" />
                      ) : tx.type === "receive" ? (
                        <ArrowDown className="h-5 w-5" />
                      ) : (
                        <Building className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {tx.type} {tx.asset}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {tx.date} at {tx.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === "receive" ? "text-green-400" : "text-white"}`}>
                      {tx.type === "receive" ? "+" : "-"}
                      {tx.amount}
                    </p>
                    <p className="text-gray-400 text-sm">{tx.usdAmount}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee: {tx.fee}</span>
                  <span className={`capitalize ${tx.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // NFT Detail Screen
  if (currentScreen === "nft-detail" && selectedNFT) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">NFT Details</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="text-center mb-6">
            <img
              src={selectedNFT.image || "/placeholder.svg"}
              alt={selectedNFT.name}
              className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedNFT.name}</h2>
            <p className="text-gray-400 mb-2">{selectedNFT.collection}</p>
            <p className="text-blue-400 text-xl">{selectedNFT.price}</p>
            <p className="text-gray-400">{selectedNFT.usdPrice}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Properties</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-gray-400 text-xs">Background</p>
                  <p className="text-sm">Blue</p>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-gray-400 text-xs">Eyes</p>
                  <p className="text-sm">Laser</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Send NFT</Button>
              <Button variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-800">
                View on OpenSea
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Wallet Management Screen
  if (currentScreen === "wallet-management") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Manage Wallets</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-4 mb-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`bg-gray-800 rounded-lg p-4 border-2 ${wallet.isActive ? "border-blue-500" : "border-transparent"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-gray-400 text-sm">{wallet.address}</p>
                    <p className="text-green-400 text-sm">{wallet.balance}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {wallet.isActive && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Active</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400"
                      onClick={() => {
                        setWallets(wallets.map((w) => ({ ...w, isActive: w.id === wallet.id })))
                      }}
                    >
                      {wallet.isActive ? "Active" : "Switch"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Create New Wallet</Button>
            <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
              Import Existing Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Price Alerts Screen
  if (currentScreen === "price-alerts") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Price Alerts</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-4 mb-6">
            {priceAlerts.map((alert) => (
              <div key={alert.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.asset}</p>
                    <p className="text-gray-400 text-sm">
                      Alert when price goes {alert.condition} {alert.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-6 rounded-full relative ${alert.isActive ? "bg-blue-600" : "bg-gray-600"}`}>
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${alert.isActive ? "right-0.5" : "left-0.5"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Create New Alert</Button>
        </div>
      </div>
    )
  }

  // Staking Screen
  if (currentScreen === "staking") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Staking</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Earn Rewards</h2>
            <p className="text-blue-100 mb-4">Stake your crypto and earn up to 12% APY</p>
            <p className="text-3xl font-bold">$0.00</p>
            <p className="text-blue-200 text-sm">Total Staked</p>
          </div>

          <div className="space-y-4">
            {[
              { asset: "ETH", apy: "4.5%", minStake: "0.1 ETH", color: "bg-blue-500" },
              { asset: "BNB", apy: "8.2%", minStake: "1 BNB", color: "bg-yellow-500" },
              { asset: "SOL", apy: "6.8%", minStake: "1 SOL", color: "bg-purple-500" },
              { asset: "ADA", apy: "5.1%", minStake: "100 ADA", color: "bg-blue-600" },
            ].map((stake) => (
              <div key={stake.asset} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stake.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{stake.asset[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{stake.asset} Staking</p>
                      <p className="text-gray-400 text-sm">Min: {stake.minStake}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{stake.apy}</p>
                    <p className="text-gray-400 text-sm">APY</p>
                  </div>
                </div>
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">Stake {stake.asset}</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // DApp Browser Screen
  if (currentScreen === "dapp-browser") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">DApp Browser</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search DApps or enter URL"
              className="w-full bg-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-400"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Popular DApps</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Uniswap", category: "DEX", icon: "🦄", color: "bg-pink-500" },
                { name: "Compound", category: "Lending", icon: "🏦", color: "bg-green-500" },
                { name: "OpenSea", category: "NFT", icon: "🌊", color: "bg-blue-500" },
                { name: "Aave", category: "DeFi", icon: "👻", color: "bg-purple-500" },
              ].map((dapp) => (
                <div key={dapp.name} className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className={`w-12 h-12 ${dapp.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-2xl">{dapp.icon}</span>
                  </div>
                  <p className="font-medium">{dapp.name}</p>
                  <p className="text-gray-400 text-sm">{dapp.category}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recently Visited</h2>
            <div className="space-y-3">
              {[
                { name: "PancakeSwap", url: "pancakeswap.finance", time: "2 hours ago" },
                { name: "1inch", url: "1inch.io", time: "1 day ago" },
              ].map((site) => (
                <div key={site.name} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{site.name}</p>
                    <p className="text-gray-400 text-sm">{site.url}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{site.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "settings") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("wallet-management")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👛</span>
                </div>
                <span>Manage Wallets</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("security")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <span>Security</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("price-alerts")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔔</span>
                </div>
                <span>Price Alerts</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("staking")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <span>Staking</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("dapp-browser")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌐</span>
                </div>
                <span>DApp Browser</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("networks")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌐</span>
                </div>
                <span>Networks</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <span>Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">USD</span>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌙</span>
                </div>
                <span>Dark Mode</span>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌍</span>
                </div>
                <span>Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">English</span>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCurrentScreen("about")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">ℹ️</span>
                </div>
                <span>About</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚪</span>
                </div>
                <span className="text-red-400">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Security Settings Screen
  if (currentScreen === "security") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("settings")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Security</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Change Passcode</p>
                <p className="text-gray-400 text-sm">Update your 4-digit passcode</p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Biometric Authentication</p>
                <p className="text-gray-400 text-sm">Use fingerprint or face ID</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Auto-Lock</p>
                <p className="text-gray-400 text-sm">Lock app after inactivity</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">5 minutes</span>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Backup Seed Phrase</p>
                <p className="text-gray-400 text-sm">View your recovery phrase</p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Transaction Signing</p>
                <p className="text-gray-400 text-sm">Require confirmation for transactions</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Privacy Mode</p>
                <p className="text-gray-400 text-sm">Hide balances in app switcher</p>
              </div>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Networks Screen
  if (currentScreen === "networks") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("settings")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Networks</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {[
              { name: "Ethereum", symbol: "ETH", status: "Active", color: "bg-blue-500" },
              { name: "Bitcoin", symbol: "BTC", status: "Active", color: "bg-orange-500" },
              { name: "BNB Smart Chain", symbol: "BNB", status: "Active", color: "bg-yellow-500" },
              { name: "Polygon", symbol: "MATIC", status: "Active", color: "bg-purple-500" },
              { name: "Solana", symbol: "SOL", status: "Inactive", color: "bg-gray-500" },
              { name: "Avalanche", symbol: "AVAX", status: "Inactive", color: "bg-red-500" },
            ].map((network) => (
              <div key={network.symbol} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${network.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{network.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{network.name}</p>
                    <p className="text-gray-400 text-sm">{network.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${network.status === "Active" ? "text-green-400" : "text-gray-400"}`}>
                    {network.status}
                  </span>
                  <div
                    className={`w-12 h-6 rounded-full relative ${network.status === "Active" ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${network.status === "Active" ? "right-0.5" : "left-0.5"}`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 mt-6">Add Custom Network</Button>
        </div>
      </div>
    )
  }

  // About Screen
  if (currentScreen === "about") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("settings")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">About</h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-white rounded-lg"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Trust Wallet</h2>
            <p className="text-gray-400">Version 1.0.0</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <span>Terms of Service</span>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <span>Privacy Policy</span>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <span>Support Center</span>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <span>Rate App</span>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg cursor-pointer">
              <span>Follow us on Twitter</span>
              <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Trust Wallet is a secure, decentralized wallet for storing and managing your digital assets.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Coin Detail Screen
  if (currentScreen === "coin-detail" && selectedCoin) {
    const chartData = [
      { time: "00:00", price: 108500 },
      { time: "04:00", price: 108800 },
      { time: "08:00", price: 109200 },
      { time: "12:00", price: 108900 },
      { time: "16:00", price: 109500 },
      { time: "20:00", price: 108999 },
    ]

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentScreen("wallet-home")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">{selectedCoin.name}</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
            <Bell className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-4">
          {/* Price Header */}
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 ${selectedCoin.color} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-white font-bold text-2xl">{selectedCoin.icon}</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{selectedCoin.price}</h2>
            <p className={`text-lg ${selectedCoin.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
              {selectedCoin.change} (24h)
            </p>
          </div>

          {/* Portfolio Value */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Your {selectedCoin.symbol}</span>
              <span className="text-white font-medium">{selectedCoin.balance}</span>
            </div>
            <div className="flex justify-between items-center"></div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Price Chart</h3>
              <div className="flex gap-2">
                {["1H", "1D", "1W", "1M", "1Y"].map((period) => (
                  <Button
                    key={period}
                    variant="ghost"
                    size="sm"
                    className={`text-xs ${period === "1D" ? "bg-blue-600 text-white" : "text-gray-400"}`}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>

            {/* Simple Chart Visualization */}
            <div className="bg-gray-800 rounded-lg p-4 h-48 flex items-end justify-between">
              {chartData.map((point, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-green-400 w-2 rounded-t"
                    style={{
                      height: `${((point.price - 108500) / 1000) * 100 + 50}px`,
                      minHeight: "20px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{point.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 py-4"
              onClick={() => {
                setSelectedCrypto(selectedCoin.symbol)
                setCurrentScreen("buy")
              }}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Buy
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 py-4"
              onClick={() => {
                setSelectedCrypto(selectedCoin.symbol)
                setCurrentScreen("receive")
              }}
            >
              <ArrowDown className="h-5 w-5 mr-2" />
              Receive
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 py-4"
              onClick={() => {
                setSelectedCrypto(selectedCoin.symbol)
                setCurrentScreen("send")
              }}
            >
              <ArrowUp className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>

          {/* Market Stats */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white">$2.1T</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">24h Volume</span>
                <span className="text-white">$45.2B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="text-white">19.8M {selectedCoin.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">All-Time High</span>
                <span className="text-white">$69,045</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button
                variant="ghost"
                className="text-blue-400 text-sm"
                onClick={() => setCurrentScreen("transaction-history")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {transactions
                .filter((tx) => tx.asset === selectedCoin.symbol || tx.asset.includes(selectedCoin.symbol))
                .slice(0, 3)
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
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
        </div>
      </div>
    )
  }

  return null
}
