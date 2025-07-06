import React from "react";
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";
import { Screen } from "@/src/lib/types";

interface CommonScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export const AboutScreen = ({ setCurrentScreen }: CommonScreenProps) => {
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