import { TransactionItem } from "../ui/TransactionItem"
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"
import { Transaction } from "@/src/lib/types"
import { Screen } from "@/src/lib/types"

interface TransactionHistoryScreenProps {
  transactions: Transaction[]
  setCurrentScreen: (screen: Screen) => void
}

export const TransactionHistoryScreen = ({
  transactions,
  setCurrentScreen,
}: TransactionHistoryScreenProps) => {
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
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
    </div>
  )
}