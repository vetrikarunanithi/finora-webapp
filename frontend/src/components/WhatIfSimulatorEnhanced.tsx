import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Sparkles,
  ShoppingCart,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts';
import { getWallet, getSpendingByCategory } from '../utils/walletManager';
import { formatCurrency } from '../mockData';

interface WhatIfSimulatorEnhancedProps {
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Groceries', name: 'Groceries', icon: ShoppingCart, color: '#10B981', avgMonthly: 8000 },
  { id: 'Transportation', name: 'Transportation', icon: Car, color: '#F59E0B', avgMonthly: 5000 },
  { id: 'Entertainment', name: 'Entertainment', icon: Film, color: '#8B5CF6', avgMonthly: 3000 },
  { id: 'Dining Out', name: 'Dining Out', icon: Utensils, color: '#EF4444', avgMonthly: 6000 },
  { id: 'Shopping', name: 'Shopping', icon: ShoppingBag, color: '#3B82F6', avgMonthly: 7000 }
];

export function WhatIfSimulatorEnhanced({ onClose }: WhatIfSimulatorEnhancedProps) {
  const wallet = getWallet();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [reductionPercent, setReductionPercent] = useState([20]);
  const [timeframe, setTimeframe] = useState(12); // months

  const currentBalance = wallet.balance;
  const categorySpending = getSpendingByCategory(30);

  // Calculate savings scenarios
  const calculateScenario = (category: typeof CATEGORIES[0], reduction: number) => {
    const monthlySpending = category.avgMonthly;
    const monthlySavings = (monthlySpending * reduction) / 100;
    const annualSavings = monthlySavings * 12;
    
    const projectionData = [];
    let cumulativeSavings = 0;
    
    for (let month = 0; month <= timeframe; month++) {
      cumulativeSavings = monthlySavings * month;
      projectionData.push({
        month: month === 0 ? 'Now' : `M${month}`,
        balance: currentBalance + cumulativeSavings,
        savings: cumulativeSavings,
        original: currentBalance
      });
    }
    
    return {
      monthlySpending,
      monthlySavings,
      annualSavings,
      projectionData,
      percentageSaved: reduction,
      newMonthlySpending: monthlySpending - monthlySavings
    };
  };

  const scenario = calculateScenario(selectedCategory, reductionPercent[0]);

  // Impact analysis
  const getImpactLevel = (reduction: number) => {
    if (reduction >= 30) return { level: 'high', color: 'green', label: 'High Impact' };
    if (reduction >= 15) return { level: 'medium', color: 'blue', label: 'Medium Impact' };
    return { level: 'low', color: 'orange', label: 'Low Impact' };
  };

  const impact = getImpactLevel(reductionPercent[0]);

  // AI Recommendations
  const getRecommendations = (category: string, reduction: number) => {
    const baseRecommendations = {
      Groceries: [
        'Buy in bulk for staples like rice, dal, and cooking oil',
        'Use grocery apps for cashback and discounts',
        'Plan meals weekly to avoid food waste',
        'Choose local vegetables over imported ones',
        'Cook at home instead of ordering in'
      ],
      Transportation: [
        'Use public transport or carpool for daily commute',
        'Combine multiple errands into single trips',
        'Consider bike or walk for short distances',
        'Use metro/bus passes for regular commuters',
        'Maintain vehicle regularly to save on fuel'
      ],
      Entertainment: [
        'Use family subscription plans for OTT platforms',
        'Look for student/group discounts for movies',
        'Explore free events in your city',
        'Host game nights at home instead of going out',
        'Use library for books and audiobooks'
      ],
      'Dining Out': [
        'Cook favorite restaurant meals at home',
        'Use dining apps for discounts and offers',
        'Limit dining out to special occasions',
        'Pack lunch for work instead of eating out',
        'Try meal prepping on weekends'
      ],
      Shopping: [
        'Follow 30-day rule before non-essential purchases',
        'Use price comparison apps before buying',
        'Shop during sale seasons (end of season sales)',
        'Sell or donate items you no longer use',
        'Make a shopping list and stick to it'
      ]
    };

    return baseRecommendations[category as keyof typeof baseRecommendations] || [];
  };

  const recommendations = getRecommendations(selectedCategory.id, reductionPercent[0]);

  // Alternative scenarios comparison
  const comparisonScenarios = [10, 20, 30, 40].map(percent => ({
    percent,
    savings: calculateScenario(selectedCategory, percent).monthlySavings,
    annual: calculateScenario(selectedCategory, percent).annualSavings
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">What-If Financial Simulator</h2>
                <p className="text-purple-100 text-sm">Predict your savings with smart spending cuts</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Select Category to Optimize
              </CardTitle>
              <CardDescription>
                Choose a spending category and see how reducing it impacts your savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedCategory.id === cat.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: cat.color }} />
                      <p className="text-sm font-medium text-center">{cat.name}</p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        ₹{cat.avgMonthly.toLocaleString('en-IN')}/mo
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reduction Slider */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                  Reduce {selectedCategory.name} by
                </span>
                <Badge className="text-lg px-4 py-1" style={{ backgroundColor: impact.color }}>
                  {reductionPercent[0]}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Slider
                  value={reductionPercent}
                  onValueChange={setReductionPercent}
                  min={0}
                  max={50}
                  step={5}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{scenario.monthlySavings.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Annual Savings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{scenario.annualSavings.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">New Monthly Cost</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{scenario.newMonthlySpending.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Impact Level</p>
                  <p className="text-lg font-bold" style={{ color: impact.color }}>
                    {impact.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="projection" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projection">
                <TrendingUp className="w-4 h-4 mr-2" />
                Projection
              </TabsTrigger>
              <TabsTrigger value="comparison">
                <ArrowRight className="w-4 h-4 mr-2" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Sparkles className="w-4 h-4 mr-2" />
                Tips
              </TabsTrigger>
            </TabsList>

            {/* Projection Tab */}
            <TabsContent value="projection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Projection ({timeframe} Months)</CardTitle>
                  <CardDescription>
                    See how your balance grows with consistent savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label>Projection Timeframe: {timeframe} months</Label>
                    <Slider
                      value={[timeframe]}
                      onValueChange={([val]) => setTimeframe(val)}
                      min={3}
                      max={24}
                      step={3}
                      className="mt-2"
                    />
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={scenario.projectionData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="original"
                        stroke="#94a3b8"
                        fillOpacity={1}
                        fill="url(#colorOriginal)"
                        name="Without Savings"
                        strokeDasharray="5 5"
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                        name="With Savings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          Projected Result in {timeframe} Months
                        </p>
                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                          By reducing {selectedCategory.name} spending by {reductionPercent[0]}%, 
                          you'll save <strong>₹{(scenario.monthlySavings * timeframe).toLocaleString('en-IN')}</strong> and 
                          have a balance of <strong>₹{scenario.projectionData[timeframe].balance.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compare Different Reduction Levels</CardTitle>
                  <CardDescription>
                    See how different reduction percentages impact your savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonScenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="percent"
                        label={{ value: 'Reduction %', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        label={{ value: 'Annual Savings (₹)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="annual"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', r: 6 }}
                        name="Annual Savings"
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {comparisonScenarios.map((scenario) => (
                      <div
                        key={scenario.percent}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          scenario.percent === reductionPercent[0]
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {scenario.percent}% Reduction
                        </p>
                        <p className="text-lg font-bold text-purple-600 mt-1">
                          ₹{scenario.annual.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">per year</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    AI-Powered Money Saving Tips for {selectedCategory.name}
                  </CardTitle>
                  <CardDescription>
                    Actionable recommendations to reduce your {selectedCategory.name} expenses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                    </motion.div>
                  ))}

                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                          Pro Tip
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                          Start with small reductions (5-10%) and gradually increase as you adapt. 
                          Sudden large cuts are harder to maintain long-term.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => {
                // Could save the scenario or create a budget goal
                onClose();
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply This Plan
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
