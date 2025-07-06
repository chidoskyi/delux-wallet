import React from "react"
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { Screen } from "@/src/lib/types"

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export const DAppBrowserScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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