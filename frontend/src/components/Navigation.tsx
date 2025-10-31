import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Target, 
  TrendingUp, 
  FileText, 
  Settings,
  Menu,
  X,
  CreditCard,
  Landmark,
  LineChart,
  Calculator,
  Gift,
  Moon,
  Sun,
  Building2,
  Smartphone,
  Wallet,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'wallet', label: 'Finora Wallet', icon: Wallet },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'banking', label: 'Banking & Payments', icon: Building2 },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'credit', label: 'Credit', icon: CreditCard },
  { id: 'loans', label: 'Loans', icon: Landmark },
  { id: 'mutualfunds', label: 'Mutual Funds', icon: LineChart },
  { id: 'tax', label: 'Tax', icon: Calculator },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({ currentView, onViewChange, theme, onThemeChange, onLogout }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const mobile = localStorage.getItem('userMobile') || 'User';
    setUserName(mobile.substring(0, 10));
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-[#1E293B] rounded-lg p-2 shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <motion.nav
        initial={false}
        animate={{ width: isCollapsed ? 80 : 240 }}
        className="hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40 overflow-y-auto"
      >
        <div className="p-6 flex items-center justify-between">
          <motion.button
            onClick={() => onViewChange('dashboard')}
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center">
              <span className="text-white">₹</span>
            </div>
            {!isCollapsed && <span className="text-sidebar-foreground">Finora</span>}
          </motion.button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon size={18} />
                <motion.span
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                  className="overflow-hidden whitespace-nowrap text-sm"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* User Info, Theme Toggle & Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {!isCollapsed && (
            <div className="px-3 py-2 bg-sidebar-accent/30 rounded-lg">
              <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userName}
              </p>
            </div>
          )}
          
          <button
            onClick={handleThemeToggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <motion.span
              initial={false}
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              className="overflow-hidden whitespace-nowrap text-sm"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut size={18} />
            <motion.span
              initial={false}
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              className="overflow-hidden whitespace-nowrap text-sm"
            >
              Logout
            </motion.span>
          </button>
          
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/40 px-3 text-center">
              Made with ❤️ in India
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-40 lg:hidden flex flex-col"
      >
        <button 
          onClick={() => {
            onViewChange('dashboard');
            setIsMobileOpen(false);
          }}
          className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center">
            <span className="text-white">₹</span>
          </div>
          <span className="text-sidebar-foreground">Finora</span>
        </button>

        <div className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Info, Theme Toggle & Logout */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="px-3 py-2 bg-sidebar-accent/30 rounded-lg">
            <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userName}
            </p>
          </div>

          <button
            onClick={handleThemeToggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => {
              handleLogout();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
          
          <div className="text-xs text-sidebar-foreground/40 px-3 text-center">
            Made with ❤️ in India
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
