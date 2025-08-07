import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Calendar, Clock, Award, XCircle } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { useCategories } from "@/context/CategoryContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const { tasks } = useTasks();
  const { categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredTasks = selectedCategoryId
    ? tasks.filter(task => task.categoryId === selectedCategoryId)
    : tasks;

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.completed);
  const completedTasksCount = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const totalTimeSpent = completedTasks.reduce((acc, task) => acc + task.duration, 0);

  const categoryStats = categories.map(category => {
    const categoryTasks = tasks.filter(task => task.categoryId === category.id);
    const completedCategoryTasks = categoryTasks.filter(task => task.completed);
    return {
      ...category,
      total: categoryTasks.length,
      completed: completedCategoryTasks.length,
    };
  });

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
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-xl font-bold text-primary">{totalTasks} tasks</p>
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
              <p className="text-xl font-bold text-wellness">{completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-accent/5 to-amber-50 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-xl font-bold text-accent-foreground">{completedTasksCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Time Spent</p>
              <p className="text-xl font-bold text-purple-700">{totalTimeSpent} minutes</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Category Performance</h3>
          </div>
          
          <div className="space-y-4">
            {categoryStats.map(category => {
              const percentage = category.total > 0 ? (category.completed / category.total) * 100 : 0;
              return (
                <div 
                  key={category.id} 
                  className={cn(
                    `p-4 rounded-lg bg-gradient-to-r cursor-pointer hover:shadow-md transition-shadow`,
                    selectedCategoryId === category.id && "ring-2 ring-offset-2 ring-primary"
                  )}
                  style={{border: `1px solid ${category.color}`, background: `linear-gradient(to right, ${category.color}20, ${category.color}10)`}}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category.label}</span>
                    <Badge variant="outline" className="bg-background/70">
                      {Math.round(percentage)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{category.completed} completed</span>
                    <span>{category.total} total</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Achievements</h3>
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

      {selectedCategoryId && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Completed {categories.find(c => c.id === selectedCategoryId)?.label} Tasks</h3>
            <Button variant="outline" onClick={() => setSelectedCategoryId(null)}>
              <XCircle className="h-4 w-4 mr-2" />
              View All Tasks
            </Button>
          </div>
          <div className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <span className="font-medium text-sm">{task.title}</span>
                  <Badge variant="secondary">{task.duration} min</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No completed tasks in this category yet.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}