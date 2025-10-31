import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import { mockData, formatCurrency } from "../mockData";
import { TrendingUp, Sparkles, Search, BarChart3, Shield, IndianRupee, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function MutualFunds() {
  const { mutualFunds } = mockData;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunds, setSelectedFunds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showStartSIP, setShowStartSIP] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [sipAmount, setSipAmount] = useState("1000");

  const filteredFunds = mutualFunds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFundSelection = (fundId: number) => {
    if (selectedFunds.includes(fundId)) {
      setSelectedFunds(selectedFunds.filter(id => id !== fundId));
    } else if (selectedFunds.length < 3) {
      setSelectedFunds([...selectedFunds, fundId]);
    } else {
      toast.error("You can compare up to 3 funds only");
    }
  };

  const handleStartSIP = (fund: any) => {
    setSelectedFund(fund);
    setShowStartSIP(true);
  };

  const handleConfirmSIP = () => {
    toast.success(`🎉 SIP started for ${selectedFund.name} with ₹${sipAmount}/month!`);
    setShowStartSIP(false);
    setSipAmount("1000");
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-[#10B981] text-white";
      case "moderate":
        return "bg-[#F59E0B] text-white";
      case "high":
        return "bg-[#EF4444] text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const comparedFunds = mutualFunds.filter(fund => selectedFunds.includes(fund.id));

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="px-4 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Mutual Fund Comparison</h1>
          <p className="text-muted-foreground">Compare and invest in top-performing mutual funds</p>
        </motion.div>

        {/* Search & Compare Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search mutual funds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedFunds.length >= 2 && (
            <Button
              onClick={() => setShowCompare(true)}
              className="bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669] text-white"
            >
              Compare {selectedFunds.length} Funds
            </Button>
          )}
        </motion.div>

        {/* Selection Helper */}
        {selectedFunds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-[#10B981]/30 bg-gradient-to-r from-[#10B981]/5 to-transparent">
              <CardContent className="p-4">
                <p className="text-sm">
                  {selectedFunds.length} fund{selectedFunds.length > 1 ? 's' : ''} selected for comparison
                  {selectedFunds.length < 2 && " (select at least 2 to compare)"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Fund Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map((fund, index) => {
            const isSelected = selectedFunds.includes(fund.id);
            
            return (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    fund.recommended 
                      ? 'border-2 border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-transparent' 
                      : isSelected
                      ? 'border-2 border-[#1E3A8A]'
                      : 'border border-gray-200'
                  }`}
                  onClick={() => toggleFundSelection(fund.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{fund.name}</CardTitle>
                        <CardDescription>{fund.category}</CardDescription>
                      </div>
                      {fund.recommended && (
                        <Badge className="bg-[#10B981] text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Pick
                        </Badge>
                      )}
                    </div>
                    <Badge className={getRiskColor(fund.risk)}>{fund.risk} Risk</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current ROI</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4 text-[#10B981]" />
                          <span className="text-xl text-[#10B981]">{fund.roi}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">3Y Return</p>
                        <p className="text-xl text-[#1E3A8A] mt-1">{fund.threeYearReturn}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Expense Ratio</p>
                        <p className="text-sm mt-1">{fund.expenseRatio}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Min SIP</p>
                        <p className="text-sm mt-1">{formatCurrency(fund.minSIP)}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                      <p className="text-xs text-muted-foreground mb-1">5 Year Return</p>
                      <p className="text-2xl text-[#F59E0B]">{fund.fiveYearReturn}%</p>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartSIP(fund);
                      }}
                    >
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Start SIP
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredFunds.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No funds found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          </Card>
        )}
      </div>

      {/* Comparison Modal */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fund Comparison</DialogTitle>
            <DialogDescription>
              Compare key metrics across selected funds
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedFunds.map((fund) => (
                <Card key={fund.id} className={fund.recommended ? 'border-2 border-[#10B981]' : ''}>
                  <CardHeader>
                    <CardTitle className="text-base">{fund.name}</CardTitle>
                    <CardDescription>{fund.category}</CardDescription>
                    {fund.recommended && (
                      <Badge className="bg-[#10B981] text-white mt-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Recommended by FinAI
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current ROI</span>
                        <span className="text-[#10B981]">{fund.roi}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">3Y Return</span>
                        <span className="text-[#1E3A8A]">{fund.threeYearReturn}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">5Y Return</span>
                        <span className="text-[#F59E0B]">{fund.fiveYearReturn}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk</span>
                        <Badge className={`${getRiskColor(fund.risk)} text-xs`}>{fund.risk}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expense Ratio</span>
                        <span>{fund.expenseRatio}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min SIP</span>
                        <span>{formatCurrency(fund.minSIP)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#10B981] text-white"
                      onClick={() => {
                        setShowCompare(false);
                        handleStartSIP(fund);
                      }}
                    >
                      Start SIP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {comparedFunds.find(f => f.recommended) && (
              <Card className="border-2 border-[#10B981]/30 bg-gradient-to-r from-[#10B981]/5 to-[#1E3A8A]/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <h3 className="mb-1">AI Recommendation</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your investment profile and risk appetite, we recommend {comparedFunds.find(f => f.recommended)?.name}. It offers the best risk-adjusted returns with consistent performance over 3 and 5 year periods.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Start SIP Modal */}
      <Dialog open={showStartSIP} onOpenChange={setShowStartSIP}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start SIP in {selectedFund?.name}</DialogTitle>
            <DialogDescription>
              Set up your systematic investment plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fund Category</span>
                <span>{selectedFund?.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <Badge className={getRiskColor(selectedFund?.risk || "moderate")}>{selectedFund?.risk}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Returns</span>
                <span className="text-[#10B981]">{selectedFund?.roi}% annually</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Monthly SIP Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  className="pl-10"
                  min={selectedFund?.minSIP}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: {formatCurrency(selectedFund?.minSIP || 0)}
              </p>
            </div>

            <div className="p-4 bg-[#1E3A8A]/10 rounded-lg border border-[#1E3A8A]/20">
              <p className="text-xs text-muted-foreground mb-2">Projected Value (10 years)</p>
              <p className="text-2xl text-[#1E3A8A]">
                {formatCurrency(Math.round(parseInt(sipAmount) * 12 * 10 * (1 + (selectedFund?.roi || 0) / 100)))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {selectedFund?.roi}% annual returns
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Auto-debit from your bank account</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Modify or pause anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Track performance in real-time</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowStartSIP(false)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669] text-white"
                onClick={handleConfirmSIP}
              >
                Start SIP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
