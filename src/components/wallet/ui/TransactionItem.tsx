import React from "react";
import { ArrowUp, ArrowDown, Building } from "lucide-react";
import { Transaction } from "@/src/lib/types";

interface TransactionItemProps {
  transaction: Transaction
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === "send" ? "bg-red-500" : transaction.type === "receive" ? "bg-green-500" : "bg-blue-500"
            }`}
          >
            {transaction.type === "send" ? (
              <ArrowUp className="h-5 w-5" />
            ) : transaction.type === "receive" ? (
              <ArrowDown className="h-5 w-5" />
            ) : (
              <Building className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium capitalize">
              {transaction.type} {transaction.asset}
            </p>
            <p className="text-gray-400 text-sm">
              {transaction.date} at {transaction.time}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${transaction.type === "receive" ? "text-green-400" : "text-white"}`}>
            {transaction.type === "receive" ? "+" : "-"}
            {transaction.amount}
          </p>
          <p className="text-gray-400 text-sm">{transaction.usdAmount}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Fee: {transaction.fee}</span>
        <span className={`capitalize ${transaction.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  )
}

