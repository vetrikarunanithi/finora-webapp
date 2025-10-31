import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { motion } from "motion/react";
import { mockData } from "../mockData";
import { User, Bell, Shield, Globe, Moon, Sun, Lock, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function Settings({ theme, onThemeChange }: SettingsProps) {
  const { user } = mockData;
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    sms: false,
    push: true
  });
  const [biometric, setBiometric] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);

  const handleSave = () => {
    toast.success("✅ Settings updated successfully!");
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    onThemeChange(newTheme);
    toast.success(`🎨 Theme changed to ${newTheme} mode`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1>Settings & Security</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1E3A8A]" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#10B981] flex items-center justify-center text-white text-3xl">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <Button variant="outline" className="btn-ripple">Change Photo</Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        defaultValue={user.name}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        defaultValue={user.phone}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        defaultValue={user.city}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Card</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pan"
                        defaultValue={user.pan}
                        className="pl-10 uppercase"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">PAN cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input
                      id="upi"
                      defaultValue={user.upiId}
                    />
                  </div>
                </div>

                <Button className="bg-[#1E3A8A] hover:bg-[#1e40af] btn-ripple" onClick={handleSave}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#10B981]" />
                  App Preferences
                </CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {theme === "light" ? (
                      <Sun className="w-5 h-5 text-[#F59E0B]" />
                    ) : (
                      <Moon className="w-5 h-5 text-[#1E3A8A]" />
                    )}
                    <div>
                      <h4>Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        {theme === "light" ? "Currently using light theme" : "Currently using dark theme"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Display</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                        <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                        <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateformat">Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger id="dateformat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4>Dashboard Widgets</h4>
                  {[
                    "Show total balance",
                    "Display AI insights",
                    "Show investment portfolio",
                    "Track credit score",
                    "Show upcoming bills"
                  ].map((option) => (
                    <div key={option} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{option}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>

                <Button className="bg-[#10B981] hover:bg-[#059669] btn-ripple" onClick={handleSave}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#F59E0B]" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <h4>Biometric Authentication</h4>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face ID to login</p>
                  </div>
                  <Switch
                    checked={biometric}
                    onCheckedChange={(checked) => {
                      setBiometric(checked);
                      toast.success(checked ? "Biometric enabled" : "Biometric disabled");
                    }}
                  />
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4>PIN Lock</h4>
                      <p className="text-sm text-muted-foreground">Secure your app with a 4-digit PIN</p>
                    </div>
                  </div>
                  <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="btn-ripple">
                        <Lock className="w-4 h-4 mr-2" />
                        Change PIN
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change PIN</DialogTitle>
                        <DialogDescription>
                          Enter a new 4-digit PIN for your account
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3, 4].map((i) => (
                            <Input
                              key={i}
                              type="password"
                              maxLength={1}
                              className="w-16 h-16 text-center text-2xl"
                            />
                          ))}
                        </div>
                        <Button
                          className="w-full bg-[#10B981] hover:bg-[#059669] btn-ripple"
                          onClick={() => {
                            toast.success("PIN changed successfully!");
                            setShowPinModal(false);
                          }}
                        >
                          Confirm PIN
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="mb-2">Change Password</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last changed 45 days ago
                  </p>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-4 btn-ripple" variant="outline">
                    Update Password
                  </Button>
                </div>

                <div className="p-4 border border-[#F59E0B]/30 rounded-lg bg-[#F59E0B]/5">
                  <h4 className="mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button className="bg-[#F59E0B] hover:bg-[#ea580c] btn-ripple">
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                  <h4 className="mb-2 text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all data
                  </p>
                  <Button variant="destructive" className="btn-ripple">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#10B981]" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#1E3A8A]" />
                      <div>
                        <h4>Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#10B981]" />
                      <div>
                        <h4>WhatsApp Alerts</h4>
                        <p className="text-sm text-muted-foreground">Get notifications on WhatsApp</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.whatsapp}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, whatsapp: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#F59E0B]" />
                      <div>
                        <h4>SMS Alerts</h4>
                        <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#8b5cf6]" />
                      <div>
                        <h4>Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">In-app push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4>Notification Types</h4>
                  {[
                    "Transaction alerts",
                    "Budget exceeded warnings",
                    "Bill payment reminders",
                    "SIP due date alerts",
                    "Goal milestones",
                    "AI insights & tips",
                    "Reward achievements",
                    "Credit score updates"
                  ].map((option) => (
                    <div key={option} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{option}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>

                <Button className="bg-[#10B981] hover:bg-[#059669] btn-ripple" onClick={handleSave}>
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="border-[#1E3A8A]/20">
        <CardContent className="p-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Made with ❤️ in India | © FinAI 2025</p>
            <div className="flex items-center justify-center gap-4">
              <button className="hover:text-[#1E3A8A] transition-colors">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-[#1E3A8A] transition-colors">Terms of Service</button>
              <span>•</span>
              <button className="hover:text-[#1E3A8A] transition-colors">RBI Compliance</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
