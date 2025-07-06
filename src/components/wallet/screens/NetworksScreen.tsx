import React from "react";
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";
import { Screen } from "@/src/lib/types";

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}


export const NetworksScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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