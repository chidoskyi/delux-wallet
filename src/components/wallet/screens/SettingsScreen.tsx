import { Button } from "../../ui/button"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { Screen } from "@/src/lib/types"

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export const SettingsScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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