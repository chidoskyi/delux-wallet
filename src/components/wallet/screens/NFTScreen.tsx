import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import React from "react"
import { Screen, NFT } from "@/src/lib/types"

interface NFTScreenProps {
  nft: NFT
  setCurrentScreen: (screen: Screen) => void
}

export const NFTScreen = ({
    nft,
    setCurrentScreen,
  }: NFTScreenProps) => {
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
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{nft.name}</h2>
            <p className="text-gray-400 mb-2">{nft.collection}</p>
            <p className="text-blue-400 text-xl">{nft.price}</p>
            <p className="text-gray-400">{nft.usdPrice}</p>
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