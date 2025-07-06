import { toast } from 'react-toastify';

// Toast notification utilities
export const showToast = {
  // Success notifications
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Error notifications
  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Info notifications
  info: (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Warning notifications
  warning: (message: string) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Loading notifications (for async operations)
  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    });
  },

  // Update loading toast to success/error
  update: (toastId: string | number, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: type === 'error' ? 5000 : 3000,
    });
  },

  // Dismiss specific toast
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

// Specific toast messages for different actions
export const toastMessages = {
  // Authentication
  login: {
    success: "Login successful!",
    error: "Login failed. Please check your credentials.",
  },
  register: {
    success: "Registration successful!",
    error: "Registration failed. Please try again.",
  },
  logout: {
    success: "Logged out successfully.",
  },

  // Passcode
  passcode: {
    setup: {
      success: "Passcode set up successfully!",
      error: "Failed to set up passcode. Please try again.",
    },
    set: {
      success: "Passcode set successfully!",
      error: "Failed to set passcode. Please try again.",
    },
    confirm: {
      success: "Passcode confirmed successfully!",
      error: "Passcodes do not match. Please try again.",
    },
    verify: {
      success: "Passcode verified successfully!",
      error: "Invalid passcode. Please try again.",
      locked: "Account temporarily locked. Please wait before trying again.",
    },
    change: {
      success: "Passcode changed successfully!",
      error: "Failed to change passcode. Please try again.",
    },
  },

  // Wallet
  wallet: {
    create: {
      success: "Wallet created successfully!",
      error: "Failed to create wallet. Please try again.",
    },
    import: {
      success: "Wallet imported successfully!",
      error: "Failed to import wallet. Please check your mnemonic phrase.",
    },
    backup: {
      success: "Wallet backup confirmed!",
      error: "Failed to confirm backup. Please try again.",
    },
  },

  // General
  general: {
    networkError: "Network error. Please check your connection.",
    serverError: "Server error. Please try again later.",
    validationError: "Please check your input and try again.",
    unauthorized: "You are not authorized to perform this action.",
  },
};

export default showToast; 