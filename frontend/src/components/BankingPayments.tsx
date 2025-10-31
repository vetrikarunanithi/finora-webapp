import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Download,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Send,
  Brain,
  Zap,
  ExternalLink,
  QrCode,
  Smartphone,
  History,
  Copy,
  TrendingUpDown,
  Sparkles,
  Users
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { fetchBankAccounts, categoryColors, type BankAccount, type Transaction } from '../utils/bankingAPI';
import { paymentGateways, initiateRazorpayPayment, type PaymentRequest } from '../utils/paymentGateway';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { getWallet } from '../utils/walletManager';
import { getOtherUsers, findUserByUPI, type MockUser } from '../mockUsers';

export function BankingPayments() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGateway, setSelectedGateway] = useState('razorpay');
  const [otherUsers, setOtherUsers] = useState<MockUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    recipient: '',
    upiId: '',
    category: 'Shopping',
    accountId: 'acc_1'
  });

  const loadTransactions = () => {
    let filteredTransactions = transactions;
    
    if (selectedAccount !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.accountId === selectedAccount);
    }
    
    if (filterCategory !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
    }
    
    if (filterType !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }
    
    return filteredTransactions;
  };

  const loadBankingData = async () => {
    setLoading(true);
    try {
      const storedAccounts = localStorage.getItem('bankAccounts');
      let accounts;
      
      if (storedAccounts) {
        accounts = JSON.parse(storedAccounts);
      } else {
        accounts = await fetchBankAccounts('user_123');
        localStorage.setItem('bankAccounts', JSON.stringify(accounts));
      }
      
      setBankAccounts(accounts);
      
      const storedTransactions = localStorage.getItem('bankTransactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        const initialTransactions: Transaction[] = [
          {
            id: 'txn_1',
            accountId: 'acc_1',
            type: 'debit',
            amount: 1250,
            balance: 125000,
            description: 'Swiggy Food Order',
            category: 'Food & Dining',
            date: '27-10-2025 20:15',
            upiId: 'swiggy@paytm',
            merchantName: 'Swiggy',
            referenceNumber: 'UPI329847561',
            mode: 'UPI'
          },
          {
            id: 'txn_2',
            accountId: 'acc_1',
            type: 'debit',
            amount: 2500,
            balance: 123750,
            description: 'Amazon Purchase',
            category: 'Shopping',
            date: '26-10-2025 15:30',
            upiId: 'amazon@icici',
            merchantName: 'Amazon',
            referenceNumber: 'UPI329847562',
            mode: 'UPI'
          },
          {
            id: 'txn_3',
            accountId: 'acc_1',
            type: 'credit',
            amount: 120000,
            balance: 121250,
            description: 'Salary Credit',
            category: 'Salary',
            date: '25-10-2025 09:00',
            merchantName: 'TechCorp India Pvt Ltd',
            referenceNumber: 'SAL202510',
            mode: 'NEFT'
          }
        ];
        setTransactions(initialTransactions);
        localStorage.setItem('bankTransactions', JSON.stringify(initialTransactions));
      }
    } catch (error) {
      console.error('Failed to load banking data:', error);
      toast.error('Failed to load banking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBankingData();
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Accounts synced successfully');
    }, 2000);
  };

  const handleLinkAccount = () => {
    toast.info('Account linking coming soon!');
  };

  const handlePayment = async () => {
    if (!paymentForm.amount || !paymentForm.recipient || !paymentForm.upiId) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const accountIndex = bankAccounts.findIndex(acc => acc.id === paymentForm.accountId);
    if (accountIndex === -1 || bankAccounts[accountIndex].balance < amount) {
      toast.error('Insufficient balance');
      return;
    }
    
    // Process payment
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      accountId: paymentForm.accountId,
      type: 'debit',
      amount: amount,
      balance: bankAccounts[accountIndex].balance - amount,
      description: `Payment to ${paymentForm.recipient}`,
      category: paymentForm.category,
      date: new Date().toLocaleString('en-IN', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ''),
      upiId: paymentForm.upiId,
      merchantName: paymentForm.recipient,
      referenceNumber: `UPI${Math.floor(Math.random() * 1000000000)}`,
      mode: 'UPI'
    };
    
    const updatedAccounts = [...bankAccounts];
    updatedAccounts[accountIndex].balance -= amount;
    setBankAccounts(updatedAccounts);
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    localStorage.setItem('bankTransactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    
    toast.success('Payment successful!', {
      description: `₹${amount.toLocaleString('en-IN')} sent to ${paymentForm.recipient}`
    });
    
    setPaymentDialogOpen(false);
    setPaymentForm({
      amount: '',
      recipient: '',
      upiId: '',
      category: 'Shopping',
      accountId: 'acc_1'
    });
  };

  // Calculate real-time monthly trend
  const calculateRealTimeMonthlyTrend = () => {
    const monthlyData: any[] = [];
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    
    // Base historical data
    const baseData = [
      { month: 'Apr', income: 120000, expenses: 92000 },
      { month: 'May', income: 120000, expenses: 95000 },
      { month: 'Jun', income: 125000, expenses: 98000 },
      { month: 'Jul', income: 120000, expenses: 88000 },
      { month: 'Aug', income: 122000, expenses: 91000 },
      { month: 'Sep', income: 120000, expenses: 94000 },
    ];
    
    // Calculate current month from real transactions
    const currentMonthIncome = transactions
      .filter(t => t.type === 'credit' && t.date.includes('10-2025'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'debit' && t.date.includes('10-2025'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    baseData.forEach(data => {
      monthlyData.push({
        ...data,
        savings: data.income - data.expenses
      });
    });
    
    // Add current month with real data
    monthlyData.push({
      month: 'Oct',
      income: currentMonthIncome || 120000,
      expenses: currentMonthExpenses || 3750,
      savings: (currentMonthIncome || 120000) - (currentMonthExpenses || 3750)
    });
    
    return monthlyData;
  };

  // Enhanced AI Budget Forecast with Specific Categories
  const generateEnhancedAIForecast = () => {
    // Define target categories with icons and colors
    const targetCategories = [
      { id: 'Groceries', name: 'Groceries', icon: '🛒', color: '#10B981', avgMonthly: 8000 },
      { id: 'Transportation', name: 'Transportation', icon: '🚗', color: '#F59E0B', avgMonthly: 5000 },
      { id: 'Entertainment', name: 'Entertainment', icon: '🎬', color: '#8B5CF6', avgMonthly: 3000 },
      { id: 'Dining Out', name: 'Dining Out', icon: '🍽️', color: '#EF4444', avgMonthly: 6000 },
      { id: 'Shopping', name: 'Shopping', icon: '🛍️', color: '#3B82F6', avgMonthly: 7000 },
      { id: 'Bills and Utilities', name: 'Bills and Utilities', icon: '⚡', color: '#06B6D4', avgMonthly: 4500 }
    ];

    // Get all debit transactions
    const allDebitTransactions = transactions.filter(t => t.type === 'debit');
    
    // Map actual transactions to target categories (with fuzzy matching)
    const categoryMapping: Record<string, string> = {
      'Food & Dining': 'Dining Out',
      'Food': 'Dining Out',
      'Restaurant': 'Dining Out',
      'Groceries': 'Groceries',
      'Supermarket': 'Groceries',
      'Transportation': 'Transportation',
      'Travel': 'Transportation',
      'Fuel': 'Transportation',
      'Entertainment': 'Entertainment',
      'Movies': 'Entertainment',
      'Gaming': 'Entertainment',
      'Shopping': 'Shopping',
      'Utilities': 'Bills and Utilities',
      'Bills': 'Bills and Utilities',
      'Electricity': 'Bills and Utilities',
      'Internet': 'Bills and Utilities',
      'Phone': 'Bills and Utilities'
    };

    // Calculate actual spending per target category
    const actualSpending: Record<string, number> = {};
    targetCategories.forEach(cat => {
      actualSpending[cat.id] = 0;
    });

    allDebitTransactions.forEach(txn => {
      const mappedCategory = categoryMapping[txn.category] || txn.category;
      if (actualSpending[mappedCategory] !== undefined) {
        actualSpending[mappedCategory] += txn.amount;
      }
    });

    // Generate predictions for each target category
    const categoryPredictions = targetCategories.map(cat => {
      const current = actualSpending[cat.id] || 0;
      
      // If no actual data, use average with slight variation
      const baseAmount = current > 0 ? current : cat.avgMonthly;
      
      // Calculate predicted based on trend
      let predicted;
      if (current === 0) {
        // No data - use average
        predicted = cat.avgMonthly;
      } else if (current < cat.avgMonthly * 0.7) {
        // Currently low - predict slight increase
        predicted = Math.round(current * 1.15);
      } else if (current > cat.avgMonthly * 1.3) {
        // Currently high - predict slight decrease
        predicted = Math.round(current * 0.95);
      } else {
        // Normal range - predict 10% increase
        predicted = Math.round(current * 1.1);
      }

      // Determine trend
      let trend: 'high' | 'medium' | 'low';
      if (baseAmount > 7000) trend = 'high';
      else if (baseAmount > 4000) trend = 'medium';
      else trend = 'low';

      return {
        category: cat.name,
        categoryId: cat.id,
        icon: cat.icon,
        color: cat.color,
        current: baseAmount,
        predicted,
        trend,
        difference: predicted - baseAmount,
        percentChange: baseAmount > 0 ? ((predicted - baseAmount) / baseAmount * 100) : 0
      };
    });

    // Calculate totals
    const totalCurrentSpending = categoryPredictions.reduce((sum, cat) => sum + cat.current, 0);
    const totalPredictedSpending = categoryPredictions.reduce((sum, cat) => sum + cat.predicted, 0);
    const avgMonthlyIncome = 120000;

    // Find top spending category
    const topSpending = [...categoryPredictions].sort((a, b) => b.current - a.current)[0];
    
    // Find category with highest increase
    const highestIncrease = [...categoryPredictions].sort((a, b) => b.difference - a.difference)[0];

    // Generate smart recommendations based on actual data
    const recommendations = [];
    
    // Recommendation 1: Reduce top spending category
    if (topSpending && topSpending.current > 0) {
      const savingsAmount = Math.round(topSpending.current * 0.15);
      recommendations.push(
        `Reduce ${topSpending.category} ${topSpending.icon} by 15% to save ₹${savingsAmount.toLocaleString('en-IN')}/month`
      );
    }

    // Recommendation 2: Focus on category with highest predicted increase
    if (highestIncrease && highestIncrease.difference > 0) {
      recommendations.push(
        `Watch out! ${highestIncrease.category} ${highestIncrease.icon} may increase by ₹${highestIncrease.difference.toLocaleString('en-IN')} next month`
      );
    }

    // Recommendation 3: Bills optimization
    const billsCategory = categoryPredictions.find(c => c.categoryId === 'Bills and Utilities');
    if (billsCategory && billsCategory.current > 4000) {
      recommendations.push(
        'Review subscriptions and utilities - potential savings of ₹500-1,000/month'
      );
    } else {
      recommendations.push(
        'Set up automatic SIP for ₹5,000/month for wealth building'
      );
    }

    // Recommendation 4: Emergency fund
    const monthlyExpense = totalPredictedSpending;
    const emergencyFundTarget = monthlyExpense * 3;
    recommendations.push(
      `Emergency fund goal: ₹${emergencyFundTarget.toLocaleString('en-IN')} (3 months expenses)`
    );

    // Recommendation 5: Category-specific tip
    const groceriesCategory = categoryPredictions.find(c => c.categoryId === 'Groceries');
    const diningCategory = categoryPredictions.find(c => c.categoryId === 'Dining Out');
    
    if (diningCategory && groceriesCategory && diningCategory.current > groceriesCategory.current * 0.5) {
      recommendations.push(
        'Dining Out costs are high - cooking at home 2 more days/week can save ₹2,000/month'
      );
    } else if (topSpending?.categoryId === 'Shopping') {
      recommendations.push(
        'Follow the 30-day rule: wait 30 days before non-essential purchases'
      );
    }

    return {
      avgMonthlyExpense: totalCurrentSpending,
      avgMonthlyIncome,
      projectedSavings: avgMonthlyIncome - totalPredictedSpending,
      savingsRate: totalCurrentSpending > 0 
        ? ((avgMonthlyIncome - totalCurrentSpending) / avgMonthlyIncome) * 100 
        : 70,
      forecastNextMonth: totalPredictedSpending,
      categoryPredictions,
      topSpending,
      highestIncrease,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      categoryBreakdown: {
        totalCurrent: totalCurrentSpending,
        totalPredicted: totalPredictedSpending,
        difference: totalPredictedSpending - totalCurrentSpending,
        percentChange: totalCurrentSpending > 0 
          ? ((totalPredictedSpending - totalCurrentSpending) / totalCurrentSpending * 100) 
          : 0
      }
    };
  };

  // Load users and banking data on mount
  useEffect(() => {
    loadBankingData();
    
    // Load other users for P2P payments
    const currentMobile = localStorage.getItem('userMobile') || '';
    const users = getOtherUsers(currentMobile);
    setOtherUsers(users);
  }, []);

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const allTransactions = loadTransactions();
  const totalIncome = allTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = allTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const categories = Array.from(new Set(allTransactions.map(t => t.category)));
  const monthlyTrend = calculateRealTimeMonthlyTrend();
  const aiForecast = generateEnhancedAIForecast();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Banking & Payments
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Unified banking, payments & AI-powered financial insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={syncing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button onClick={handleLinkAccount} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Link Account
            </Button>
          </div>
        </div>

        {/* Compliance Notice */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Secure & Compliant:</strong> Your banking data is protected with AES-256 encryption and accessed via RBI-AA framework compliant APIs with full consent management.
              </p>
            </div>
          </div>
        </Card>

        {/* Finora Wallet Integration */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Wallet className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-purple-900 dark:text-purple-100 font-semibold mb-1">
                  Finora Wallet Available
                </p>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Access your virtual wallet with AI-powered spending insights, QR payments, and smart bill splitting.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-100"
              onClick={() => window.location.href = '#wallet'}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Wallet
            </Button>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">
              <TrendingUpDown className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Send className="w-4 h-4 mr-2" />
              Send Money
            </TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <History className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet className="w-8 h-8 opacity-80" />
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-blue-100 mb-1">Total Balance</p>
                  <h2>₹{totalBalance.toLocaleString('en-IN')}</h2>
                  <p className="text-blue-100 text-sm mt-2">
                    Across {bankAccounts.length} accounts
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-6 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
                  <h3 className="text-green-600">₹{totalIncome.toLocaleString('en-IN')}</h3>
                  <p className="text-gray-500 text-sm mt-2">This month</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-6 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="w-8 h-8 text-orange-600" />
                    <ArrowUpRight className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Total Expense</p>
                  <h3 className="text-orange-600">₹{totalExpense.toLocaleString('en-IN')}</h3>
                  <p className="text-gray-500 text-sm mt-2">This month</p>
                </Card>
              </motion.div>
            </div>

            {/* Real-Time Monthly Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Real-Time Monthly Trend Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Live updates from your actual transactions
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Live Data
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#F59E0B" fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Bank Accounts */}
            <Card className="p-6">
              <h3 className="mb-4">Linked Bank Accounts</h3>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{account.bankName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {account.accountNumber} • {account.accountType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{account.balance.toLocaleString('en-IN')}</p>
                      <Badge variant="outline" className="mt-1">
                        {account.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* Payment Gateways */}
            <Card className="p-6">
              <h3 className="mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentGateways.map((gateway) => (
                  <button
                    key={gateway.id}
                    onClick={() => setSelectedGateway(gateway.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGateway === gateway.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{gateway.icon}</div>
                    <p className="text-sm">{gateway.name}</p>
                    {selectedGateway === gateway.id && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Payment Form */}
            <Card className="p-6">
              <h3 className="mb-6">Send Money via UPI</h3>
              
              <div className="space-y-4">
                {/* Quick Send to Users */}
                {otherUsers.length > 0 && (
                  <div>
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Quick Send to Users
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {otherUsers.slice(0, 8).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setSelectedUser(user);
                            setPaymentForm({
                              ...paymentForm,
                              recipient: user.name,
                              upiId: user.upiId
                            });
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            selectedUser?.id === user.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{user.avatar}</div>
                          <p className="text-xs font-medium truncate">{user.name.split(' ')[0]}</p>
                          {selectedUser?.id === user.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="pay-account">From Account</Label>
                  <Select
                    value={paymentForm.accountId}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, accountId: value })}
                  >
                    <SelectTrigger id="pay-account" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.bankName} - ₹{acc.balance.toLocaleString('en-IN')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="upi-id">Recipient UPI ID</Label>
                  <Input
                    id="upi-id"
                    placeholder="example@paytm"
                    value={paymentForm.upiId}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, upiId: e.target.value });
                      // Auto-fill if UPI ID matches a user
                      const user = findUserByUPI(e.target.value);
                      if (user) {
                        setSelectedUser(user);
                        setPaymentForm({
                          ...paymentForm,
                          upiId: e.target.value,
                          recipient: user.name
                        });
                      }
                    }}
                    className="mt-2"
                  />
                  {selectedUser && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Sending to {selectedUser.avatar} {selectedUser.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input
                    id="recipient"
                    placeholder="John Doe"
                    value={paymentForm.recipient}
                    onChange={(e) => setPaymentForm({ ...paymentForm, recipient: e.target.value })}
                    className="mt-2"
                    readOnly={!!selectedUser}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={paymentForm.category}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, category: value })}
                  >
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  onClick={handlePayment}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send ₹{paymentForm.amount || '0'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            {/* Enhanced AI Budget Forecast */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-purple-900 dark:text-purple-100">
                    Enhanced AI Budget Forecast
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Predictive analytics across 6 key spending categories
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Expenses</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{aiForecast.forecastNextMonth.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {aiForecast.categoryBreakdown?.percentChange > 0 ? '+' : ''}
                    {aiForecast.categoryBreakdown?.percentChange.toFixed(1)}% from current
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projected Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{Math.round(aiForecast.projectedSavings).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{aiForecast.savingsRate.toFixed(1)}% rate</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top Spending</p>
                  <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <span>{aiForecast.topSpending?.icon}</span>
                    {aiForecast.topSpending?.category || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{(aiForecast.topSpending?.current || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Highest Increase</p>
                  <p className="text-xl font-bold text-purple-600 flex items-center gap-1">
                    <span>{aiForecast.highestIncrease?.icon}</span>
                    {aiForecast.highestIncrease?.category || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +₹{(aiForecast.highestIncrease?.difference || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Category-Wise Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-2 px-2">Category</th>
                        <th className="text-right py-2 px-2">Current</th>
                        <th className="text-right py-2 px-2">Predicted</th>
                        <th className="text-right py-2 px-2">Change</th>
                        <th className="text-center py-2 px-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiForecast.categoryPredictions.map((cat, idx) => (
                        <motion.tr
                          key={cat.categoryId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{cat.icon}</span>
                              <span className="font-medium">{cat.category}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2">
                            ₹{cat.current.toLocaleString('en-IN')}
                          </td>
                          <td className="text-right py-3 px-2 font-semibold" style={{ color: cat.color }}>
                            ₹{cat.predicted.toLocaleString('en-IN')}
                          </td>
                          <td className="text-right py-3 px-2">
                            <span className={cat.difference >= 0 ? 'text-orange-600' : 'text-green-600'}>
                              {cat.difference >= 0 ? '+' : ''}₹{cat.difference.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <Badge
                              className={
                                cat.trend === 'high'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : cat.trend === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }
                            >
                              {cat.trend}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Predictions Chart */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Visual Comparison: Current vs Predicted
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiForecast.categoryPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Bar dataKey="current" fill="#8B5CF6" name="Current Spending" />
                    <Bar dataKey="predicted" fill="#3B82F6" name="Predicted Spending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Recommendations */}
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-3 text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  AI-Powered Recommendations
                </h4>
                <ul className="space-y-3">
                  {aiForecast.recommendations.map((rec, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-3 p-3 bg-white dark:bg-yellow-900 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span>{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Transaction History</h3>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                {allTransactions.slice(0, 10).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'
                      }`}>
                        {txn.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {txn.date} • {txn.mode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        txn.type === 'credit' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {txn.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
