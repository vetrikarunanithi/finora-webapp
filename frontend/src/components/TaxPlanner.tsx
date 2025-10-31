import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";
import { mockData, formatCurrency } from "../mockData";
import { Calculator, Download, TrendingDown, Lightbulb, FileText, PiggyBank } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner@2.0.3";
import { generateITRPDF, calculateTaxBreakdown, type ITRData } from "../utils/itrPdfExport";

export function TaxPlanner() {
  const { taxData } = mockData;
  const [income, setIncome] = useState(taxData.income);
  const [deductions, setDeductions] = useState(taxData.deductions);

  const calculateTax = (taxableIncome: number) => {
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
    if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.1;
    if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
    if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.2;
    return 150000 + (taxableIncome - 1500000) * 0.3;
  };

  const taxableIncome = income - deductions;
  const taxPayable = calculateTax(taxableIncome);

  const taxBreakdown = [
    { range: "₹0 - ₹3L", tax: 0, fill: "#10B981" },
    { range: "₹3L - ₹6L", tax: taxableIncome > 300000 ? Math.min(taxableIncome - 300000, 300000) * 0.05 : 0, fill: "#1E3A8A" },
    { range: "₹6L - ₹9L", tax: taxableIncome > 600000 ? Math.min(taxableIncome - 600000, 300000) * 0.1 : 0, fill: "#F59E0B" },
    { range: "₹9L - ₹12L", tax: taxableIncome > 900000 ? Math.min(taxableIncome - 900000, 300000) * 0.15 : 0, fill: "#FB923C" },
    { range: "Above ₹12L", tax: taxableIncome > 1200000 ? (taxableIncome - 1200000) * 0.2 : 0, fill: "#8b5cf6" }
  ];

  const handleDownload = async () => {
    const taxBreakdown = calculateTaxBreakdown(taxableIncome);
    
    const itrData: ITRData = {
      assessmentYear: '2025-26',
      financialYear: '2024-25',
      income,
      deductions,
      taxableIncome,
      taxPayable,
      deductionBreakdown: mockData.taxData.deductionBreakdown,
      taxBreakdown,
      userInfo: {
        name: mockData.user.name,
        pan: mockData.user.pan,
        email: mockData.user.email,
        phone: mockData.user.phone
      }
    };
    
    toast.promise(
      generateITRPDF(itrData),
      {
        loading: 'Generating ITR Summary PDF...',
        success: '📄 ITR Summary PDF ready! Check your print dialog.',
        error: 'Failed to generate PDF'
      }
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1>Tax Planning & Compliance</h1>
        <p className="text-muted-foreground">Plan your taxes smartly and maximize savings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover-lift border-[#1E3A8A]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E3A8A]" />
                Annual Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1E3A8A] animate-counter">
                {formatCurrency(income)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Total income for FY 2024-25</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover-lift border-[#10B981]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#10B981]" />
                Deductions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#10B981] animate-counter">
                {formatCurrency(deductions)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Total tax savings claimed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover-lift border-[#F59E0B]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#F59E0B]" />
                Tax Payable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#F59E0B] animate-counter">
                {formatCurrency(taxPayable)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">After deductions & exemptions</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tax Estimator</CardTitle>
              <CardDescription>Calculate your tax liability for FY 2024-25</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deductions">Total Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-3 p-4 bg-accent/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span>{formatCurrency(taxableIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Effective Tax Rate</span>
                  <span>{((taxPayable / taxableIncome) * 100).toFixed(2)}%</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span>Tax Payable</span>
                  <span className="text-xl text-[#F59E0B]">{formatCurrency(taxPayable)}</span>
                </div>
              </div>

              <Button className="w-full bg-[#1E3A8A] hover:bg-[#1e40af] btn-ripple" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download ITR Summary
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tax Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tax Slab Breakdown</CardTitle>
              <CardDescription>New tax regime slabs for FY 2024-25</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taxBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="tax" radius={[8, 8, 0, 0]}>
                    {taxBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deductions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Deductions & Exemptions</CardTitle>
            <CardDescription>Claimed under various sections</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="claimed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="claimed">Claimed</TabsTrigger>
                <TabsTrigger value="available">Available Options</TabsTrigger>
              </TabsList>

              <TabsContent value="claimed" className="space-y-4 mt-6">
                {taxData.deductionBreakdown.map((deduction, index) => (
                  <motion.div
                    key={deduction.section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded text-sm">
                          Section {deduction.section}
                        </span>
                        <span>{formatCurrency(deduction.amount)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{deduction.description}</p>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="available" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { section: "80C", max: 150000, desc: "PPF, ELSS, Insurance, NSC" },
                    { section: "80D", max: 25000, desc: "Health Insurance Premium" },
                    { section: "80CCD(1B)", max: 50000, desc: "NPS Additional Benefit" },
                    { section: "80EE", max: 50000, desc: "Home Loan Interest (First-time buyer)" },
                    { section: "24(b)", max: 200000, desc: "Home Loan Interest" },
                    { section: "80TTA", max: 10000, desc: "Savings Account Interest" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.section}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="p-4 border rounded-lg hover:border-[#10B981] hover:bg-[#10B981]/5 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-sm">
                          Section {item.section}
                        </span>
                        <span className="text-sm">Max: {formatCurrency(item.max)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Tax Savings Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-[#10B981]/30 bg-[#10B981]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#10B981]" />
              AI-Powered Tax Saving Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {taxData.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="p-4 bg-card rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <TrendingDown className="w-5 h-5 text-[#10B981]" />
                    <span className="text-xl text-[#10B981]">{formatCurrency(suggestion.potential)}</span>
                  </div>
                  <p className="text-sm">{suggestion.tip}</p>
                  <Button variant="outline" size="sm" className="w-full btn-ripple">
                    Learn More
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
