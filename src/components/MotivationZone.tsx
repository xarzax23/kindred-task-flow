import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Star, Sparkles } from "lucide-react";

const motivationalMessages = [
  {
    message: "Every small step counts. You're building something beautiful today! ✨",
    icon: <Sparkles className="h-5 w-5 text-accent" />
  },
  {
    message: "Your consistency is your superpower. Keep going, champion! 🌟",
    icon: <Star className="h-5 w-5 text-amber-500" />
  },
  {
    message: "Progress over perfection. You're doing amazing! 💙",
    icon: <Heart className="h-5 w-5 text-primary" />
  },
  {
    message: "Today is a fresh canvas. Paint it with purpose and joy! 🎨",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />
  },
  {
    message: "Your future self is cheering for today's efforts! 🌈",
    icon: <Heart className="h-5 w-5 text-wellness" />
  }
];

const timeBasedGreetings = {
  morning: "Good morning, beautiful soul! Ready to make today amazing? 🌅",
  afternoon: "Afternoon energy boost! You're doing wonderfully so far! ☀️",
  evening: "Evening reflection time. Celebrate today's wins, big and small! 🌙"
};

export function MotivationZone() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(timeBasedGreetings.morning);
    } else if (hour < 17) {
      setGreeting(timeBasedGreetings.afternoon);
    } else {
      setGreeting(timeBasedGreetings.evening);
    }

    // Rotate messages every 10 seconds
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Time-based greeting */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <p className="text-sm font-medium text-primary text-center">
          {greeting}
        </p>
      </Card>

      {/* Rotating motivational message */}
      <Card className="p-4 bg-gradient-to-r from-accent/5 to-amber-50 border-accent/20">
        <div className="flex items-center gap-3">
          <div className="animate-gentle-bounce">
            {motivationalMessages[currentMessage].icon}
          </div>
          <p className="text-sm text-foreground font-medium leading-relaxed animate-fade-in">
            {motivationalMessages[currentMessage].message}
          </p>
        </div>
      </Card>
    </div>
  );
}