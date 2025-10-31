import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Target,
  Sparkles,
  ChevronRight,
  Award
} from "lucide-react";
import { calculateFinancialHealthScore } from "../utils/advancedAI";
import { mockData } from "../mockData";
import { toast } from "sonner@2.0.3";

export function FinancialHealthScore() {
  const [healthScore, setHealthScore] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const score = calculateFinancialHealthScore(mockData);
    setHealthScore(score);
  }, []);

  if (!healthScore) {
    return (
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#10B981]" />
            Financial Health Score
          </CardTitle>
          <CardDescription>Analyzing your financial wellness...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-[#10B981]';
    if (grade.startsWith('B')) return 'text-[#06b6d4]';
    if (grade.startsWith('C')) return 'text-[#F59E0B]';
    return 'text-[#ef4444]';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-[#10B981]';
    if (score >= 60) return 'bg-[#06b6d4]';
    if (score >= 40) return 'bg-[#F59E0B]';
    return 'bg-[#ef4444]';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'good') return <CheckCircle2 className="h-4 w-4 text-[#10B981]" />;
    if (status === 'average') return <AlertCircle className="h-4 w-4 text-[#F59E0B]" />;
    return <AlertCircle className="h-4 w-4 text-[#ef4444]" />;
  };

  return (
    <Card className="hover-lift border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#10B981]" />
            <CardTitle>Financial Health Score</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xl px-4 py-2 ${getGradeColor(healthScore.grade)}`}
          >
            {healthScore.grade}
          </Badge>
        </div>
        <CardDescription>
          AI-powered analysis of your overall financial wellness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#10B981] p-1"
            >
              <div className="w-full h-full rounded-full bg-card flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className={`${getGradeColor(healthScore.grade)}`}>
                    {healthScore.overall}
                  </div>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          {Object.entries(healthScore.breakdown).map(([key, data]: [string, any], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.status)}
                  <span className="capitalize">{key}</span>
                </div>
                <span className="text-muted-foreground">{data.score}/100</span>
              </div>
              <Progress value={data.score} className="h-2" />
              <p className="text-xs text-muted-foreground">{data.message}</p>
            </motion.div>
          ))}
        </div>

        {/* Improvements Section */}
        {healthScore.improvements.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {healthScore.improvements.length} Improvement Suggestions
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-90' : ''}`}
              />
            </Button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {healthScore.improvements.map((improvement: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <TrendingUp className="h-4 w-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <p className="text-xs">{improvement}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#10B981] hover:from-[#1e40af] hover:to-[#059669]"
          onClick={() => {
            toast.success("📊 Detailed financial health report downloading...");
          }}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          View Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
}
