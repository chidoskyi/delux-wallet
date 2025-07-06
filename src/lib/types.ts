// types.ts
export type Screen =
  | "landing"
  | "set-passcode"
  | "enter-passcode"
  | "confirm-passcode"
  | "create-wallet"
  | "seed-phrase-1"
  | "seed-phrase-4"
  | "seed-phrase-verify"
  | "seed-phrase-complete"
  | "wallet-home"
  | "send"
  | "wallet-import"
  | "send-confirm"
  | "receive"
  | "buy"
  | "swap"
  | "settings"
  | "security"
  | "networks"
  | "about"
  | "transaction-history"
  | "nft-gallery"
  | "nft-detail"
  | "wallet-management"
  | "price-alerts"
  | "staking"
  | "dapp-browser"
  | "coin-detail"

export interface Transaction {
  id: number
  type: string
  asset: string
  amount: string
  usdAmount: string
  address?: string
  date: string
  time: string
  status: string
  fee: string
}

export interface NFT {
  id: number
  name: string
  collection: string
  image: string
  price: string
  usdPrice: string
}

export interface Wallet {
  id: number
  name: string
  address: string
  balance: string
  isActive: boolean
}

export interface PriceAlert {
  id: number
  asset: string
  condition: string
  price: string
  isActive: boolean
}

export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
  network: string;
  contract_address: string | null;
  decimals: number;
  is_active: boolean;
  logo_url: string | null;
  derivation_path: string;
  created_at: string;
}

export interface TransactionFee {
  usd: string;
  native: string;
  symbol: string;
}

export interface SendCrypto {
  // State properties
  address: string;
  amount: string;
  showScanner: boolean;
  isScanning: boolean;
  currentScreen: "main" | "send" | "receive" | "buy";
  showSend: boolean;
  
  // Ref properties
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  
  // Handler methods
  startScanner: () => Promise<void>;
  stopScanner: () => void;
  scanQRCode: () => void;
  handlePaste: () => Promise<void>;
  handleMaxAmount: () => void;
  handleNext: () => void;
  handleSendClick: () => void;
  handleCloseSend: () => void;
  setCurrentScreen: (screen: Screen) => void
}

export interface ConfirmSendCrypto {
  // State properties
  isConfirming: boolean;
  
  // Handler methods
  handleConfirm: () => void;
  
  // Transaction details (based on the rendered data)
  transactionData: {
    amount: string;
    amountInUSDT: string;
    fromWallet: {
      name: string;
      address: string;
    };
    toAddress: string;
    network: string;
    networkFee: {
      usd: string;
      native: string;
    };
    totalCost: string;
  };
}

export interface CryptoAccount {
  address: string;
  balance: string;
  color: string;
  icon: string;
  name: string;
  price: number;
  symbol: string;
  // Optional UI properties
  change24h?: string;
  network: string;
  contract_address: string | null;
  decimals: number;
  is_active: boolean;
  logo_url: string | null;
  derivation_path: string;
  created_at: string;
  usdValue: number;
  formattedUsdValue: string;
  conversionRate: number;
  total: number;
}


export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  phone_number: string;
  // Add any other registration fields
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone_number: string | null;
  has_wallet: boolean;
  has_passcode: boolean;
  is_verified: boolean;
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  created_at: string;
}

export type MaybeUser = User | null;


export interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  next_steps?: any;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  phone_number: string | null;
  has_wallet: boolean;
  has_passcode: boolean;
  is_verified: boolean;
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  created_at: string;
  // Add other profile fields as needed
}

export interface PasscodeSetupData {
  passcode: string;
  passcode_confirm: string;
}

export interface PasscodeScreenProps {
  type: "set" | "enter" | "confirm";
  passcode: string;
  setPasscode: (passcode: string) => void;
  confirmPasscode?: string;
  setConfirmPasscode?: (passcode: string) => void;
  onBack: () => void;
  onContinue: () => void;
  setCurrentScreen: (screen: Screen) => void;
  isLoading?: boolean;
  error?: string;
}

export interface LandingScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  onCreateWallet: () => void;
  onImportWallet: () => void;
}

export interface PasscodeVerifyData {
  passcode: string;
}

export interface WalletSetupData {
  wallet_name: string;
  wallet_password: string;
  mnemonic?: string;
  verification?: {
    word_positions: number[];
    word_answers: string[];
  };
}


export interface WalletHomeScreenProps {
  activeTab: "crypto" | "nfts"
  setActiveTab: (tab: "crypto" | "nfts") => void
  setCurrentScreen: (screen: Screen) => void
  cryptoList: CryptoAccount[]
  nfts: NFT[]
  transactions: Transaction[]
  setSelectedNFT: (nft: NFT) => void
  setSelectedCoin: (coin: CryptoAccount) => void
  totalPortfolioValue: number; // Add this new prop
}
