import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Award } from "lucide-react";

interface ProgressTrackerProps {
  todayCompleted: number;
  todayTotal: number;
  weeklyStreak: number;
  totalCompleted: number;
}

export function ProgressTracker({ 
  todayCompleted, 
  todayTotal, 
  weeklyStreak, 
  totalCompleted 
}: ProgressTrackerProps) {
  const todayProgress = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;
  
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today! 🌱";
    if (streak === 1) return "Great start! Day 1 complete! 🌟";
    if (streak < 7) return `Amazing! ${streak} days strong! 🔥`;
    return `Incredible! ${streak} days of consistency! 🏆`;
  };

  const getProgressMessage = (progress: number) => {
    if (progress === 0) return "Ready to begin? Every journey starts with one step! 🚀";
    if (progress < 50) return "You're on your way! Keep that momentum going! 💪";
    if (progress < 100) return "So close! You've got this, champion! ⭐";
    return "Today conquered! You're absolutely amazing! 🎉";
  };

  return (
    <div className="space-y-4">
      {/* Today's Progress */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary-glow/10 border-primary/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Today's Progress</span>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {todayCompleted}/{todayTotal}
            </Badge>
          </div>
          
          <Progress 
            value={todayProgress} 
            className="h-2 bg-primary/10"
          />
          
          <p className="text-xs text-muted-foreground font-medium">
            {getProgressMessage(todayProgress)}
          </p>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly Streak */}
        <Card className="p-3 bg-gradient-to-r from-wellness/5 to-emerald-50 border-wellness/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-wellness" />
            <span className="text-xs font-medium text-foreground">Streak</span>
          </div>
          <p className="text-lg font-bold text-wellness">{weeklyStreak} days</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {getStreakMessage(weeklyStreak)}
          </p>
        </Card>

        {/* Total Achievements */}
        <Card className="p-3 bg-gradient-to-r from-accent/5 to-amber-50 border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-accent-foreground" />
            <span className="text-xs font-medium text-foreground">Total</span>
          </div>
          <p className="text-lg font-bold text-accent-foreground">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            tasks completed! 🎯
          </p>
        </Card>
      </div>
    </div>
  );
}