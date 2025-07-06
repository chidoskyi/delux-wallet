# Wallet App User Flow Documentation for Frontend Integration

## Complete User Journey Flow

### 1. User Registration Flow
```
POST /api/v1/auth/register/
├── Input: { username, email, password, confirm_password, phone_number }
├── Success Response:
│   ├── tokens: { refresh, access }
│   ├── user: { id, username, email, phone_number }
│   └── next_steps: { requires_passcode_setup: true, setup_endpoint: "/api/v1/auth/passcode/setup/" }
└── Frontend Action: Redirect to Passcode Setup
```

### 2. Login Flow with Dynamic Routing
```
POST /api/v1/auth/login/
├── Input: { username, password }
├── Success Response includes next_steps based on user state:
│
├── Case A: No Passcode, No Wallet
│   └── next_steps: { requires_passcode_setup: true, setup_endpoint: "/api/v1/auth/passcode/setup/" }
│       └── Frontend: Redirect to Passcode Setup → Wallet Setup
│
├── Case B: Has Passcode, No Wallet  
│   └── next_steps: { setup_wallet: true, setup_endpoint: "/api/v1/wallet/setup/" }
│       └── Frontend: Redirect to Wallet Creation Options
│
├── Case C: Has Passcode, Has Wallet
│   └── next_steps: { requires_passcode_verification: true, verify_endpoint: "/api/v1/auth/passcode/verify/" }
│       └── Frontend: Show Passcode Input → Wallet Dashboard
│
└── Case D: No Passcode, Has Wallet (Edge case)
    └── next_steps: { requires_passcode_setup: true }
        └── Frontend: Force Passcode Setup → Passcode Verification → Wallet Dashboard
```

## 3. Passcode Management Flow

### Setup Passcode (Required for new users)
```
POST /api/v1/auth/passcode/setup/
├── Input: { passcode, confirm_passcode }
├── Success: { message: "Passcode setup successful", has_passcode: true }
└── Frontend: Redirect based on previous context (wallet setup or dashboard)
```

### Verify Passcode (Required for wallet access)
```
POST /api/v1/auth/passcode/verify/
├── Input: { passcode }
├── Success: { valid: true, locked: false }
├── Failed: { valid: false, locked: true, lock_remaining_time: 300 }
└── Frontend: On success, proceed to protected action
```

### Check Passcode Status
```
GET /api/v1/auth/passcode/status/
├── Response: { has_passcode: boolean, is_locked: boolean, lock_remaining_time: number }
└── Frontend: Use to determine UI state
```

### Change Passcode
```
POST /api/v1/auth/passcode/change/
├── Input: { current_passcode, new_passcode, confirm_new_passcode }
├── Success: { message: "Passcode changed successfully", has_passcode: true }
└── Frontend: Show success message
```

## 4. Wallet Creation Flow

### Initial Wallet Setup Options
```
GET /api/v1/wallet/setup/
├── Success: Shows available options
│   ├── create_new: { endpoint: "/api/v1/wallet/create/new/" }
│   └── import_existing: { endpoint: "/api/v1/wallet/import/" }
└── Frontend: Show Create/Import choice buttons
```

### Create New Wallet (Two-Step Process)

#### Step 1: Generate and Display Mnemonic
```
POST /api/v1/wallet/create/new/
├── Input: { } (empty for mnemonic generation)
├── Response:
│   ├── step: "verify_mnemonic"
│   ├── mnemonic: "word1 word2 ... word12"
│   ├── security_warning: { message, backup_tips[] }
│   └── verification: { word_positions: [3, 7, 11], message: "Verify these words" }
└── Frontend: Display mnemonic + verification form
```

#### Step 2: Verify and Create Wallet
```
POST /api/v1/wallet/create/new/
├── Input: {
│   mnemonic: "full mnemonic phrase",
│   wallet_name: "My Wallet",
│   wallet_password: "secure_password",
│   verification: {
│     word_positions: [3, 7, 11],
│     word_answers: ["word3", "word7", "word11"]
│   }
│ }
├── Success: { wallet: {...}, accounts_created: [...] }
└── Frontend: Show success + redirect to wallet dashboard
```

### Import Existing Wallet
```
POST /api/v1/wallet/import/
├── Input: {
│   mnemonic: "existing mnemonic phrase",
│   wallet_name: "Imported Wallet", 
│   wallet_password: "secure_password",
│   passcode: "1234" (for verification)
│ }
├── Success: { wallet: {...}, accounts_created: [...] }
└── Frontend: Show success + redirect to backup confirmation
```

## 5. Wallet Dashboard Flow

### Get Wallet Status (First call after login)
```
GET /api/v1/wallet/status/?passcode=1234
├── Success: { has_wallet: true, wallet_id, backup_completed, accounts_count }
├── No Wallet: { has_wallet: false }
└── Frontend: Determine which dashboard view to show
```

### Get Wallet Details (Main dashboard)
```
GET /api/v1/wallet/detail/?passcode=1234
├── Success: Full wallet details with accounts
├── Error: Passcode required
└── Frontend: Main wallet dashboard display
```

### Get Wallet Accounts
```
GET /api/v1/wallet/accounts/?passcode=1234
├── Success: { accounts: [...], total_accounts: 2 }
└── Frontend: Display account list with balances
```

## 6. Backup and Security Flow

### Confirm Wallet Backup
```
POST /api/v1/wallet/backup/
├── Input: {
│   passcode: "1234",
│   wallet_password: "secure_password",
│   backup_confirmations: ["wrote_down", "stored_safely", "understand_importance"]
│ }
├── Success: { backup_completed: true }
└── Frontend: Mark backup as complete, show success
```

### Reveal Mnemonic (Advanced users)
```
POST /api/v1/wallet/reveal-mnemonic/
├── Input: { password: "wallet_password" }
├── Success: { mnemonic: "...", warning: "Keep secure" }
└── Frontend: Show with strong security warnings
```

### Verify Wallet Password
```
POST /api/v1/wallet/verify-password/
├── Input: { password: "wallet_password" }
├── Success: { valid: true, message: "Password is correct" }
├── Failed: { valid: false, message: "Invalid password" }
└── Frontend: Use for password confirmation dialogs
```

## 7. Utility Endpoints

### Generate Mnemonic (Utility)
```
POST /api/v1/mnemonic/generate/
├── Input: { strength: 128 } (optional)
├── Success: { mnemonic: "...", word_count: 12 }
└── Frontend: Used in wallet creation flow
```

### Validate Mnemonic (Utility)
```
POST /api/v1/mnemonic/validate/
├── Input: { mnemonic: "word1 word2 ..." }
├── Success: { is_valid: true, word_count: 12 }
└── Frontend: Real-time validation during import
```

### Get Supported Currencies
```
GET /api/v1/currencies/
├── Success: [{ name: "Bitcoin", symbol: "BTC" }, ...]
└── Frontend: Display available cryptocurrencies
```

## 8. Authentication Token Management

### Obtain Token Pair
```
POST /api/v1/auth/token/
├── Input: { username, password }
├── Success: { access, refresh }
└── Frontend: Alternative to login endpoint
```

### Refresh Access Token
```
POST /api/v1/auth/refresh/
├── Input: { refresh }
├── Success: { access }
└── Frontend: Auto-refresh tokens before expiry
```

### Get User Profile
```
GET /api/v1/auth/profile/
├── Headers: Authorization: Bearer {access_token}
├── Success: { id, username, email, ... }
└── Frontend: Display user information
```

## Frontend State Management Requirements

### Required State Variables
```javascript
// Authentication State
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [tokens, setTokens] = useState({ access: null, refresh: null });

// User State  
const [user, setUser] = useState(null);
const [hasPasscode, setHasPasscode] = useState(false);
const [passcodeVerified, setPasscodeVerified] = useState(false);
const [passcodeLockedUntil, setPasscodeLockedUntil] = useState(null);

// Wallet State
const [hasWallet, setHasWallet] = useState(false);
const [wallet, setWallet] = useState(null);
const [accounts, setAccounts] = useState([]);
const [backupCompleted, setBackupCompleted] = useState(false);

// Flow State
const [currentStep, setCurrentStep] = useState('login'); 
// Possible values: 'login', 'register', 'passcode_setup', 'passcode_verify', 'wallet_setup', 'wallet_create', 'wallet_import', 'dashboard'
const [mnemonicData, setMnemonicData] = useState(null); // Temporary mnemonic storage
const [verificationData, setVerificationData] = useState(null); // Temporary verification data
```

### Route Protection Logic
```javascript
// Route guard logic based on user state
const getRequiredRoute = (user, hasPasscode, hasWallet, passcodeVerified) => {
  if (!user) return '/login';
  if (!hasPasscode) return '/setup-passcode';
  if (!hasWallet) return '/wallet-setup';
  if (!passcodeVerified) return '/verify-passcode';
  return '/dashboard';
};

// Check if route requires passcode verification
const requiresPasscodeVerification = (route) => {
  const protectedRoutes = ['/dashboard', '/wallet-detail', '/wallet-accounts', '/backup-wallet'];
  return protectedRoutes.includes(route);
};
```

### API Call Patterns

#### For GET requests with passcode
```javascript
const apiCallWithPasscode = async (endpoint, passcode) => {
  const response = await fetch(`${endpoint}?passcode=${passcode}`, {
    headers: {
      'Authorization': `Bearer ${tokens.access}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

#### For POST requests with passcode
```javascript
const apiCallWithPasscodeBody = async (endpoint, data, passcode) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokens.access}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...data, passcode })
  });
  return response.json();
};
```

## Error Handling Patterns

### Common Error Responses
```javascript
// Passcode required
{
  error: "Passcode verification required",
  requires_passcode: true,
  next_steps: { verify_endpoint: "/api/v1/auth/passcode/verify/" }
}

// Passcode setup required
{
  error: "Passcode setup required",
  next_steps: { requires_passcode_setup: true, setup_endpoint: "/api/v1/auth/passcode/setup/" }
}

// Account locked
{
  error: "Account temporarily locked",
  locked: true,
  lock_remaining_time: 300
}

// Validation errors
{
  error: "Validation failed",
  details: { field_name: ["Error message"] }
}
```

### Frontend Error Handling
```javascript
const handleApiError = (error) => {
  if (error.requires_passcode) {
    // Redirect to passcode verification
    navigate('/verify-passcode');
  } else if (error.requires_passcode_setup) {
    // Redirect to passcode setup
    navigate('/setup-passcode');
  } else if (error.locked) {
    // Show lockout timer
    setPasscodeLockedUntil(Date.now() + error.lock_remaining_time * 1000);
  } else {
    // Show general error message
    setErrorMessage(error.message || 'An error occurred');
  }
};
```

## Security Considerations

### Critical Frontend Notes
1. **Always include passcode in query params** for GET requests to protected endpoints
2. **Include passcode in request body** for POST requests to protected endpoints  
3. **Clear sensitive data** (like mnemonic) from state after use
4. **Handle passcode lockout** with countdown timers
5. **Implement auto-logout** on token expiration
6. **Show loading states** during crypto operations (they can be slow)
7. **Validate mnemonic input** in real-time during import
8. **Never store mnemonic in localStorage** - keep only in memory during creation flow
9. **Implement proper session timeout** for security
10. **Show security warnings** prominently during mnemonic display

### Data Flow Security
```javascript
// Example of secure mnemonic handling
const handleMnemonicGeneration = async () => {
  const response = await fetch('/api/v1/wallet/create/new/', { method: 'POST' });
  const data = await response.json();
  
  // Store temporarily for verification step only
  setMnemonicData(data);
  
  // Clear after wallet creation
  setTimeout(() => {
    setMnemonicData(null);
  }, 600000); // 10 minutes max
};
```

## UI/UX Flow Recommendations

### Step Indicators
```javascript
const steps = {
  registration: { order: 1, title: "Create Account" },
  passcode_setup: { order: 2, title: "Setup Security" },
  wallet_choice: { order: 3, title: "Wallet Setup" },
  wallet_creation: { order: 4, title: "Create Wallet" },
  backup_confirmation: { order: 5, title: "Secure Backup" },
  dashboard: { order: 6, title: "Wallet Ready" }
};
```

### Loading States
- Mnemonic generation: "Generating secure phrase..."
- Wallet creation: "Creating your wallet..."
- Account derivation: "Setting up accounts..."
- Encryption: "Securing your data..."

### Success Messages
- Registration: "Account created successfully!"
- Passcode setup: "Security passcode configured"
- Wallet creation: "Wallet created successfully"
- Backup confirmed: "Wallet backup secured"

This flow ensures your frontend can handle all user states and transitions smoothly while maintaining security requirements.