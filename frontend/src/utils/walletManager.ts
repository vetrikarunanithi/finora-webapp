// Virtual Wallet Manager for Finora
export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'success' | 'pending' | 'failed';
  location?: { lat: number; lng: number; address: string };
  mood?: 'happy' | 'neutral' | 'stressed' | 'excited';
  paymentMethod: 'wallet' | 'qr' | 'upi' | 'card';
  merchantLogo?: string;
}

export interface WalletData {
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
}

const WALLET_KEY = 'finora_wallet';
const INITIAL_BALANCE = 10000;

// Initialize wallet
export const initializeWallet = (): WalletData => {
  const stored = localStorage.getItem(WALLET_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const initialWallet: WalletData = {
    balance: INITIAL_BALANCE,
    transactions: [],
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(WALLET_KEY, JSON.stringify(initialWallet));
  return initialWallet;
};

// Get current wallet
export const getWallet = (): WalletData => {
  const stored = localStorage.getItem(WALLET_KEY);
  return stored ? JSON.parse(stored) : initializeWallet();
};

// Update wallet
const updateWallet = (wallet: WalletData): void => {
  wallet.lastUpdated = new Date().toISOString();
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  window.dispatchEvent(new Event('walletUpdate'));
};

// Add transaction
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'status'>): Transaction => {
  const wallet = getWallet();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    status: 'success'
  };
  
  // Update balance
  if (transaction.type === 'debit') {
    wallet.balance -= transaction.amount;
  } else {
    wallet.balance += transaction.amount;
  }
  
  wallet.transactions.unshift(newTransaction);
  updateWallet(wallet);
  
  return newTransaction;
};

// Top up wallet
export const topUpWallet = (amount: number): void => {
  addTransaction({
    merchant: 'Wallet Top-Up',
    category: 'Wallet',
    amount,
    type: 'credit',
    paymentMethod: 'upi'
  });
};

// Make payment
export const makePayment = (
  merchant: string,
  amount: number,
  category?: string,
  location?: { lat: number; lng: number; address: string },
  mood?: 'happy' | 'neutral' | 'stressed' | 'excited',
  paymentMethod: 'wallet' | 'qr' | 'upi' | 'card' = 'wallet'
): Transaction | null => {
  const wallet = getWallet();
  
  if (wallet.balance < amount) {
    return null; // Insufficient balance
  }
  
  // Auto-categorize if not provided
  const finalCategory = category || autoCategorize(merchant);
  
  return addTransaction({
    merchant,
    category: finalCategory,
    amount,
    type: 'debit',
    location,
    mood,
    paymentMethod
  });
};

// Auto-categorize merchant
const autoCategorize = (merchant: string): string => {
  const merchantLower = merchant.toLowerCase();
  
  if (merchantLower.includes('cafe') || merchantLower.includes('restaurant') || 
      merchantLower.includes('zomato') || merchantLower.includes('swiggy') ||
      merchantLower.includes('food') || merchantLower.includes('pizza')) {
    return 'Food & Drinks';
  }
  
  if (merchantLower.includes('uber') || merchantLower.includes('ola') || 
      merchantLower.includes('rapido') || merchantLower.includes('metro') ||
      merchantLower.includes('cab') || merchantLower.includes('auto')) {
    return 'Travel';
  }
  
  if (merchantLower.includes('flipkart') || merchantLower.includes('amazon') || 
      merchantLower.includes('myntra') || merchantLower.includes('ajio') ||
      merchantLower.includes('shop') || merchantLower.includes('store')) {
    return 'Shopping';
  }
  
  if (merchantLower.includes('movie') || merchantLower.includes('bookmyshow') || 
      merchantLower.includes('netflix') || merchantLower.includes('prime') ||
      merchantLower.includes('spotify') || merchantLower.includes('entertainment')) {
    return 'Entertainment';
  }
  
  if (merchantLower.includes('electricity') || merchantLower.includes('water') || 
      merchantLower.includes('gas') || merchantLower.includes('bill') ||
      merchantLower.includes('recharge') || merchantLower.includes('broadband')) {
    return 'Bills & Utilities';
  }
  
  if (merchantLower.includes('medical') || merchantLower.includes('pharmacy') || 
      merchantLower.includes('hospital') || merchantLower.includes('doctor') ||
      merchantLower.includes('health')) {
    return 'Healthcare';
  }
  
  return 'Others';
};

// Get spending by category
export const getSpendingByCategory = (days: number = 30): { [key: string]: number } => {
  const wallet = getWallet();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const categorySpending: { [key: string]: number } = {};
  
  wallet.transactions
    .filter(t => t.type === 'debit' && new Date(t.date) >= cutoffDate)
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
  
  return categorySpending;
};

// Get daily spending trend
export const getDailySpending = (days: number = 30): { date: string; amount: number }[] => {
  const wallet = getWallet();
  const result: { [key: string]: number } = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result[dateStr] = 0;
  }
  
  wallet.transactions
    .filter(t => t.type === 'debit')
    .forEach(t => {
      const dateStr = new Date(t.date).toISOString().split('T')[0];
      if (result[dateStr] !== undefined) {
        result[dateStr] += t.amount;
      }
    });
  
  return Object.entries(result)
    .map(([date, amount]) => ({ date, amount }))
    .reverse();
};

// Get location-based spending
export const getLocationSpending = (): { location: string; amount: number; count: number }[] => {
  const wallet = getWallet();
  const locationMap: { [key: string]: { amount: number; count: number } } = {};
  
  wallet.transactions
    .filter(t => t.type === 'debit' && t.location)
    .forEach(t => {
      const loc = t.location!.address;
      if (!locationMap[loc]) {
        locationMap[loc] = { amount: 0, count: 0 };
      }
      locationMap[loc].amount += t.amount;
      locationMap[loc].count += 1;
    });
  
  return Object.entries(locationMap)
    .map(([location, data]) => ({ location, ...data }))
    .sort((a, b) => b.amount - a.amount);
};

// Reset wallet (for demo)
export const resetWallet = (): void => {
  localStorage.removeItem(WALLET_KEY);
  initializeWallet();
  window.dispatchEvent(new Event('walletUpdate'));
};
