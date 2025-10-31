import { motion } from 'motion/react';
import { MapPin, X, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getLocationSpending } from '../utils/walletManager';
import { formatCurrency } from '../mockData';

interface GeoSpendingMapProps {
  onClose: () => void;
}

export function GeoSpendingMap({ onClose }: GeoSpendingMapProps) {
  const locationData = getLocationSpending();

  // Mock map coordinates for visualization
  const mockMapData = [
    { location: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, amount: 2500, color: '#EF4444' },
    { location: 'Andheri, Mumbai', lat: 19.1136, lng: 72.8697, amount: 1800, color: '#F59E0B' },
    { location: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, amount: 3200, color: '#EF4444' },
    { location: 'Indiranagar, Bangalore', lat: 12.9719, lng: 77.6412, amount: 1500, color: '#10B981' },
    { location: 'Park Street, Kolkata', lat: 22.5549, lng: 88.3513, amount: 900, color: '#10B981' },
  ];

  const maxAmount = Math.max(...mockMapData.map(d => d.amount), 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-auto my-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  GeoSmart Spending Map
                </CardTitle>
                <CardDescription>Visualize where you spend your money</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* Map Visualization */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {/* Simple map representation */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9ImdyYXkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
              
              {/* Location markers */}
              {mockMapData.map((loc, idx) => {
                const size = Math.max(30, (loc.amount / maxAmount) * 80);
                const opacity = 0.4 + (loc.amount / maxAmount) * 0.6;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="absolute"
                    style={{
                      left: `${20 + (idx * 15)}%`,
                      top: `${25 + (idx % 3) * 25}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.2
                      }}
                      className="relative"
                    >
                      <div
                        className="rounded-full blur-xl"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: loc.color,
                          opacity: opacity * 0.3
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: loc.color,
                          opacity: opacity
                        }}
                      >
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 whitespace-nowrap z-10 opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-sm font-semibold mb-1">{loc.location}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(loc.amount)}</p>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                <p className="text-xs font-semibold mb-2">Spending Intensity</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs">High</span>
                </div>
              </div>
            </div>

            {/* Location List */}
            <div>
              <h3 className="font-semibold mb-3">Top Spending Locations</h3>
              <div className="space-y-2">
                {locationData.slice(0, 5).map((loc, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{loc.location}</p>
                            <p className="text-sm text-muted-foreground">{loc.count} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatCurrency(loc.amount)}</p>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {((loc.amount / locationData.reduce((sum, l) => sum + l.amount, 0)) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {locationData.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No location data available yet</p>
                <p className="text-sm">Make purchases with location tracking enabled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
