import React from "react"
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { Screen } from "@/src/lib/types"

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export const StakingScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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