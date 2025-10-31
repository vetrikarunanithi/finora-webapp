import { motion } from "motion/react";
import { 
  TrendingUp, 
  PieChart, 
  Info,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Droplets
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const recommendations = [
  {
    id: 1,
    name: 'Vanguard Total Stock Market ETF',
    ticker: 'VTI',
    risk: 'Moderate',
    liquidity: 'High',
    returns: '9.2%',
    investment: 5000,
    description: 'Broad exposure to U.S. stock market',
    icon: '📈',
    riskColor: '#f59e0b',
    features: ['Low fees', 'Diversified', 'Tax efficient']
  },
  {
    id: 2,
    name: 'High-Yield Savings Account',
    ticker: 'HYSA',
    risk: 'Low',
    liquidity: 'Very High',
    returns: '4.5%',
    investment: 10000,
    description: 'Safe, liquid emergency fund option',
    icon: '🏦',
    riskColor: '#10b981',
    features: ['FDIC insured', 'No fees', 'Instant access']
  },
  {
    id: 3,
    name: 'S&P 500 Index Fund',
    ticker: 'SPY',
    risk: 'Moderate',
    liquidity: 'High',
    returns: '10.5%',
    investment: 7500,
    description: 'Track America\'s 500 largest companies',
    icon: '💼',
    riskColor: '#f59e0b',
    features: ['Proven track record', 'Low expense ratio', 'High liquidity']
  },
  {
    id: 4,
    name: 'Tech Growth Fund',
    ticker: 'QQQ',
    risk: 'High',
    liquidity: 'High',
    returns: '15.8%',
    investment: 3000,
    description: 'Focus on technology sector growth',
    icon: '🚀',
    riskColor: '#ef4444',
    features: ['High growth potential', 'Tech focus', 'Volatile']
  }
];

const portfolio = [
  { name: 'Stocks', value: 15000, color: '#6366f1' },
  { name: 'Bonds', value: 5000, color: '#10b981' },
  { name: 'ETFs', value: 8000, color: '#f59e0b' },
  { name: 'Cash', value: 4000, color: '#06b6d4' },
];

const performanceData = [
  { month: 'Apr', value: 28000 },
  { month: 'May', value: 29500 },
  { month: 'Jun', value: 28800 },
  { month: 'Jul', value: 31200 },
  { month: 'Aug', value: 30900 },
  { month: 'Sep', value: 32400 },
  { month: 'Oct', value: 32000 },
];

const holdings = [
  { name: 'Apple Inc.', ticker: 'AAPL', shares: 25, price: 178.50, change: 2.5 },
  { name: 'Microsoft Corp.', ticker: 'MSFT', shares: 15, price: 378.91, change: 1.8 },
  { name: 'Vanguard S&P 500', ticker: 'VOO', shares: 30, price: 425.30, change: -0.5 },
  { name: 'Tesla Inc.', ticker: 'TSLA', shares: 10, price: 242.80, change: -3.2 },
];

export function Investments() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1>Investments & Recommendations</h1>
          <p className="text-muted-foreground">AI-powered investment suggestions tailored for you</p>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recommendations">
              <Sparkles size={16} className="mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <PieChart size={16} className="mr-2" />
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="performance">
              <TrendingUp size={16} className="mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {/* AI Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={20} />
                        <h3>Personalized Recommendations</h3>
                      </div>
                      <p className="text-white/90 mb-4">
                        Based on your moderate risk profile and $1,800 monthly surplus, here are investment opportunities optimized for your goals.
                      </p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield size={16} />
                          <span>Risk-adjusted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} />
                          <span>Growth-focused</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                            {rec.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">{rec.name}</CardTitle>
                            <CardDescription>{rec.ticker}</CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: rec.riskColor,
                            color: rec.riskColor 
                          }}
                        >
                          {rec.risk} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Projected Returns</div>
                          <div className="text-lg text-emerald-600">{rec.returns}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                          <div className="text-sm">{rec.liquidity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Min. Investment</div>
                          <div className="text-sm">${rec.investment.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {rec.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* AI Insight */}
                      <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <div className="flex items-start gap-2">
                          <Sparkles className="text-indigo-600 flex-shrink-0 mt-0.5" size={14} />
                          <p className="text-xs text-muted-foreground">
                            {rec.risk === 'Low' 
                              ? 'Perfect for your emergency fund surplus. Safe and accessible.'
                              : rec.risk === 'High'
                              ? 'Allocate only 10-15% here due to volatility. Great for long-term growth.'
                              : 'Ideal core holding for balanced growth with manageable risk.'}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        Explore {rec.ticker}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Investment Strategy Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={20} />
                  Your Investment Strategy
                </CardTitle>
                <CardDescription>AI-generated allocation recommendation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-emerald-600" size={20} />
                      <span className="text-sm">Conservative (40%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Low-risk bonds and savings for stability
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="text-blue-600" size={20} />
                      <span className="text-sm">Moderate (40%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Balanced index funds and ETFs for growth
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="text-orange-600" size={20} />
                      <span className="text-sm">Aggressive (20%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      High-growth stocks for maximum returns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Holdings</CardTitle>
                    <CardDescription>Your investment portfolio breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {holdings.map((holding, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <TrendingUp size={20} className="text-indigo-600" />
                            </div>
                            <div>
                              <div>{holding.name}</div>
                              <p className="text-sm text-muted-foreground">
                                {holding.shares} shares @ ${holding.price}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>${(holding.shares * holding.price).toLocaleString()}</div>
                            <p className={`text-sm ${holding.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {holding.change >= 0 ? '+' : ''}{holding.change}%
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={portfolio}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {portfolio.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {portfolio.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ${item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                  <div className="text-2xl">$32,000</div>
                  <p className="text-xs text-emerald-600 mt-1">+14.2% all time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Monthly Return</div>
                  <div className="text-2xl text-emerald-600">+$600</div>
                  <p className="text-xs text-muted-foreground mt-1">+1.9% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">Total Invested</div>
                  <div className="text-2xl">$28,000</div>
                  <p className="text-xs text-muted-foreground mt-1">Over 18 months</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>6-month value trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
