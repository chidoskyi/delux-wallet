import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, Maximize2 } from 'lucide-react';
import { Screen, Transaction } from "@/src/lib/types"

interface SendCryptoProps {
  transactions: Transaction[];
  setCurrentScreen: (screen: Screen) => void;
}

const SendCrypto: React.FC<SendCryptoProps> = ({ transactions, setCurrentScreen }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // QR Code Scanner functionality (kept for future use)
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setShowScanner(true);
        scanQRCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Mock QR detection
    setTimeout(() => {
      if (isScanning) {
        const mockAddress = '0x742d35Cc6634C0532925a3b8D' + Math.random().toString(36).substr(2, 9);
        setAddress(mockAddress);
        stopScanner();
      }
    }, 3000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  };

  const handleMaxAmount = () => {
    setAmount('1000.00'); // Mock max amount
  };

  const handleNext = () => {
    if (!address || !amount) {
      alert('Please enter both address and amount');
      return;
    }
    setCurrentScreen("send-confirm");
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-800">
        <div className="w-6"></div>
        <h1 className="text-xl font-medium">Send USDT</h1>
        <button onClick={() => setCurrentScreen("wallet-home")}> {/* Close to wallet home */}
          <X className="w-6 h-6 cursor-pointer hover:text-gray-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-8 pb-32 flex flex-col gap-8">
        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Address or Domain Name</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search or Enter"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={handlePaste}
                className="text-green-400 text-sm font-medium hover:text-green-300"
              >
                Paste
              </button>
              <button
                onClick={startScanner}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <QrCode className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="USDT Amount"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <span className="text-gray-400 text-sm">USDT</span>
              <button
                onClick={handleMaxAmount}
                className="text-green-400 text-sm font-medium hover:text-green-300"
              >
                Max
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            ≈ ${amount ? (parseFloat(amount) || 0).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Next Button Fixed at Bottom */}
      <div className="fixed bottom-6 left-4 right-4">
        <button
          onClick={handleNext}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-full transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SendCrypto;