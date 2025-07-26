import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Calendar, Clock, Award } from "lucide-react";

export default function Analytics() {
  const weeklyData = [
    { day: "Mon", completed: 8, total: 10 },
    { day: "Tue", completed: 12, total: 15 },
    { day: "Wed", completed: 6, total: 8 },
    { day: "Thu", completed: 14, total: 16 },
    { day: "Fri", completed: 10, total: 12 },
    { day: "Sat", completed: 5, total: 7 },
    { day: "Sun", completed: 4, total: 6 },
  ];

  const categoryStats = [
    { category: "Work", completed: 32, total: 40, color: "from-primary/20 to-primary/10 border-primary/30" },
    { category: "Wellness", completed: 18, total: 20, color: "from-wellness/20 to-wellness/10 border-wellness/30" },
    { category: "Home", completed: 15, total: 18, color: "from-accent/20 to-accent/10 border-accent/30" },
    { category: "Personal", completed: 8, total: 12, color: "from-purple-100 to-purple-50 border-purple-200" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your productivity journey</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-xl font-bold text-primary">73 tasks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-wellness/5 to-emerald-50 border-wellness/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-wellness/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-wellness" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-xl font-bold text-wellness">89%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-accent/5 to-amber-50 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Streak</p>
              <p className="text-xl font-bold text-accent-foreground">12 days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-xl font-bold text-purple-700">1,247</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Progress</h3>
          </div>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {day.completed}/{day.total}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Category Performance</h3>
          </div>
          
          <div className="space-y-4">
            {categoryStats.map((stat) => {
              const percentage = (stat.completed / stat.total) * 100;
              return (
                <div key={stat.category} className={`p-4 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{stat.category}</span>
                    <Badge variant="outline" className="bg-background/70">
                      {Math.round(percentage)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{stat.completed} completed</span>
                    <span>{stat.total} total</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-wellness/10 to-emerald-50 rounded-lg border border-wellness/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-wellness/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-wellness" />
              </div>
              <h4 className="font-medium mb-1">Early Bird</h4>
              <p className="text-xs text-muted-foreground">Completed morning tasks 7 days in a row</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg border border-primary/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">Goal Crusher</h4>
              <p className="text-xs text-muted-foreground">Exceeded weekly target by 20%</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-accent/10 to-amber-50 rounded-lg border border-accent/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h4 className="font-medium mb-1">Consistency Star</h4>
              <p className="text-xs text-muted-foreground">12-day productivity streak</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}