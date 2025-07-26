import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Smile, Sun } from "lucide-react";

const wellnessActivities = [
  {
    icon: <Heart className="h-4 w-4" />,
    title: "Take 5 deep breaths",
    description: "Center yourself with mindful breathing",
    duration: "2 min",
    color: "from-wellness/10 to-emerald-50 border-wellness/30"
  },
  {
    icon: <Coffee className="h-4 w-4" />,
    title: "Hydration check",
    description: "Have a glass of water and thank your body",
    duration: "1 min",
    color: "from-primary/10 to-blue-50 border-primary/30"
  },
  {
    icon: <Sun className="h-4 w-4" />,
    title: "Step outside",
    description: "Get some fresh air and vitamin D",
    duration: "5 min",
    color: "from-accent/10 to-amber-50 border-accent/30"
  },
  {
    icon: <Smile className="h-4 w-4" />,
    title: "Gratitude moment",
    description: "Think of one thing you're grateful for today",
    duration: "2 min",
    color: "from-purple-100 to-pink-50 border-purple-200"
  }
];

export function WellnessNudge() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show wellness nudge every 30 minutes (for demo, show after 5 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Rotate through different activities
      const interval = setInterval(() => {
        setCurrentActivity((prev) => (prev + 1) % wellnessActivities.length);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Show again after some time
    setTimeout(() => {
      setIsVisible(true);
    }, 60000); // 1 minute for demo
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Show a different activity next time
    setCurrentActivity((prev) => (prev + 1) % wellnessActivities.length);
    setTimeout(() => {
      setIsVisible(true);
    }, 120000); // 2 minutes for demo
  };

  if (!isVisible) return null;

  const activity = wellnessActivities[currentActivity];

  return (
    <Card className={`p-4 bg-gradient-to-r ${activity.color} animate-fade-in`}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-wellness animate-gentle-bounce">
            {activity.icon}
          </div>
          <span className="text-sm font-semibold text-foreground">Wellness Nudge</span>
          <span className="text-xs text-muted-foreground bg-background/70 px-2 py-0.5 rounded-full">
            {activity.duration}
          </span>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground text-sm mb-1">
            {activity.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleComplete}
            className="bg-wellness hover:bg-wellness/90 text-wellness-foreground flex-1"
          >
            Done! 🌟
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDismiss}
            className="bg-background/70"
          >
            Later
          </Button>
        </div>
      </div>
    </Card>
  );
}