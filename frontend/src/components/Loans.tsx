import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import { mockData, formatCurrency } from "../mockData";
import { Building2, TrendingDown, CheckCircle, Sparkles, Calculator } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Loans() {
  const { loans } = mockData;
  const [selectedType, setSelectedType] = useState("Personal");
  const [loanAmount, setLoanAmount] = useState([300000]);
  const [tenure, setTenure] = useState([3]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const filteredLoans = loans.filter(loan => loan.type === selectedType);

  const handleApply = (loan: any) => {
    setSelectedLoan(loan);
    setShowApplyModal(true);
  };

  const handleConfirmApply = () => {
    toast.success(`🎉 Application submitted for ${selectedLoan.bank} ${selectedLoan.type} Loan!`);
    setShowApplyModal(false);
  };

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="px-4 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Loan Marketplace</h1>
          <p className="text-muted-foreground">Compare and apply for best loan offers from top banks</p>
        </motion.div>

        {/* Loan Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#10B981]" />
                <CardTitle>Loan Calculator</CardTitle>
              </div>
              <CardDescription>Adjust amount and tenure to see EMI estimates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Loan Amount</label>
                  <span className="text-sm text-[#1E3A8A]">{formatCurrency(loanAmount[0])}</span>
                </div>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  min={100000}
                  max={5000000}
                  step={50000}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm">Tenure</label>
                  <span className="text-sm text-[#1E3A8A]">{tenure[0]} years</span>
                </div>
                <Slider
                  value={tenure}
                  onValueChange={setTenure}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loan Type Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Personal">Personal</TabsTrigger>
            <TabsTrigger value="Home">Home</TabsTrigger>
            <TabsTrigger value="Vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="Education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredLoans.map((loan, index) => {
                const emi = calculateEMI(loanAmount[0], loan.rate, tenure[0]);
                
                return (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`hover:shadow-lg transition-all ${loan.recommended ? 'border-2 border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-transparent' : 'border border-gray-200'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-[#1E3A8A]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{loan.bank}</CardTitle>
                              <CardDescription>{loan.type} Loan</CardDescription>
                            </div>
                          </div>
                          {loan.recommended && (
                            <Badge className="bg-[#10B981] text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Interest Rate</p>
                            <p className="text-xl text-[#1E3A8A]">{loan.rate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Processing Fee</p>
                            <p className="text-xl text-muted-foreground">{loan.processing}%</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                          <p className="text-xs text-muted-foreground mb-1">Estimated EMI</p>
                          <p className="text-2xl text-[#F59E0B]">{formatCurrency(emi)}/mo</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            <span>Quick approval in 24 hours</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            <span>Minimal documentation</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            <span>Flexible repayment options</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669] text-white"
                          onClick={() => handleApply(loan)}
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* AI Recommendation */}
            {filteredLoans.find(l => l.recommended) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 border-[#10B981]/30 bg-gradient-to-r from-[#10B981]/5 to-[#1E3A8A]/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h3 className="mb-1">AI Recommendation</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on your credit score of 782 and income profile, {filteredLoans.find(l => l.recommended)?.bank} offers the best terms. You could save up to ₹1,200/month compared to other options.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedLoan?.bank} Loan</DialogTitle>
            <DialogDescription>
              Complete your application in 3 simple steps
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Loan Amount</p>
                  <p className="text-[#1E3A8A]">{formatCurrency(loanAmount[0])}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tenure</p>
                  <p className="text-[#1E3A8A]">{tenure[0]} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="text-[#1E3A8A]">{selectedLoan?.rate}% p.a.</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly EMI</p>
                  <p className="text-[#F59E0B]">{formatCurrency(calculateEMI(loanAmount[0], selectedLoan?.rate || 0, tenure[0]))}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Documents will be collected digitally</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Approval within 24-48 hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Disbursal in 3-5 working days</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669] text-white"
                onClick={handleConfirmApply}
              >
                Confirm & Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
