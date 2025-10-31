import { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../mockData";

const budgets = [
  { id: 1, category: 'Groceries', spent: 6800, budget: 8000, icon: '🛒', color: '#10b981', predicted: 7500 },
  { id: 2, category: 'Transportation', spent: 2200, budget: 3000, icon: '🚗', color: '#06b6d4', predicted: 2800 },
  { id: 3, category: 'Entertainment', spent: 1850, budget: 2000, icon: '🎬', color: '#8b5cf6', predicted: 1950 },
  { id: 4, category: 'Dining Out', spent: 3400, budget: 4000, icon: '🍽️', color: '#f59e0b', predicted: 4200 },
  { id: 5, category: 'Shopping', spent: 5200, budget: 5000, icon: '🛍️', color: '#ef4444', predicted: 5500 },
  { id: 6, category: 'Bills & Utilities', spent: 4500, budget: 5000, icon: '💡', color: '#6366f1', predicted: 4600 },
];

const forecastData = [
  { day: 'Mon', historical: 1200, predicted: 1250 },
  { day: 'Tue', historical: 1400, predicted: 1450 },
  { day: 'Wed', historical: 1100, predicted: 1150 },
  { day: 'Thu', historical: 1600, predicted: 1650 },
  { day: 'Fri', historical: 1800, predicted: 1900 },
  { day: 'Sat', historical: 2100, predicted: 2200 },
  { day: 'Sun', historical: 1500, predicted: 1600 },
];

export function Budgets() {
  const [selectedBudget, setSelectedBudget] = useState(budgets[0]);
  const [whatIfAmount, setWhatIfAmount] = useState([selectedBudget.budget]);
  const [budgetAlerts, setBudgetAlerts] = useState<string[]>([]);

  const getPercentage = (spent: number, budget: number) => (spent / budget) * 100;
  const getStatus = (spent: number, budget: number, predicted: number) => {
    if (predicted > budget) return 'warning';
    if (spent > budget * 0.9) return 'caution';
    return 'good';
  };

  // Check for budget alerts on mount
  useState(() => {
    const alerts: string[] = [];
    budgets.forEach(budget => {
      const percentage = getPercentage(budget.spent, budget.allocated);
      if (percentage >= 90) {
        alerts.push(`${budget.category} budget at ${Math.round(percentage)}%`);
      }
      if (budget.predicted > budget.allocated) {
        alerts.push(`${budget.category} predicted to exceed by ${formatCurrency(budget.predicted - budget.allocated)}`);
      }
    });
    if (alerts.length > 0) {
      toast.warning(`⚠️ ${alerts.length} budget alert${alerts.length > 1 ? 's' : ''} detected!`);
    }
  });

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1>Budgets & Predictions</h1>
            <p className="text-muted-foreground">Track spending and get AI-powered forecasts</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 btn-ripple"
            onClick={() => toast.success("✨ Opening budget creation form...")}
          >
            <Plus size={16} className="mr-2" />
            Create Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Budget</CardTitle>
                <TrendingUp className="text-indigo-600" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatCurrency(27000)}</div>
                <p className="text-xs text-muted-foreground mt-1">Monthly allocation</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Spent</CardTitle>
                <TrendingDown className="text-orange-600" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatCurrency(23950)}</div>
                <p className="text-xs text-muted-foreground mt-1">88.7% of budget</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Remaining</CardTitle>
                <Sparkles className="text-emerald-600" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-emerald-600">{formatCurrency(3050)}</div>
                <p className="text-xs text-muted-foreground mt-1">11.3% left for month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Budget Categories */}
        <div className="mb-6">
          <h3 className="mb-4">Budget Categories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget, index) => {
              const percentage = getPercentage(budget.spent, budget.budget);
              const status = getStatus(budget.spent, budget.budget, budget.predicted);
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedBudget(budget)}
                >
                  <Card className={`cursor-pointer transition-all ${selectedBudget.id === budget.id ? 'ring-2 ring-indigo-600' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                            {budget.icon}
                          </div>
                          <div>
                            <div>{budget.category}</div>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                            </p>
                          </div>
                        </div>
                        {status === 'warning' && (
                          <AlertTriangle className="text-orange-600" size={20} />
                        )}
                      </div>
                      
                      <Progress 
                        value={percentage} 
                        className="h-2 mb-2"
                        style={{ 
                          backgroundColor: '#e5e7eb',
                        }}
                      />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {percentage.toFixed(0)}% used
                        </span>
                        <span className={`flex items-center gap-1 ${
                          budget.predicted > budget.budget ? 'text-orange-600' : 'text-emerald-600'
                        }`}>
                          <TrendingUp size={14} />
                          Predicted: {formatCurrency(budget.predicted)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detailed View & Predictions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Predictive View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={20} />
                  AI Budget Forecast
                </CardTitle>
                <CardDescription>
                  Predicted spending for {selectedBudget.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      name="Historical"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm mb-1">AI Recommendation</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBudget.predicted > selectedBudget.budget
                          ? `You're on track to exceed your ${selectedBudget.category} budget by ${formatCurrency(selectedBudget.predicted - selectedBudget.budget)}. Consider reducing spending or adjusting your budget.`
                          : `Great job! You're staying within budget. Keep up the good work.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* What-If Simulator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>What-If Simulator</CardTitle>
                <CardDescription>
                  See how budget changes affect your savings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Adjust {selectedBudget.category} Budget</Label>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(whatIfAmount[0])}
                      </span>
                    </div>
                    <Slider
                      value={whatIfAmount}
                      onValueChange={setWhatIfAmount}
                      min={1000}
                      max={10000}
                      step={500}
                      className="my-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Current Budget</div>
                      <div className="text-xl">{formatCurrency(selectedBudget.budget)}</div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">New Budget</div>
                      <div className="text-xl text-indigo-600 dark:text-indigo-400">{formatCurrency(whatIfAmount[0])}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="flex items-start gap-2 mb-3">
                      <TrendingUp className="text-emerald-600 flex-shrink-0" size={18} />
                      <div>
                        <div className="text-sm mb-1">Impact on Savings</div>
                        <div className="text-2xl text-emerald-600">
                          {whatIfAmount[0] < selectedBudget.budget ? '+' : '-'}
                          {formatCurrency(Math.abs(whatIfAmount[0] - selectedBudget.budget))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {whatIfAmount[0] < selectedBudget.budget
                        ? `By reducing your budget by ${formatCurrency(selectedBudget.budget - whatIfAmount[0])}, you could save an extra ${formatCurrency((selectedBudget.budget - whatIfAmount[0]) * 12)}/year`
                        : `Increasing your budget by ${formatCurrency(whatIfAmount[0] - selectedBudget.budget)} will reduce your annual savings by ${formatCurrency((whatIfAmount[0] - selectedBudget.budget) * 12)}`
                      }
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 btn-ripple"
                  onClick={() => {
                    toast.success(`✅ Budget for ${selectedBudget.category} updated to ${formatCurrency(whatIfAmount[0])}!`);
                  }}
                >
                  Apply Budget Change
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Spending</CardTitle>
              <CardDescription>Compare your budgets with actual spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                  <Bar dataKey="spent" fill="#6366f1" name="Spent" />
                  <Bar dataKey="predicted" fill="#10b981" name="Predicted" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm">{children}</label>;
}
