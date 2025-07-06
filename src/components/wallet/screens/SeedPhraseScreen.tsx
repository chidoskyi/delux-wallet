import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react"

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Alert } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface SeedPhraseScreenProps {
  step: "display" | "verify" | "backup" | "import";
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
  verificationWords: { positions: number[], answers: string[] };
  setVerificationWords: (words: { positions: number[], answers: string[] }) => void;
  walletName: string;
  setWalletName: (name: string) => void;
  walletPassword: string;
  setWalletPassword: (password: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isLoading?: boolean;
  error?: string;
}

export const SeedPhraseScreen = ({
  step,
  mnemonic,
  setMnemonic,
  verificationWords,
  setVerificationWords,
  walletName,
  setWalletName,
  walletPassword,
  setWalletPassword,
  onBack,
  onContinue,
  isLoading = false,
  error = "",
}: SeedPhraseScreenProps) => {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
  const mnemonicArray = mnemonic.split(" ");

  

  const renderScreen = () => {
    const commonLayout = (children: React.ReactNode) => (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={onBack}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <span className="ml-4 text-lg">Back</span>
          </div>
          {children}
        </div>
      </div>
    );

    if (step === "display") {
      return commonLayout(
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Your Secret Recovery Phrase</h1>

          <Alert className="mb-6 bg-yellow-500/20 border-yellow-500/50 text-yellow-200">
            <p className="text-sm">
              Write down these 12 words in order and keep them safe. Never share them with anyone.
              You'll need them to recover your wallet.
            </p>
          </Alert>

          {!showMnemonic ? (
            <div className="text-center mb-8">
              <Button
                variant="outline"
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                onClick={() => setShowMnemonic(true)}
              >
                Show Recovery Phrase
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-8 bg-gray-800/50 p-4 rounded-lg">
              {mnemonicArray.map((word, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border border-gray-700 rounded">
                  <span className="text-gray-500 text-sm">{index + 1}.</span>
                  <span className="text-white">{word}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input
                id="walletName"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="My Wallet"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="walletPassword">Wallet Password</Label>
              <Input
                id="walletPassword"
                type="password"
                value={walletPassword}
                onChange={(e) => setWalletPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <Button
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onContinue}
            disabled={!walletName || !walletPassword || !showMnemonic || isLoading}
          >
            Continue
          </Button>
        </div>
      );
    }

    if (step === "verify") {
      return commonLayout(
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Verify Recovery Phrase</h1>
          {error && (
            <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-200">
              <p className="text-sm">{error}</p>
            </Alert>
          )}
          <div className="mb-6">
            <h2 className="text-xl mb-4">Enter the requested words from your recovery phrase</h2>
            <p className="text-gray-400 text-sm mb-4">
              Please enter the correct word for each position below. (e.g., if asked for word #1, enter the first word of your phrase)
            </p>
            <div className="space-y-4">
              {verificationWords.positions.map((pos, idx) => (
                <div key={pos}>
                  <Label htmlFor={`verify-word-${pos}`}>{`Enter word #${pos}`}</Label>
                  <Input
                    id={`verify-word-${pos}`}
                    value={verificationWords.answers[idx] || ''}
                    onChange={e => {
                      const newAnswers = [...verificationWords.answers];
                      newAnswers[idx] = e.target.value.trim();
                      setVerificationWords({ ...verificationWords, answers: newAnswers });
                    }}
                    placeholder={`Word #${pos}`}
                    className="bg-gray-800 border-gray-700 mt-1"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
            onClick={onContinue}
            disabled={isLoading || verificationWords.answers.length !== verificationWords.positions.length || verificationWords.answers.some(a => !a)}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </Button>
        </div>
      );
    }

    if (step === "import") {
      return commonLayout(
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Import Wallet</h1>

          {error && (
            <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-200">
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <div className="space-y-4 mb-8">
            <div>
              <Label htmlFor="mnemonic">Recovery Phrase</Label>
              <Input
                id="mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 12-word recovery phrase"
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-gray-400 text-sm mt-1">
                Enter your 12 words separated by spaces
              </p>
            </div>

            <div>
              <Label htmlFor="importWalletName">Wallet Name</Label>
              <Input
                id="importWalletName"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="My Imported Wallet"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="importWalletPassword">Wallet Password</Label>
              <Input
                id="importWalletPassword"
                type="password"
                value={walletPassword}
                onChange={(e) => setWalletPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onContinue}
            disabled={!mnemonic || !walletName || !walletPassword || isLoading}
          >
            Import Wallet
          </Button>
        </div>
      );
    }

    return null;
  };

  return renderScreen();
}