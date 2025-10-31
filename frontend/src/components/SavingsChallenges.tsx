import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy,
  Target,
  Calendar,
  Coins,
  Flame,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { generateSavingsChallenges } from "../utils/advancedAI";
import { mockData, formatCurrency } from "../mockData";
import { toast } from "sonner@2.0.3";

export function SavingsChallenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generatedChallenges = generateSavingsChallenges(mockData);
    setChallenges(generatedChallenges);
    
    // Load saved progress
    const saved = localStorage.getItem('finai_challenges');
    if (saved) {
      const data = JSON.parse(saved);
      setActiveChallenges(new Set(data.active || []));
      setCompletedChallenges(new Set(data.completed || []));
    }
  }, []);

  const handleStartChallenge = (challengeId: string) => {
    const newActive = new Set(activeChallenges);
    newActive.add(challengeId);
    setActiveChallenges(newActive);
    
    // Save to localStorage
    localStorage.setItem('finai_challenges', JSON.stringify({
      active: Array.from(newActive),
      completed: Array.from(completedChallenges)
    }));
    
    toast.success("🎯 Challenge accepted! Good luck!");
  };

  const handleCompleteChallenge = (challenge: any) => {
    const newActive = new Set(activeChallenges);
    const newCompleted = new Set(completedChallenges);
    
    newActive.delete(challenge.id);
    newCompleted.add(challenge.id);
    
    setActiveChallenges(newActive);
    setCompletedChallenges(newCompleted);
    
    // Save to localStorage
    localStorage.setItem('finai_challenges', JSON.stringify({
      active: Array.from(newActive),
      completed: Array.from(newCompleted)
    }));
    
    // Show celebration
    toast.success(`🎉 Challenge completed! You earned ${challenge.reward} reward points!`, {
      duration: 5000
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-[#10B981]';
      case 'medium': return 'bg-[#F59E0B]';
      case 'hard': return 'bg-[#ef4444]';
      default: return 'bg-muted';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return difficulty;
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#F59E0B]" />
            <CardTitle>Savings Challenges</CardTitle>
          </div>
          <Badge variant="outline" className="text-[#10B981]">
            <Coins className="h-3 w-3 mr-1" />
            {Array.from(completedChallenges).reduce((sum, id) => {
              const challenge = challenges.find(c => c.id === id);
              return sum + (challenge?.reward || 0);
            }, 0)} pts
          </Badge>
        </div>
        <CardDescription>
          Complete challenges to save money and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Challenges */}
          {Array.from(activeChallenges).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#ef4444]" />
                <h4 className="text-sm">Active Challenges</h4>
              </div>
              {challenges
                .filter(c => activeChallenges.has(c.id))
                .map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border-2 border-[#10B981] bg-[#10B981]/5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{challenge.icon}</span>
                          <h4>{challenge.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress simulation */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span className="text-muted-foreground">2/{challenge.duration} days</span>
                      </div>
                      <Progress value={(2 / challenge.duration) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {formatCurrency(challenge.target)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {challenge.duration}d
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteChallenge(challenge)}
                        className="bg-[#10B981] hover:bg-[#059669]"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          {/* Available Challenges */}
          <div className="space-y-3">
            <h4 className="text-sm text-muted-foreground">
              {activeChallenges.size > 0 ? 'More Challenges' : 'Available Challenges'}
            </h4>
            {challenges
              .filter(c => !activeChallenges.has(c.id) && !completedChallenges.has(c.id))
              .slice(0, 3)
              .map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{challenge.icon}</span>
                        <h4>{challenge.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`${getDifficultyColor(challenge.difficulty)} text-white border-0 text-xs`}
                        >
                          {getDifficultyBadge(challenge.difficulty)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Save {formatCurrency(challenge.target)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.duration} days
                      </div>
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        <Coins className="h-3 w-3" />
                        +{challenge.reward} pts
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                    >
                      Start
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Completed Challenges Summary */}
          {completedChallenges.size > 0 && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-[#10B981]/10 to-[#1E3A8A]/10 border border-[#10B981]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                  <div>
                    <h4>Challenges Completed</h4>
                    <p className="text-xs text-muted-foreground">
                      {completedChallenges.size} challenges · Keep up the great work!
                    </p>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-[#F59E0B]" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
