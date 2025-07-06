import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import React from "react"
import { Screen } from "@/src/lib/types"

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export const SecurityScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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