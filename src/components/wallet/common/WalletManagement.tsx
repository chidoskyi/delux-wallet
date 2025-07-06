import React from "react"
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { Wallet } from "@/src/lib/types"
import { Screen } from "@/src/lib/types"

interface WalletManagementProps {
  wallets: Wallet[]
  setWallets: (wallets: Wallet[]) => void
  setCurrentScreen: (screen: Screen) => void
}


export const WalletManagement = ({
  wallets,
  setWallets,
  setCurrentScreen,
}: WalletManagementProps) => {
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