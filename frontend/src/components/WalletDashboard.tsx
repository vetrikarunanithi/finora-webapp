import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wallet, Plus, QrCode, TrendingUp, TrendingDown, Camera,
  MapPin, Users, Gift, Zap, Crown, Target, Sparkles, ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWallet, topUpWallet, getSpendingByCategory, getDailySpending } from '../utils/walletManager';
import { analyzeSpendingDNA, saveSpendingDNAToHistory } from '../utils/spendingDNA';
import { formatCurrency } from '../mockData';
import { toast } from 'sonner@2.0.3';

interface WalletDashboardProps {
  onNavigate: (view: string) => void;
}

export function WalletDashboard({ onNavigate }: WalletDashboardProps) {
  const [wallet, setWallet] = useState(getWallet());
  const [spendingDNA, setSpendingDNA] = useState(analyzeSpendingDNA());
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(1000);

  useEffect(() => {
    const handleWalletUpdate = () => {
      setWallet(getWallet());
      setSpendingDNA(analyzeSpendingDNA());
    };

    window.addEventListener('walletUpdate', handleWalletUpdate);
    const interval = setInterval(handleWalletUpdate, 2000);

    // Generate and save DNA profile on component mount
    const profile = analyzeSpendingDNA();
    saveSpendingDNAToHistory(profile);

    return () => {
      window.removeEventListener('walletUpdate', handleWalletUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleTopUp = () => {
    topUpWallet(topUpAmount);
    toast.success(`₹${topUpAmount.toLocaleString('en-IN')} added to wallet!`, {
      description: 'Your wallet has been topped up successfully'
    });
    setShowTopUp(false);
  };

  // Prepare chart data
  const categoryData = Object.entries(getSpendingByCategory(30))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#FB923C', '#06B6D4'];

  const dailyData = getDailySpending(7).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    amount: d.amount
  }));

  const recentTransactions = wallet.transactions.slice(0, 5);
  const totalSpent = wallet.transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = wallet.transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Finora Wallet</h1>
            <p className="text-muted-foreground">Your AI-powered financial companion</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            {spendingDNA.badge} {spendingDNA.title.split(' ').slice(1).join(' ')}
          </Badge>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm mb-1">Available Balance</p>
                  <h2 className="text-4xl md:text-5xl mb-1">{formatCurrency(wallet.balance)}</h2>
                  <p className="text-white/60 text-sm">Last updated: {new Date(wallet.lastUpdated).toLocaleTimeString('en-IN')}</p>
                </div>
                <Wallet className="w-16 h-16 opacity-20" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setShowTopUp(!showTopUp)}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
                <Button
                  onClick={() => onNavigate('scan-pay')}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  variant="outline"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan & Pay
                </Button>
                <Button
                  onClick={() => onNavigate('bill-scanner')}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  variant="outline"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Bill
                </Button>
                <Button
                  onClick={() => onNavigate('split-bill')}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Split Bill
                </Button>
              </div>

              {showTopUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  <p className="text-sm mb-3">Quick Top-Up</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1000, 2000, 5000, 10000].map(amount => (
                      <Button
                        key={amount}
                        onClick={() => setTopUpAmount(amount)}
                        variant={topUpAmount === amount ? 'secondary' : 'outline'}
                        className={topUpAmount === amount ? 'bg-white text-blue-600' : 'bg-white/10 border-white/30'}
                        size="sm"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={handleTopUp} className="w-full bg-white text-blue-600 hover:bg-white/90">
                    Add ₹{topUpAmount.toLocaleString('en-IN')}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <h3 className="text-2xl text-red-600">{formatCurrency(totalSpent)}</h3>
                </div>
                <TrendingDown className="w-10 h-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                  <h3 className="text-2xl text-green-600">{formatCurrency(totalEarned)}</h3>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                  <h3 className="text-2xl">{wallet.transactions.length}</h3>
                </div>
                <Zap className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending DNA Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-2" style={{ borderColor: spendingDNA.color }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: spendingDNA.color }} />
                    Your Spending DNA
                  </CardTitle>
                  <CardDescription>Updated weekly based on your habits</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate('spending-dna')}>
                  View History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{spendingDNA.badge}</div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-1" style={{ color: spendingDNA.color }}>{spendingDNA.title}</h3>
                    <p className="text-muted-foreground mb-3">{spendingDNA.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {spendingDNA.traits.map((trait, idx) => (
                        <Badge key={idx} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Financial Health Score</span>
                        <span className="font-semibold">{spendingDNA.score}/100</span>
                      </div>
                      <Progress value={spendingDNA.score} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm mb-2">AI Insights:</p>
                  <ul className="space-y-2">
                    {spendingDNA.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: spendingDNA.color }} />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Last 30 days breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No spending data yet. Make your first transaction!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending Trend</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="amount" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No spending data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate('wallet-transactions')}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {txn.type === 'credit' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{txn.merchant}</p>
                        <p className="text-sm text-muted-foreground">{txn.category} • {new Date(txn.date).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">{txn.paymentMethod.toUpperCase()}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No transactions yet</p>
                <p className="text-sm">Start spending or top up your wallet!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('coupon-marketplace')}>
            <CardContent className="p-6 text-center">
              <Gift className="w-10 h-10 mx-auto mb-3 text-purple-600" />
              <h3 className="mb-1">Coupon Exchange</h3>
              <p className="text-sm text-muted-foreground">Buy & sell coupons</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('geo-map')}>
            <CardContent className="p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <h3 className="mb-1">Spending Map</h3>
              <p className="text-sm text-muted-foreground">See where you spend</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('what-if')}>
            <CardContent className="p-6 text-center">
              <Target className="w-10 h-10 mx-auto mb-3 text-green-600" />
              <h3 className="mb-1">What If?</h3>
              <p className="text-sm text-muted-foreground">Predict future spending</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('rewards')}>
            <CardContent className="p-6 text-center">
              <Crown className="w-10 h-10 mx-auto mb-3 text-yellow-600" />
              <h3 className="mb-1">Rewards</h3>
              <p className="text-sm text-muted-foreground">Earn & redeem points</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
