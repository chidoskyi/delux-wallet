import axios from './axios';
import { RegisterData, AuthResponse, LoginData, UserProfile, PasscodeSetupData, PasscodeVerifyData, WalletSetupData } from '../lib/types';


const authService = {
  register: async (data: RegisterData) => {
    const response = await axios.post<AuthResponse>('/auth/register/', data);
    const { tokens } = response.data;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    return response.data;
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post<AuthResponse>('/auth/login/', data);
      const { tokens, user, next_steps } = response.data;
      
      // Store auth data
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('next_steps', JSON.stringify(next_steps));
      
      // Check and set passcode status
      try {
        const passcodeStatus = await authService.checkPasscodeStatus();
        if (passcodeStatus.has_passcode) {
          localStorage.setItem('hasPasscode', 'true');
        }
        if (passcodeStatus.has_wallet) {
          localStorage.setItem('hasWallet', 'true');
        }
      } catch (passcodeError) {
        console.error('Failed to check passcode status:', passcodeError);
        // Don't fail the login if passcode check fails
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any partial auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('next_steps');
      localStorage.removeItem('user');
      localStorage.removeItem('hasPasscode');
      localStorage.removeItem('hasWallet');
      throw error;
    }
  },

  refreshToken: async (refresh: string) => {
    const response = await axios.post<{ access: string }>('/auth/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  },

  obtainToken: async (access: string) => {
    const response = await axios.post<{ access: string }>('/auth/obtain-token/', { access_token: access });
    const { access: newAccess } = response.data;
    localStorage.setItem('access_token', newAccess);
    return newAccess;
  },

  getProfile: async () => {
    const response = await axios.get<UserProfile>('/auth/profile/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasPasscode');
  },

  // Passcode Management
  setupPasscode: async (data: PasscodeSetupData) => {
    console.log("authService: setupPasscode called with:", data);
    const response = await axios.post('/auth/passcode/setup/', data);
    console.log("authService: setupPasscode API response:", response.data);
    localStorage.setItem('hasPasscode', 'true');
    console.log("authService: hasPasscode set in localStorage");
    return response.data;
  },
  disablePasscode: async (data: PasscodeSetupData) => {
    console.log("authService: disablePasscode called with:", data);
    const response = await axios.post('/auth/passcode/disable/', data);
    console.log("authService: disablePasscode API response:", response.data);
    localStorage.removeItem('hasPasscode');
    console.log("authService: hasPasscode removed from localStorage");
    return response.data;
  },

  verifyPasscode: async (data: PasscodeVerifyData) => {
    const response = await axios.post('/auth/passcode/verify/', data);
    return response.data;
  },

  checkPasscodeStatus: async () => {
    const response = await axios.get('/auth/passcode/status/');
    return response.data;
  },

  changePasscode: async (currentPasscode: string, newPasscode: string) => {
    const response = await axios.post('/auth/passcode/change/', {
      current_passcode: currentPasscode,
      new_passcode: newPasscode,
      confirm_new_passcode: newPasscode
    });
    return response.data;
  },

  // Wallet Management
  getWalletSetupOptions: async () => {
    const response = await axios.get('/wallet/setup/');
    return response.data;
  },

  // Step 1: Get mnemonic and verification positions for wallet creation
  getMnemonicForWalletCreation: async () => {
    const response = await axios.post('/wallet/create/new/', {});
    return response.data;
  },

  // Step 2: Verify mnemonic and create wallet
  verifyAndCreateWallet: async (data: WalletSetupData & { verification: { mnemonic: string; word_positions: number[]; word_answers: string[] } }) => {
    // The backend expects mnemonic inside the verification object
    const { mnemonic, wallet_name, wallet_password, verification } = data;
    const response = await axios.post('/wallet/create/new/', {
      mnemonic,
      wallet_name,
      wallet_password,
      verification: {
        mnemonic,
        word_positions: verification.word_positions,
        word_answers: verification.word_answers,
      },
    });
    return response.data;
  },

  createNewWallet: async (data: WalletSetupData) => {
    // Legacy: direct call for old flow
    const response = await axios.post('/wallet/create/new/', data);
    return response.data;
  },

  importWallet: async (data: WalletSetupData & { passcode: string }) => {
    const response = await axios.post('/wallet/import/', data);
    return response.data;
  },

  // Get wallet details
  getWalletDetails: async (passcode: string) => {
    const response = await axios.get(`/wallet/details/?passcode=${passcode}`);
    return response.data;
  },

  // Check wallet status (requires passcode)
  getWalletStatus: async (passcode: string) => {
    const response = await axios.get(`/wallet/status/?passcode=${passcode}`);
    return response.data;
  },

  // Check wallet status (requires passcode)
  getWalletAccounts: async () => {
    const response = await axios.get(`/wallet/accounts/`);
    return response.data;
  },

  // Check wallet balances (requires passcode)
  getWalletBalances: async () => {
    const response = await axios.get(`/wallet/balances/`);
    return response.data;
  },

  // Refresh wallet balance for a specific account
  getWalletBalanceRefresh: async (account_id: string) => {
    const response = await axios.get(`/wallet/account/${account_id}/refresh/`);
    return response.data;
  },

  // Refresh all wallet balances (requires passcode)
  getWalletBalancesRefresh: async () => {
    const response = await axios.get(`/wallet/balances/refresh/`);
    return response.data;
  },

  // Get crypto prices
  getCryptoPrices: async () => {
    const response = await axios.get(`/crypto/prices/`);
    return response.data;
  },



  // Helper methods
  getStoredTokens: () => {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  hasPasscode: () => {
    return localStorage.getItem('hasPasscode') === 'true';
  }
};

export default authService;