import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Phone, Lock, User, CreditCard, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { validateUser, findUserByMobile } from "../mockUsers";

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const mobile = formData.get('mobile') as string;
    const password = formData.get('password') as string;
    
    if (!mobile || !password) {
      toast.error('Please enter mobile number and password');
      return;
    }

    // Validate mobile number format
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      // Validate user credentials
      const user = validateUser(mobile, password);
      
      setIsLoading(false);
      
      if (user) {
        // Store user data in localStorage
        localStorage.setItem('userMobile', mobile);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userUPI', user.upiId);
        localStorage.setItem('userAvatar', user.avatar);
        localStorage.setItem('userEmail', user.email);
        
        toast.success(`Login successful! Welcome back ${user.name.split(' ')[0]} ${user.avatar}`);
        onAuthSuccess();
      } else {
        toast.error('Invalid mobile number or password. Please try again.');
      }
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOnboarding(true);
    }, 1500);
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Show confetti and complete
      toast.success("🎉 Welcome to Finora!");
      setTimeout(() => {
        onAuthSuccess();
      }, 500);
    }
  };

  const handleForgotPassword = () => {
    setShowOTPModal(true);
  };

  const handleOTPVerify = () => {
    toast.success("✅ OTP Verified! Password reset link sent.");
    setShowOTPModal(false);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EFF6FF] to-[#DBEAFE] dark:from-[#0F172A] dark:via-[#1e293b] dark:to-[#334155] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 border-[#1E3A8A]/20">
            <CardHeader>
              <CardTitle>Setup Your Account - Step {onboardingStep}/3</CardTitle>
              <CardDescription>Let's personalize your FinAI experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {onboardingStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
                      ) : (
                        <CheckCircle className="w-8 h-8 text-[#10B981]" />
                      )}
                    </div>
                    <h3 className="mb-2">Link Your Bank Account</h3>
                    <p className="text-muted-foreground mb-6">Securely connect your bank for automatic sync</p>
                    <Button className="bg-[#1E3A8A] hover:bg-[#1e40af]" onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        toast.success("Bank linked successfully!");
                        handleOnboardingNext();
                      }, 2000);
                    }}>
                      {isLoading ? "Linking..." : "Connect Bank Account"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {onboardingStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="mb-4">Select Your Financial Goals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {["🏠 Buy Home", "🚗 Buy Car", "✈️ Dream Vacation", "📚 Education", "💰 Emergency Fund", "📈 Wealth Building"].map((goal) => (
                      <Button
                        key={goal}
                        variant="outline"
                        className="h-20 hover:border-[#10B981] hover:bg-[#10B981]/5"
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full bg-[#10B981] hover:bg-[#059669] mt-6" onClick={handleOnboardingNext}>
                    Continue
                  </Button>
                </motion.div>
              )}

              {onboardingStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="mb-4">Customize Your Dashboard</h3>
                  <div className="space-y-3">
                    {["Show total balance", "Display AI insights", "Enable spending alerts", "Show investment portfolio", "Track credit score"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                        <Checkbox defaultChecked id={option} />
                        <label htmlFor={option} className="cursor-pointer flex-1">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full saffron-gradient hover:opacity-90 mt-6" onClick={handleOnboardingNext}>
                    Complete Setup 🎉
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EFF6FF] to-[#DBEAFE] dark:from-[#0F172A] dark:via-[#1e293b] dark:to-[#334155] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl text-white">₹</span>
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#1E3A8A] to-[#10B981] bg-clip-text text-transparent">Finora</h1>
          <p className="text-muted-foreground">AI-Powered Finance & Payment Tracking</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-2 border-[#1E3A8A]/20">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to your Finora account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-mobile"
                        name="mobile"
                        type="tel"
                        placeholder="98765 43210"
                        className="pl-10"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="text-sm p-0 h-auto"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Button>

                  <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1e40af] btn-ripple" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" onClick={() => toast.info("UPI login coming soon!")}>
                      💳 UPI ID
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast.info("Google login coming soon!")}>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-2 border-[#10B981]/20">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join thousands of Indians managing finances smartly</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Neeru Sharma"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="neeru@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-pan">PAN Card</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-pan"
                        type="text"
                        placeholder="ABCDE1234F"
                        className="pl-10 uppercase"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm">
                      I agree to RBI-compliant{" "}
                      <button type="button" className="text-[#1E3A8A] underline">
                        Terms & Conditions
                      </button>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-[#10B981] hover:bg-[#059669] btn-ripple" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your registered mobile number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center"
                />
              ))}
            </div>
            <Button className="w-full bg-[#10B981] hover:bg-[#059669]" onClick={handleOTPVerify}>
              Verify OTP
            </Button>
            <Button variant="link" className="w-full">
              Resend OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
