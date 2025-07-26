import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Palette, User, Download } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your TaskFlow experience</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Profile</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="text-center">
            <h4 className="font-medium text-foreground">Productivity Champion</h4>
            <p className="text-sm text-muted-foreground">Member since January 2024</p>
          </div>
          
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming tasks</p>
            </div>
            <Switch id="task-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="wellness-nudges">Wellness Nudges</Label>
              <p className="text-sm text-muted-foreground">Gentle reminders for self-care</p>
            </div>
            <Switch id="wellness-nudges" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-summary">Daily Summary</Label>
              <p className="text-sm text-muted-foreground">End-of-day progress report</p>
            </div>
            <Switch id="daily-summary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="motivational-quotes">Motivational Messages</Label>
              <p className="text-sm text-muted-foreground">Inspiring quotes and encouragement</p>
            </div>
            <Switch id="motivational-quotes" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-primary rounded-full border-2 border-primary"></div>
              <div className="w-8 h-8 bg-wellness rounded-full border-2 border-transparent hover:border-wellness cursor-pointer"></div>
              <div className="w-8 h-8 bg-accent rounded-full border-2 border-transparent hover:border-accent cursor-pointer"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-transparent hover:border-purple-500 cursor-pointer"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Task Category</Label>
            <Select defaultValue="personal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">🏢 Work</SelectItem>
                <SelectItem value="home">🏠 Home</SelectItem>
                <SelectItem value="wellness">🌱 Wellness</SelectItem>
                <SelectItem value="personal">👤 Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Week Starts On</Label>
            <Select defaultValue="monday">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smart-scheduling">Smart Scheduling</Label>
              <p className="text-sm text-muted-foreground">AI-powered task time suggestions</p>
            </div>
            <Switch id="smart-scheduling" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Export Data */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Management</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your tasks and analytics data for backup or transfer to another app.
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Tasks
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}