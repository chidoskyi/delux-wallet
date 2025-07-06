"use client"

import { useState, useEffect } from "react"
import { LandingScreen } from "../components/wallet/screens/LandingScreen"
import { PasscodeScreen } from "../components/wallet/screens/PasscodeScreen"
import { SeedPhraseScreen } from "../components/wallet/screens/SeedPhraseScreen"
import { WalletHomeScreen } from "../components/wallet/screens/WalletHomeScreen"
import { TransactionHistoryScreen } from "../components/wallet/screens/TransactionHistoryScreen"
import { NFTScreen } from "../components/wallet/screens/NFTScreen"
import { SettingsScreen } from "../components/wallet/screens/SettingsScreen"
import { SecurityScreen } from "../components/wallet/screens/SecurityScreen"
import { NetworksScreen } from "../components/wallet/screens/NetworksScreen"
import SendCrypto from "../components/wallet/screens/SendCrypto"
import  ConfirmSendCrypto  from "../components/wallet/screens/ConfirmSendCrypto"
import { AboutScreen } from "../components/wallet/screens/AboutScreen"
import { CoinDetailScreen } from "../components/wallet/screens/CoinDetailScreen"
import { StakingScreen } from "../components/wallet/screens/StakingScreen"
import { DAppBrowserScreen } from "../components/wallet/screens/DAppBrowserScreen"
import { WalletManagement } from "../components/wallet/common/WalletManagement"
import { PriceAlerts } from "../components/wallet/common/PriceAlerts"
import { Screen, Transaction, NFT, Wallet, PriceAlert, CryptoAccount } from "../lib/types"


import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { showToast, toastMessages } from '../utils/toast';

// Helper for color/icon mapping
function getColorForSymbol(symbol: string) {
  switch (symbol) {
    case 'BTC': return 'bg-orange-500';
    case 'ETH': return 'bg-blue-500';
    case 'BNB': return 'bg-yellow-500';
    case 'SOL': return 'bg-purple-500';
    case 'ADA': return 'bg-blue-600';
    case 'MATIC': return 'bg-purple-600';
    case 'LINK': return 'bg-blue-400';
    case 'AVAX': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getIconForSymbol(symbol: string) {
  switch (symbol) {
    case 'BTC': return '₿';
    case 'ETH': return 'E';
    case 'BNB': return 'B';
    case 'SOL': return 'S';
    case 'ADA': return 'A';
    case 'MATIC': return 'M';
    case 'LINK': return 'L';
    case 'AVAX': return 'A';
    default: return symbol[0] || '?';
  }
}

export default function WalletSetup() {
  const { hasPasscode, isPasscodeVerified, setupPasscode, verifyPasscode, setupWallet, importWallet, hasWallet, isUserDataLoading, getWalletAccounts, getCryptoPrices, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [walletName, setWalletName] = useState("");
  const [walletPassword, setWalletPassword] = useState("");
  const [verificationWords, setVerificationWords] = useState<{positions: number[], answers: string[]}>({ positions: [], answers: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'crypto' | 'nfts'>('crypto');
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [flow, setFlow] = useState<'create' | 'import' | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [cryptoList, setCryptoList] = useState<any[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState(null);


  

  const handleImportWallet = async () => {
    setImportLoading(true);
    setImportError(null);
    try {
      const result = await authService.importWallet({
        mnemonic,
        wallet_name: walletName,
        wallet_password: walletPassword,
        passcode,
      });
      if (result.success) {
        showToast.success(toastMessages.wallet.import.success);
        setCurrentScreen("wallet-home");
      } else {
        setImportError(result.error || 'Failed to import wallet.');
        showToast.error(result.error || toastMessages.wallet.import.error);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Failed to import wallet.';
      setImportError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setImportLoading(false);
    }
  };

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "send",
      asset: "BTC",
      amount: "0.001",
      usdAmount: "$108.99",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      date: "2025-05-23",
      time: "14:30",
      status: "completed",
      fee: "$2.50",
    },
    {
      id: 2,
      type: "receive",
      asset: "ETH",
      amount: "0.5",
      usdAmount: "$1,622.84",
      address: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
      date: "2025-05-22",
      time: "09:15",
      status: "completed",
      fee: "$0.00",
    },
    {
      id: 3,
      type: "swap",
      asset: "BNB → USDT",
      amount: "2.5 → 1,612.5",
      usdAmount: "$1,612.50",
      date: "2025-05-21",
      time: "16:45",
      status: "completed",
      fee: "$8.12",
    },
  ])

  const [nfts, setNfts] = useState([
    {
      id: 1,
      name: "Bored Ape #1234",
      collection: "Bored Ape Yacht Club",
      image: "/placeholder.svg?height=200&width=200",
      price: "15.5 ETH",
      usdPrice: "$50,325.67",
    },
    {
      id: 2,
      name: "CryptoPunk #5678",
      collection: "CryptoPunks",
      image: "/placeholder.svg?height=200&width=200",
      price: "25.2 ETH",
      usdPrice: "$81,831.84",
    },
    {
      id: 3,
      name: "Azuki #9012",
      collection: "Azuki",
      image: "/placeholder.svg?height=200&width=200",
      price: "8.7 ETH",
      usdPrice: "$28,238.34",
    },
  ])

  const [wallets, setWallets] = useState([
    { id: 1, name: "Main Wallet", address: "H545417", balance: "$0.00", isActive: true },
    { id: 2, name: "Trading Wallet", address: "H789123", balance: "$2,450.67", isActive: false },
    { id: 3, name: "DeFi Wallet", address: "H456789", balance: "$15,234.89", isActive: false },
  ])

  const [priceAlerts, setPriceAlerts] = useState([
    { id: 1, asset: "BTC", condition: "above", price: "$110,000", isActive: true },
    { id: 2, asset: "ETH", condition: "below", price: "$3,000", isActive: true },
    { id: 3, asset: "BNB", condition: "above", price: "$700", isActive: false },
  ])

  const [selectedCoin, setSelectedCoin] = useState<any>(null)

  // Show loading screen while user data is being loaded after login
  if (isUserDataLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const nextStepsStr = localStorage.getItem('next_steps');
    console.log("Initial screen logic:", { nextStepsStr, hasPasscode, hasWallet, isPasscodeVerified });
    if (nextStepsStr) {
      try {
        const nextSteps = JSON.parse(nextStepsStr);
        console.log("Parsed nextSteps:", nextSteps);
        if (nextSteps.requires_passcode_setup) {
          console.log("Setting screen to set-passcode");
          setCurrentScreen("set-passcode");
        }
        else if (nextSteps.requires_passcode_verification) {
          console.log("Setting screen to enter-passcode");
          setCurrentScreen("enter-passcode");
        }
        else if (nextSteps.setup_wallet) {
          console.log("Setting screen to landing");
          setCurrentScreen("landing");
        }
        else if (nextSteps.has_wallet) setCurrentScreen("wallet-home");
        else {
          console.log("Setting screen to landing (default)");
          setCurrentScreen("landing");
        }
        localStorage.removeItem('next_steps');
      } catch (e) {
        console.error("Error parsing next_steps:", e);
        setCurrentScreen("landing");
        localStorage.removeItem('next_steps');
      }
    } else {
      // On refresh, if tokens exist and user has a passcode, check if already verified
      const tokens = authService.getStoredTokens();
      console.log("No next_steps, checking tokens and hasPasscode:", { tokens: !!tokens.access, hasPasscode, hasWallet, isPasscodeVerified });
      if (tokens.access && tokens.refresh) {
        if (hasPasscode) {
          if (isPasscodeVerified && hasWallet) {
            // Passcode already verified, check if user has wallet and go to appropriate screen
            console.log("Passcode already verified, checking wallet status...");
            // We'll check wallet status and navigate accordingly
            setCurrentScreen("wallet-home"); // Default to wallet home, will be adjusted if needed
          } else {
            console.log("Setting screen to enter-passcode (refresh)");
            setCurrentScreen("enter-passcode");
          }
        }
        else {
          console.log("Setting screen to set-passcode (refresh)");
          setCurrentScreen("set-passcode");
        }
      } else {
        console.log("Setting screen to landing (no tokens)");
        setCurrentScreen("landing");
      }
    }
  }, [hasPasscode, isPasscodeVerified, hasWallet]);

  useEffect(() => {
    if (hasPasscode && !isPasscodeVerified) {
      setCurrentScreen("enter-passcode");
    } else if (!hasPasscode) {
      setCurrentScreen("set-passcode");
    }
  }, [hasPasscode, isPasscodeVerified]);

  // Check wallet status when user is already verified
  useEffect(() => {
    const checkWalletStatusForVerifiedUser = async () => {
      if (isPasscodeVerified && currentScreen === "wallet-home") {
        console.log("User is verified, proceeding to wallet home");
        // The wallet home screen will handle any wallet-specific logic
        // If there are any wallet-related issues, they will be handled by the backend
      }
    };

    checkWalletStatusForVerifiedUser();
  }, [isPasscodeVerified, currentScreen]);

  useEffect(() => {
    if (currentScreen === 'create-wallet') {
      setWalletLoading(true);
      setWalletError(null);
      authService.getMnemonicForWalletCreation()
        .then((data) => {
          setMnemonic(data.mnemonic);
          setVerificationWords({ positions: data.verification.word_positions, answers: [] });
          setWalletLoading(false);
        })
        .catch((err) => {
          setWalletError('Failed to generate mnemonic. Please try again.');
          setWalletLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]);

  // useEffect(() => {
  //   console.log('Running wallet-home effect', { currentScreen, isPasscodeVerified });
    
  //   if (currentScreen === 'wallet-home' && isPasscodeVerified && isAuthenticated) {
  //     setBalancesLoading(true);
  //     setBalancesError(null);
  
  //     getWalletAccounts()
  //       .then(accountsData => {
  //         console.log('Accounts data:', accountsData);
  //         return getCryptoPrices().then(pricesData => {
  //           console.log('Prices data:', pricesData);
            
  //           const mergedList = (accountsData?.accounts || []).map((acct: any) => {
  //             const symbol = acct.cryptocurrency.symbol;
  //             const mergedItem = {
  //               name: acct.cryptocurrency.name,
  //               symbol,
  //               // Fixed: Access price_usd from crypto_data[symbol]
  //               price: pricesData?.crypto_data?.[symbol]?.price_usd || 'N/A',
  //               change24h: pricesData?.crypto_data?.[symbol]?.formatted_change_24h || 'N/A',
  //               balance: acct.balance,
  //               address: acct.address,
  //               color: getColorForSymbol(symbol),
  //               icon: getIconForSymbol(symbol),
  //             };
  //             console.log('Merged item:', mergedItem);
  //             return mergedItem;
  //           });
            
  //           console.log('Full merged list:', mergedList);
  //           setCryptoList(mergedList);
  //         });
  //       })
  //       .catch(() => setBalancesError('Failed to load accounts or prices.'))
  //       .finally(() => setBalancesLoading(false));
  //   }
  //   // If not all conditions are met, do nothing
  // }, [currentScreen, isPasscodeVerified, getWalletAccounts, getCryptoPrices]);

  useEffect(() => {
    console.log('Running wallet-home effect', { currentScreen, isPasscodeVerified });
    
    if (currentScreen === 'wallet-home' && isPasscodeVerified && isAuthenticated) {
      setBalancesLoading(true);
      setBalancesError(null);
  
      getWalletAccounts()
        .then(accountsData => {
          console.log('Accounts data:', accountsData);
          return getCryptoPrices().then(pricesData => {
            console.log('Prices data:', pricesData);
            
            // Store the crypto data for use in coin detail screen
            setCryptoData(pricesData?.crypto_data || {});
            
            const mergedList = (accountsData?.accounts || []).map((acct: any) => {
              const symbol = acct.cryptocurrency.symbol;
              const mergedItem = {
                name: acct.cryptocurrency.name,
                symbol,
                price: pricesData?.crypto_data?.[symbol]?.price_usd || 'N/A',
                change24h: pricesData?.crypto_data?.[symbol]?.formatted_change_24h || 'N/A',
                balance: acct.balance,
                address: acct.address,
                color: getColorForSymbol(symbol),
                icon: getIconForSymbol(symbol),
              };
              console.log('Merged item:', mergedItem);
              return mergedItem;
            });
            
            console.log('Full merged list:', mergedList);
            setCryptoList(mergedList);
          });
        })
        .catch(() => setBalancesError('Failed to load accounts or prices.'))
        .finally(() => setBalancesLoading(false));
    }
  }, [currentScreen, isPasscodeVerified, getWalletAccounts, getCryptoPrices, isAuthenticated]);

  // Add this function to calculate total portfolio value with proper TypeScript types
  const calculateTotalPortfolioValue = (cryptoList: CryptoAccount[]): number => {
    if (!cryptoList || cryptoList.length === 0) {
      return 0;
    }
    
    return cryptoList.reduce((total: number, crypto: CryptoAccount) => {
      const balance = parseFloat(crypto.balance.toString()) || 0;
      const price = parseFloat(crypto.price.toString()) || 0;
      return total + (balance * price);
    }, 0);
  };

// 2. Calculate the total before passing to WalletHomeScreen
const totalPortfolioValue = calculateTotalPortfolioValue(cryptoList);
  

  if (currentScreen === "landing") {
    return (
      <LandingScreen
        setCurrentScreen={setCurrentScreen}
        onCreateWallet={() => {
          setFlow('create');
          if (!hasPasscode) {
            setCurrentScreen("set-passcode");
          } else {
            setCurrentScreen("create-wallet");
          }
        }}
        onImportWallet={() => {
          setFlow('import');
          if (!hasPasscode) {
            setCurrentScreen("set-passcode");
          } else {
            setCurrentScreen("wallet-import");
          }
        }}
      />
    );
  }

  if (currentScreen === "set-passcode") {
    const handleSetupPasscode = async () => {
      // Just move to confirm screen, no API call yet
      setCurrentScreen("confirm-passcode");
    };
    return (
      <PasscodeScreen
        type="set"
        passcode={passcode}
        setPasscode={setPasscode}
        onBack={() => setCurrentScreen("landing")}
        onContinue={handleSetupPasscode}
        setCurrentScreen={setCurrentScreen}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  if (currentScreen === "confirm-passcode") {
    const handleConfirmPasscode = async () => {
      setIsLoading(true);
      setError("");
      try {
        console.log("Confirming passcode:", { passcode, confirmPasscode, flow });
        if (passcode === confirmPasscode) {
          console.log("Passcodes match, calling setupPasscode API...");
          // Call the API to actually set up the passcode
          const result = await setupPasscode(passcode, confirmPasscode);
          console.log("setupPasscode result:", result);
          if (result) {
            showToast.success(toastMessages.passcode.setup.success);
            // Navigate based on flow
            if (flow === 'create') setCurrentScreen("create-wallet");
            else if (flow === 'import') setCurrentScreen("wallet-import");
            else setCurrentScreen("landing");
          } else {
            setError("Failed to set up passcode.");
            showToast.error(toastMessages.passcode.setup.error);
          }
        } else {
          console.log("Passcodes don't match");
          setError("Passcodes do not match.");
          showToast.error(toastMessages.passcode.confirm.error);
        }
      } catch (err: any) {
        console.error("Error in handleConfirmPasscode:", err);
        setError('Failed to set up passcode.');
        showToast.error(toastMessages.passcode.setup.error);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <PasscodeScreen
        type="confirm"
        passcode={passcode}
        setPasscode={setPasscode}
        confirmPasscode={confirmPasscode}
        setConfirmPasscode={setConfirmPasscode}
        onBack={() => setCurrentScreen("set-passcode")}
        onContinue={handleConfirmPasscode}
        setCurrentScreen={setCurrentScreen}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  if (currentScreen === "create-wallet") {
    if (walletLoading) return <div className="p-8 text-center text-white">Generating mnemonic...</div>;
    if (walletError) return <div className="p-8 text-center text-red-400">{walletError}</div>;
    return (
      <SeedPhraseScreen
        step="display"
        mnemonic={mnemonic}
        setMnemonic={setMnemonic}
        verificationWords={verificationWords}
        setVerificationWords={setVerificationWords}
        walletName={walletName}
        setWalletName={setWalletName}
        walletPassword={walletPassword}
        setWalletPassword={setWalletPassword}
        onBack={() => setCurrentScreen("landing")}
        onContinue={() => setCurrentScreen("seed-phrase-verify")}
      />
    );
  }

  if (currentScreen === "seed-phrase-verify") {
    

    const handleVerifyAndCreate = async () => {
      setVerifyLoading(true);
      setVerifyError(null);
      try {
        const result = await authService.verifyAndCreateWallet({
          mnemonic,
          wallet_name: walletName,
          wallet_password: walletPassword,
          verification: {
            mnemonic,
            word_positions: verificationWords.positions,
            word_answers: verificationWords.answers,
          },
        });
        if (result.success) {
          showToast.success(toastMessages.wallet.create.success);
          setCurrentScreen("wallet-home");
        } else {
          setVerifyError(result.error || 'Failed to create wallet.');
          showToast.error(result.error || toastMessages.wallet.create.error);
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error || 'Failed to create wallet.';
        setVerifyError(errorMsg);
        showToast.error(errorMsg);
      } finally {
        setVerifyLoading(false);
      }
    };

    return (
      <SeedPhraseScreen
        step="verify"
        mnemonic={mnemonic}
        setMnemonic={setMnemonic}
        verificationWords={verificationWords}
        setVerificationWords={setVerificationWords}
        walletName={walletName}
        setWalletName={setWalletName}
        walletPassword={walletPassword}
        setWalletPassword={setWalletPassword}
        onBack={() => setCurrentScreen("create-wallet")}
        onContinue={handleVerifyAndCreate}
        isLoading={verifyLoading}
        error={verifyError || undefined}
      />
    );
  }

  if (currentScreen === "wallet-import") {
    return (
      <SeedPhraseScreen
        step="import"
        mnemonic={mnemonic}
        setMnemonic={setMnemonic}
        verificationWords={verificationWords}
        setVerificationWords={setVerificationWords}
        walletName={walletName}
        setWalletName={setWalletName}
        walletPassword={walletPassword}
        setWalletPassword={setWalletPassword}
        onBack={() => {
          if (!hasPasscode) setCurrentScreen("set-passcode");
          else setCurrentScreen("landing");
        }}
        onContinue={handleImportWallet}
        isLoading={importLoading}
        error={importError || undefined}
      />
    );
  }

  if (currentScreen === "enter-passcode") {
    const handleVerifyPasscode = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await verifyPasscode(passcode);
        if (result) {
          showToast.success(toastMessages.passcode.verify.success);
          
          // With session-based verification, we can proceed to wallet home
          // The backend will handle any wallet-specific requirements
          setCurrentScreen("wallet-home");
        } else {
          setError("Invalid passcode.");
          showToast.error(toastMessages.passcode.verify.error);
        }
      } catch (err: any) {
        setError('Failed to verify passcode.');
        showToast.error(toastMessages.passcode.verify.error);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <PasscodeScreen
        type="enter"
        passcode={passcode}
        setPasscode={setPasscode}
        onBack={() => setCurrentScreen("landing")}
        onContinue={handleVerifyPasscode}
        setCurrentScreen={setCurrentScreen}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  if (currentScreen === "wallet-home") {
    if (balancesLoading) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading balances...</p>
          </div>
        </div>
      );
    }
    if (balancesError) {
      return (
        <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">
          <div className="text-center">
            <p>{balancesError}</p>
          </div>
        </div>
      );
    }
    return (
      <WalletHomeScreen
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentScreen={setCurrentScreen}
        cryptoList={cryptoList}
        nfts={nfts}
        transactions={transactions}
        setSelectedNFT={setSelectedNFT}
        setSelectedCoin={setSelectedCoin}
        totalPortfolioValue={totalPortfolioValue} // Add this new prop
      />
    );
  }

  

  if (currentScreen === "send") {
    return <SendCrypto transactions={transactions} setCurrentScreen={setCurrentScreen} />
  }
  if (currentScreen === "send-confirm") {
    return <ConfirmSendCrypto transactions={transactions} setCurrentScreen={setCurrentScreen} />
  }
  if (currentScreen === "transaction-history") {
    return <TransactionHistoryScreen transactions={transactions} setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "nft-detail" && selectedNFT) {
    return <NFTScreen nft={selectedNFT} setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "wallet-management") {
    return <WalletManagement wallets={wallets} setWallets={setWallets} setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "price-alerts") {
    return <PriceAlerts priceAlerts={priceAlerts} setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "settings") {
    return <SettingsScreen setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "security") {
    return <SecurityScreen setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "networks") {
    return <NetworksScreen setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "about") {
    return <AboutScreen setCurrentScreen={setCurrentScreen} />
  }

if (currentScreen === "coin-detail" && selectedCoin) {
  return (
    <CoinDetailScreen
      coin={selectedCoin}
      setCurrentScreen={setCurrentScreen}
      transactions={transactions}
      cryptoData={cryptoData}
    />
  )
}

  if (currentScreen === "staking") {
    return <StakingScreen setCurrentScreen={setCurrentScreen} />
  }

  if (currentScreen === "dapp-browser") {
    return <DAppBrowserScreen setCurrentScreen={setCurrentScreen} />
  }

  return null
}