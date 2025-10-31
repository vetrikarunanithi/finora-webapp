import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Filter, 
  Download,
  ChevronDown,
  Tag,
  Check,
  X,
  FileDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { formatCurrency, formatIndianDate } from "../mockData";

const transactions = [
  { id: 1, date: '2025-10-27', merchant: 'BigBasket', category: 'Groceries', amount: -6500, status: 'completed', confidence: 95, icon: '🛒' },
  { id: 2, date: '2025-10-27', merchant: 'Uber', category: 'Transportation', amount: -245, status: 'completed', confidence: 98, icon: '🚗' },
  { id: 3, date: '2025-10-26', merchant: 'Netflix', category: 'Entertainment', amount: -649, status: 'completed', confidence: 100, icon: '🎬' },
  { id: 4, date: '2025-10-26', merchant: 'Cafe Coffee Day', category: 'Food & Dining', amount: -350, status: 'completed', confidence: 92, icon: '☕' },
  { id: 5, date: '2025-10-25', merchant: 'Salary Deposit', category: 'Income', amount: 125000, status: 'completed', confidence: 100, icon: '💰' },
  { id: 6, date: '2025-10-25', merchant: 'Amazon India', category: 'Shopping', amount: -4850, status: 'completed', confidence: 88, icon: '📦', suggestedCategory: 'Electronics' },
  { id: 7, date: '2025-10-24', merchant: 'Indian Oil', category: 'Transportation', amount: -2800, status: 'completed', confidence: 95, icon: '⛽' },
  { id: 8, date: '2025-10-24', merchant: 'Flipkart', category: 'Shopping', amount: -8900, status: 'completed', confidence: 90, icon: '🎯' },
  { id: 9, date: '2025-10-23', merchant: 'Dominos', category: 'Food & Dining', amount: -850, status: 'completed', confidence: 97, icon: '🌯' },
  { id: 10, date: '2025-10-23', merchant: 'Spotify India', category: 'Entertainment', amount: -119, status: 'completed', confidence: 100, icon: '🎵' },
];

const categories = ['All', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Income', 'Bills', 'Other'];

export function Transactions() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [smartSuggestionOpen, setSmartSuggestionOpen] = useState(true);
  const [transactionsList, setTransactionsList] = useState(transactions);
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
  const suggestedTransaction = transactionsList.find(t => t.suggestedCategory);

  const handleAcceptSuggestion = () => {
    if (suggestedTransaction) {
      const updated = transactionsList.map(t => 
        t.id === suggestedTransaction.id 
          ? { ...t, category: t.suggestedCategory!, suggestedCategory: undefined }
          : t
      );
      setTransactionsList(updated);
      setSmartSuggestionOpen(false);
      toast.success("✅ Category updated successfully!");
    }
  };

  const handleRejectSuggestion = () => {
    setSmartSuggestionOpen(false);
    toast.info("Category suggestion dismissed");
  };

  const handleExport = (format: string) => {
    toast.success(`📄 Exporting transactions as ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`✅ Transactions exported successfully as ${format.toUpperCase()}!`);
    }, 1500);
  };

  const handleMoreFilters = () => {
    toast.info("🔍 Opening advanced filters...");
  };

  const totalIncome = transactionsList
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactionsList
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netChange = totalIncome - totalExpenses;

  const filteredTransactions = transactionsList.filter(t => 
    selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1>Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>

        {/* Smart Suggest Panel */}
        <AnimatePresence>
          {smartSuggestionOpen && suggestedTransaction && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                        {suggestedTransaction.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="text-indigo-600" size={18} />
                          <h3>Smart Category Suggestion</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          We noticed <strong>{suggestedTransaction.merchant}</strong> might be better categorized as "{suggestedTransaction.suggestedCategory}" instead of "{suggestedTransaction.category}"
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Confidence: {suggestedTransaction.confidence}%</span>
                          <span className="text-xs">•</span>
                          <span>{formatCurrency(Math.abs(suggestedTransaction.amount))}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleRejectSuggestion}
                        className="btn-ripple"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 btn-ripple"
                        onClick={handleAcceptSuggestion}
                      >
                        <Check size={16} className="mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-indigo-600 to-purple-600 btn-ripple" : "btn-ripple"}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMoreFilters}
              className="btn-ripple"
            >
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="btn-ripple">
                  <Download size={16} className="mr-2" />
                  Export
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileDown size={16} className="mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileDown size={16} className="mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileDown size={16} className="mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="transition-colors"
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50"
                    onClick={() => setExpandedTransaction(
                      expandedTransaction === transaction.id ? null : transaction.id
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                        {transaction.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{transaction.merchant}</span>
                          {transaction.confidence < 90 && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.confidence}% confidence
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{formatIndianDate(transaction.date)}</span>
                          <span className="text-xs">•</span>
                          <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <Tag size={14} />
                            {transaction.category}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg ${transaction.amount > 0 ? 'text-emerald-600' : ''}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={`transition-transform ${expandedTransaction === transaction.id ? 'rotate-180' : ''}`}
                      >
                        <ChevronDown size={20} />
                      </Button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedTransaction === transaction.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t bg-accent/30"
                      >
                        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Transaction ID:</span>
                            <p className="mt-1">TXN{String(transaction.id).padStart(6, '0')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="mt-1 capitalize">
                              <Badge variant="outline" className="text-emerald-600">
                                {transaction.status}
                              </Badge>
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <p className="mt-1">{transaction.confidence}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date & Time:</span>
                            <p className="mt-1">{transaction.date} 14:32</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Income</div>
              <div className="text-2xl text-emerald-600">{formatCurrency(totalIncome)}</div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
              <div className="text-2xl">{formatCurrency(totalExpenses)}</div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Net Change</div>
              <div className={`text-2xl ${netChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
