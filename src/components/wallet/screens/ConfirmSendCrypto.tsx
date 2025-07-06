import React, { useState } from 'react';
import { ArrowLeft, Settings, Info } from 'lucide-react';
import { Screen, Transaction } from '@/src/lib/types';

interface ConfirmSendCryptoProps {
  transactions: Transaction[];
  setCurrentScreen: (screen: Screen) => void;
}

const ConfirmSendCrypto: React.FC<ConfirmSendCryptoProps> = ({ transactions, setCurrentScreen }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsConfirming(false);
      alert('Transaction confirmed!');
      setCurrentScreen("wallet-home");
    }, 2000);
  };

  return (
    <div className="w-full bg-gray-900 text-white min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
          <ArrowLeft 
            className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" 
            onClick={() => setCurrentScreen("send")}
          />
          <h1 className="text-lg sm:text-xl font-semibold">Confirm send</h1>
          <Settings className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        </div>

        {/* Amount Section */}
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">T</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">$4.00</div>
              <div className="text-gray-400 text-sm sm:text-base lg:text-lg">4 USDT</div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="px-6 sm:px-8 lg:px-10 space-y-4 sm:space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm sm:text-base">From</span>
            <div className="text-right">
              <div className="text-sm sm:text-base font-medium">Main Wallet</div>
              <div className="text-xs sm:text-sm text-gray-500 break-all">0xE2E3c...45E9EF6</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm sm:text-base">To</span>
            <div className="text-right">
              <div className="text-sm sm:text-base font-medium break-all">0x32bFa...8249302</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm sm:text-base">Network</span>
            <div className="text-right">
              <div className="text-sm sm:text-base font-medium">BNB Smart Chain</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm sm:text-base">Network fee</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-right">
              <div className="text-sm sm:text-base font-medium">$0.00</div>
              <div className="text-xs sm:text-sm text-gray-500">0 BNB</div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-auto p-6 sm:p-8 lg:p-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8 text-lg sm:text-xl font-semibold">
            <span>Total cost</span>
            <span>$4.00</span>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`w-full py-4 sm:py-5 lg:py-6 rounded-xl font-semibold text-lg sm:text-xl transition-all duration-200 ${
              isConfirming
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-green-400 text-black hover:bg-green-300 active:bg-green-500 active:scale-95'
            }`}
          >
            {isConfirming ? 'Processing...' : 'Confirm'}
          </button>
        </div>

        {/* Bottom Indicator */}
        <div className="flex justify-center pb-4 sm:pb-6">
          <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSendCrypto;