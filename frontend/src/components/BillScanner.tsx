import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, X, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { makePayment } from '../utils/walletManager';
import { formatCurrency } from '../mockData';
import { toast } from 'sonner@2.0.3';

interface BillScannerProps {
  onClose: () => void;
}

interface ExtractedBillData {
  merchant: string;
  amount: number;
  items: string[];
  category: string;
  date: string;
}

export function BillScanner({ onClose }: BillScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock OCR data for demo
  const mockBills: ExtractedBillData[] = [
    {
      merchant: 'Cafe Coffee Day',
      amount: 450,
      items: ['Cappuccino x2', 'Sandwich', 'Brownie'],
      category: 'Food & Drinks',
      date: new Date().toISOString()
    },
    {
      merchant: 'More Megastore',
      amount: 1250,
      items: ['Groceries', 'Vegetables', 'Dairy Products'],
      category: 'Shopping',
      date: new Date().toISOString()
    },
    {
      merchant: 'Reliance Digital',
      amount: 2499,
      items: ['Wireless Mouse', 'USB Cable', 'Phone Cover'],
      category: 'Shopping',
      date: new Date().toISOString()
    },
    {
      merchant: 'PVR Cinemas',
      amount: 850,
      items: ['Movie Tickets x2', 'Popcorn Combo'],
      category: 'Entertainment',
      date: new Date().toISOString()
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      processBill();
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    // In a real app, this would open the camera
    // For demo, we'll use a mock image
    setImagePreview('https://images.unsplash.com/photo-1554224311-beee813a8c73?w=400&h=300&fit=crop');
    processBill();
  };

  const processBill = () => {
    setIsProcessing(true);

    // Simulate AI OCR processing
    setTimeout(() => {
      const randomBill = mockBills[Math.floor(Math.random() * mockBills.length)];
      setExtractedData(randomBill);
      setIsProcessing(false);
      
      toast.success('Bill Scanned Successfully!', {
        description: 'AI has extracted all transaction details'
      });
    }, 2500);
  };

  const handleLogTransaction = () => {
    if (!extractedData) return;

    const transaction = makePayment(
      extractedData.merchant,
      extractedData.amount,
      extractedData.category,
      undefined,
      undefined,
      'wallet'
    );

    if (transaction) {
      toast.success('Transaction Logged!', {
        description: `${formatCurrency(extractedData.amount)} expense recorded`
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-auto"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  AI Bill Lens
                </CardTitle>
                <CardDescription>Scan bills to automatically log transactions</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {!imagePreview ? (
              <div className="space-y-4">
                {/* Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="bill-upload"
                    />
                    <Card className="border-dashed border-2 hover:border-blue-500 transition-colors cursor-pointer">
                      <CardContent className="p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                        <h3 className="mb-1">Upload Bill</h3>
                        <p className="text-sm text-muted-foreground">Choose a photo from gallery</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card 
                    className="border-dashed border-2 hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={handleCapture}
                  >
                    <CardContent className="p-8 text-center">
                      <Camera className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                      <h3 className="mb-1">Take Photo</h3>
                      <p className="text-sm text-muted-foreground">Capture bill with camera</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          AI-Powered OCR
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Our AI instantly reads store name, total amount, and items purchased. 
                          The transaction is automatically categorized and logged for you!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={imagePreview} 
                    alt="Bill preview" 
                    className="w-full h-64 object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1, repeat: Infinity }
                        }}
                      >
                        <Sparkles className="w-16 h-16 text-white" />
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Processing Status */}
                {isProcessing && (
                  <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <div>
                          <p className="font-semibold">AI is analyzing your bill...</p>
                          <p className="text-sm text-white/80">Extracting merchant, amount, and items</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Extracted Data */}
                {extractedData && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            Bill Details Extracted
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-green-700 dark:text-green-300">Merchant</Label>
                            <p className="font-semibold text-green-900 dark:text-green-100">{extractedData.merchant}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-green-700 dark:text-green-300">Total Amount</Label>
                            <p className="text-xl font-semibold text-green-900 dark:text-green-100">
                              {formatCurrency(extractedData.amount)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-green-700 dark:text-green-300">Category</Label>
                            <Badge variant="secondary">{extractedData.category}</Badge>
                          </div>

                          <div>
                            <Label className="text-green-700 dark:text-green-300 mb-2 block">Items</Label>
                            <div className="space-y-1">
                              {extractedData.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                  <span className="text-green-800 dark:text-green-200">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setImagePreview(null);
                          setExtractedData(null);
                        }}
                        className="flex-1"
                      >
                        Scan Again
                      </Button>
                      <Button 
                        onClick={handleLogTransaction}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Log Transaction
                      </Button>
                    </div>
                  </motion.div>
                )}

                {!extractedData && !isProcessing && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setImagePreview(null);
                    }}
                    className="w-full"
                  >
                    Choose Different Image
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
