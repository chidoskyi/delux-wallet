import React from "react"
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { PriceAlert } from "@/src/lib/types"
import { Screen } from "@/src/lib/types"

interface PriceAlertsProps {
  priceAlerts: PriceAlert[]
  setCurrentScreen: (screen: Screen) => void
}


export const PriceAlerts = ({
  priceAlerts,
  setCurrentScreen,
}: PriceAlertsProps) => {
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