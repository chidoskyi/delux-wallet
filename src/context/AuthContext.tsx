import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { MaybeUser } from '../lib/types';
import { showToast, toastMessages } from '../utils/toast';


type AuthContextType = {
  user: MaybeUser;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isUserDataLoading: boolean;
  isAuthenticated: boolean;
  refreshToken: () => Promise<boolean>;
  obtainToken: (access: string) => Promise<boolean>;
  // Passcode Management
  hasPasscode: boolean;
  isPasscodeVerified: boolean;
  setupPasscode: (passcode: string, confirmPasscode: string) => Promise<boolean>;
  // disablePasscode: (passcode: string) => Promise<boolean>;
  checkPasscodeStatus: () => Promise<boolean>;
  verifyPasscode: (passcode: string) => Promise<boolean>;
  changePasscode: (currentPasscode: string, newPasscode: string) => Promise<boolean>;
  // Wallet Management
  hasWallet: boolean;
  setupWallet: (data: import('../lib/types').WalletSetupData) => Promise<boolean>;
  importWallet: (data: import('../lib/types').WalletSetupData & { passcode: string }) => Promise<boolean>;

  // Wallet Management
  getWalletAccounts: () => Promise<any>;
  getWalletBalances: () => Promise<any>;
  getWalletBalanceRefresh: (account_id: string) => Promise<any>;
  getCryptoPrices: () => Promise<any>;
  getWalletStatus: (passcode: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MaybeUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);
  const [hasPasscode, setHasPasscode] = useState(false);
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [passcodeSessionId, setPasscodeSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user && authService.isAuthenticated();

  const logout = useCallback(async () => {
    try {
      // First update the state
      setUser(null);
      setHasPasscode(false);
      setIsPasscodeVerified(false);
      setIsLoading(true);

      // Clear all localStorage items
      const itemsToClear = [
        'access_token',
        'refresh_token',
        'user',
        'hasPasscode',
        'hasWallet',
        'isPasscodeVerified',
        'passcodeSessionId',
        'passcodeSessionTimestamp',
        'wallet_setup_status',
        'selected_wallet'
      ];

      itemsToClear.forEach(item => localStorage.removeItem(item));

      // Try to call logout API if we have a token
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Error calling logout API:', error);
          // Continue with local logout even if API call fails
        }
      }

      showToast.success(toastMessages.logout.success);
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure state is cleared even if there's an error
      setUser(null);
      setHasPasscode(false);
      setIsPasscodeVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in and passcode status from localStorage
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const tokens = authService.getStoredTokens();
        const hasPasscodeStr = localStorage.getItem('hasPasscode');
        const isPasscodeVerifiedStr = localStorage.getItem('isPasscodeVerified');
        const sessionId = localStorage.getItem('passcodeSessionId');
        const hasWalletStr = localStorage.getItem('hasWallet');
        const sessionTimestamp = localStorage.getItem('passcodeSessionTimestamp');

        // Set initial wallet status from localStorage
        if (hasWalletStr) {
          setHasWallet(hasWalletStr === 'true');
        }

        if (tokens.access && tokens.refresh) {
          // If we have stored user data, set it immediately to prevent flash
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (e) {
              console.error('Failed to parse stored user data:', e);
            }
          }

          try {
            // Try to fetch fresh profile with current access token
            const profile = await authService.getProfile();
            localStorage.setItem('user', JSON.stringify(profile));
            setUser(profile);

            // Verify passcode and wallet status
            const passcodeStatus = await authService.checkPasscodeStatus();
            const newHasPasscode = passcodeStatus.has_passcode;
            const newHasWallet = passcodeStatus.has_wallet;
            setHasPasscode(newHasPasscode);
            setHasWallet(newHasWallet);
            localStorage.setItem('hasPasscode', newHasPasscode.toString());
            localStorage.setItem('hasWallet', newHasWallet.toString());

            if (newHasPasscode) {
              // Check if we have a valid session
              const now = Date.now();
              const sessionTime = sessionTimestamp ? parseInt(sessionTimestamp) : 0;
              const sessionValid = sessionId && sessionTime && (now - sessionTime) < (30 * 60 * 1000); // 30 minutes
              
              if (sessionValid) {
                setIsPasscodeVerified(true);
                setPasscodeSessionId(sessionId);
                console.log("Valid passcode session found, user is verified");
              } else {
                // Clear invalid session
                localStorage.removeItem('passcodeSessionId');
                localStorage.removeItem('passcodeSessionTimestamp');
                setIsPasscodeVerified(false);
                setPasscodeSessionId(null);
              }
            } else {
              setIsPasscodeVerified(false);
              setPasscodeSessionId(null);
              localStorage.removeItem('isPasscodeVerified');
              localStorage.removeItem('passcodeSessionId');
              localStorage.removeItem('passcodeSessionTimestamp');
            }
          } catch (error) {
            console.error('Profile fetch failed, trying token refresh:', error);
            // If access token is expired, try to refresh
            try {
              await authService.refreshToken(tokens.refresh);
              // Retry profile fetch after refresh
              const profile = await authService.getProfile();
              localStorage.setItem('user', JSON.stringify(profile));
              setUser(profile);
              // Retry passcode and wallet status
              const passcodeStatus = await authService.checkPasscodeStatus();
              const newHasPasscode = passcodeStatus.has_passcode;
              const newHasWallet = passcodeStatus.has_wallet;
              setHasPasscode(newHasPasscode);
              setHasWallet(newHasWallet);
              localStorage.setItem('hasPasscode', newHasPasscode.toString());
              localStorage.setItem('hasWallet', newHasWallet.toString());
              if (newHasPasscode) {
                // Check if we have a valid session
                const now = Date.now();
                const sessionTime = sessionTimestamp ? parseInt(sessionTimestamp) : 0;
                const sessionValid = sessionId && sessionTime && (now - sessionTime) < (30 * 60 * 1000); // 30 minutes
                
                if (sessionValid) {
                  setIsPasscodeVerified(true);
                  setPasscodeSessionId(sessionId);
                  console.log("Valid passcode session found, user is verified");
                } else {
                  // Clear invalid session
                  localStorage.removeItem('passcodeSessionId');
                  localStorage.removeItem('passcodeSessionTimestamp');
                  setIsPasscodeVerified(false);
                  setPasscodeSessionId(null);
                }
              } else {
                setIsPasscodeVerified(false);
                setPasscodeSessionId(null);
                localStorage.removeItem('isPasscodeVerified');
                localStorage.removeItem('passcodeSessionId');
                localStorage.removeItem('passcodeSessionTimestamp');
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // If refresh fails, clear state but do not log out immediately
              setUser(null);
              setHasPasscode(false);
              setIsPasscodeVerified(false);
              setPasscodeSessionId(null);
            }
          }
        } else {
          // No tokens, clear all auth data and log out
          await logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Only log out if tokens are missing
        const tokens = authService.getStoredTokens();
        if (!tokens.access || !tokens.refresh) {
          await logout();
        } else {
          setUser(null);
          setHasPasscode(false);
          setIsPasscodeVerified(false);
          setPasscodeSessionId(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Set user data from the response
      const profile = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
      
      // Load user data (passcode and wallet status)
      setIsUserDataLoading(true);
      try {
        // Check passcode status
        const passcodeStatus = await authService.checkPasscodeStatus();
        const newHasPasscode = passcodeStatus.has_passcode;
        const newHasWallet = passcodeStatus.has_wallet;
        
        setHasPasscode(newHasPasscode);
        setHasWallet(newHasWallet);
        localStorage.setItem('hasPasscode', newHasPasscode.toString());
        localStorage.setItem('hasWallet', newHasWallet.toString());
        
        console.log('User data loaded after login:', { hasPasscode: newHasPasscode, hasWallet: newHasWallet });
      } catch (userDataError) {
        console.error('Failed to load user data after login:', userDataError);
        // Don't fail login if user data loading fails
      } finally {
        setIsUserDataLoading(false);
      }
      
      showToast.success(toastMessages.login.success);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      showToast.error(toastMessages.login.error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const tokens = authService.getStoredTokens();
      if (!tokens.refresh) {
        return false;
      }

      await authService.refreshToken(tokens.refresh);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      showToast.error(toastMessages.general.networkError);
      await logout();
      return false;
    }
  };

  const obtainToken = async (access: string): Promise<boolean> => {
    try {
      const tokens = authService.getStoredTokens();
      if (!tokens.refresh) {
        return false;
      }

      await authService.obtainToken(access);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      showToast.error(toastMessages.general.networkError);
      await logout();
      return false;
    }
  };

  const setupPasscode = async (passcode: string, confirmPasscode: string): Promise<boolean> => {
    try {
      console.log("AuthContext: setupPasscode called with:", { passcode, confirmPasscode });
      await authService.setupPasscode({ passcode, passcode_confirm: confirmPasscode });
      console.log("AuthContext: setupPasscode API call successful");
      setHasPasscode(true);
      localStorage.setItem('hasPasscode', 'true');
      console.log("AuthContext: hasPasscode set to true");
      showToast.success(toastMessages.passcode.setup.success);
      return true;
    } catch (error) {
      console.error('Passcode setup failed:', error);
      showToast.error(toastMessages.passcode.setup.error);
      return false;
    }
  };

  // const disablePasscode = async (passcode: string): Promise<boolean> => {
  //   try {
  //     await authService.disablePasscode({ passcode  });
  //     setHasPasscode(false);
  //     localStorage.removeItem('hasPasscode');
  //     return true;
  //   } catch (error) { 
  //     console.error('Passcode disable failed:', error);
  //     showToast.error(toastMessages.passcode.disable.error);
  //     return false;
  //   }
  // };

  const checkPasscodeStatus = async (): Promise<boolean> => {
    try {
      const response = await authService.checkPasscodeStatus();
      return response.has_passcode;
    } catch (error) {
      console.error('Passcode status check failed:', error);
      return false; 
    }
  };

  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const response = await authService.verifyPasscode({ passcode });
      setIsPasscodeVerified(response.valid);
      localStorage.setItem('isPasscodeVerified', response.valid.toString());
      
      if (response.valid) {
        // Create a session for passcode verification
        const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const timestamp = Date.now().toString();
        setPasscodeSessionId(sessionId);
        localStorage.setItem('passcodeSessionId', sessionId);
        localStorage.setItem('passcodeSessionTimestamp', timestamp);
        console.log("Passcode verified, session created:", sessionId);
        showToast.success(toastMessages.passcode.verify.success);
      } else {
        showToast.error(toastMessages.passcode.verify.error);
      }
      
      return response.valid;
    } catch (error) {
      console.error('Passcode verification failed:', error);
      showToast.error(toastMessages.passcode.verify.error);
      return false;
    }
  };

  const changePasscode = async (currentPasscode: string, newPasscode: string): Promise<boolean> => {
    try {
      await authService.changePasscode(currentPasscode, newPasscode);
      showToast.success(toastMessages.passcode.change.success);
      return true;
    } catch (error) {
      console.error('Passcode change failed:', error);
      showToast.error(toastMessages.passcode.change.error);
      return false;
    }
  };

  const setupWallet = async (data: import('../lib/types').WalletSetupData): Promise<boolean> => {
    try {
      await authService.createNewWallet(data);
      setHasWallet(true);
      showToast.success(toastMessages.wallet.create.success);
      return true;
    } catch (error) {
      console.error('Wallet setup failed:', error);
      showToast.error(toastMessages.wallet.create.error);
      return false;
    }
  };

  const importWallet = async (data: import('../lib/types').WalletSetupData & { passcode: string }): Promise<boolean> => {
    try {
      await authService.importWallet(data);
      setHasWallet(true);
      showToast.success(toastMessages.wallet.import.success);
      return true;
    } catch (error) {
      console.error('Wallet import failed:', error);
      showToast.error(toastMessages.wallet.import.error);
      return false;
    }
  };

  const getWalletAccounts = useCallback(async (): Promise<{accounts?: any[], error?: string}> => {
    try {
      const response = await authService.getWalletAccounts();
      console.log('Wallet accounts raw response:', response);
      
      // Check if response exists and has accounts
      if (!response || !response.accounts) {
        throw new Error('No accounts data received');
      }
      
      return { accounts: response.accounts };
    } catch (error: any) {
      console.error('Failed to fetch wallet accounts:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load wallet accounts';
      return { error: errorMsg };
    }
  }, []);

  const getWalletBalances = async (): Promise<any> => {
    const response = await authService.getWalletBalances(); 
    return response.data;
  };

  const getWalletBalanceRefresh = async (account_id: string): Promise<any> => {
    const response = await authService.getWalletBalanceRefresh(account_id);
    return response.data;
  };

  const getCryptoPrices = useCallback(async (): Promise<{crypto_data?: any, error?: string}> => {
    try {
      const response = await authService.getCryptoPrices();
      console.log('Crypto prices raw response:', response);
      
      // Check if response exists and has prices
      if (!response || !response.crypto_data) {
        throw new Error('No prices data received');
      }
      
      return { crypto_data: response.crypto_data };
    } catch (error: any) {
      console.error('Failed to fetch crypto prices:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load crypto prices';
      return { error: errorMsg };
    }
  }, []);

  const getWalletStatus = async (passcode: string): Promise<any> => {
    const response = await authService.getWalletStatus(passcode);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      isUserDataLoading,
      isAuthenticated,
      refreshToken,
      obtainToken,
      // Passcode Management
      hasPasscode,
      isPasscodeVerified,
      setupPasscode,
      // disablePasscode,
      checkPasscodeStatus,
      verifyPasscode,
      changePasscode,
      // Wallet Management
      hasWallet,
      setupWallet,
      importWallet,
      getWalletAccounts,
      getWalletBalances,
      getWalletBalanceRefresh,
      getCryptoPrices,
      getWalletStatus
    }}> 
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}