import { motion } from "motion/react";
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Target, 
  PieChart, 
  Lock,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "./ui/button";

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl">FinAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Button variant="ghost" onClick={onGetStarted}>Sign In</Button>
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Get Started
            </Button>
          </div>
          
          <Button onClick={onGetStarted} className="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600">
            Start
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block mb-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="inline mr-2" size={16} />
                AI-Powered Financial Intelligence
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
                Know your money.<br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Grow your future.
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect accounts — get AI-driven budgets & investment ideas. Smart insights that help you save more and achieve your financial goals faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={onGetStarted}
                >
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="text-emerald-600" size={18} />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-emerald-600" size={18} />
                  Bank-level security
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-4">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="text-sm opacity-80 mb-2">Total Balance</div>
                      <div className="text-3xl mb-4">$24,582.40</div>
                      <div className="flex gap-2 text-sm">
                        <span className="px-3 py-1 bg-white/20 rounded-full">+12.5% this month</span>
                      </div>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="bg-white rounded-xl p-4 border border-gray-200"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      >
                        <TrendingUp className="text-emerald-600 mb-2" size={24} />
                        <div className="text-sm text-muted-foreground">Income</div>
                        <div className="text-xl">$5,240</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white rounded-xl p-4 border border-gray-200"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      >
                        <PieChart className="text-orange-600 mb-2" size={24} />
                        <div className="text-sm text-muted-foreground">Expenses</div>
                        <div className="text-xl">$3,124</div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="text-emerald-600 flex-shrink-0" size={20} />
                        <div>
                          <div className="text-sm mb-1">AI Insight</div>
                          <p className="text-sm text-muted-foreground">
                            You can save $480 by next month by optimizing subscriptions
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="text-indigo-600" size={32} />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="text-emerald-600" size={32} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-t border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock size={20} className="text-emerald-600" />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield size={20} className="text-indigo-600" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check size={20} className="text-purple-600" />
              <span>100,000+ users trust us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4">
              Everything you need to master your finances
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven features that work together to give you complete financial clarity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Smart Categorization",
                description: "AI automatically categorizes transactions and learns your spending patterns",
                color: "indigo"
              },
              {
                icon: TrendingUp,
                title: "Budget Predictions",
                description: "Get accurate forecasts of month-end spending and personalized saving tips",
                color: "emerald"
              },
              {
                icon: Target,
                title: "Goal Tracking",
                description: "Set financial goals and let AI help you achieve them faster",
                color: "purple"
              },
              {
                icon: PieChart,
                title: "Investment Advice",
                description: "Receive personalized investment recommendations based on your profile",
                color: "orange"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Bank-level security with end-to-end encryption for all your data",
                color: "teal"
              },
              {
                icon: Lock,
                title: "Real-time Insights",
                description: "Get instant notifications and insights about your spending habits",
                color: "blue"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon className={`text-${feature.color}-600`} size={24} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl text-white mb-6">
              Ready to take control of your finances?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving smarter and investing better with FinAI
            </p>
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <span>FinAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered personal finance for everyone
              </p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2025 FinAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
