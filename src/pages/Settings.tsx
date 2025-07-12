import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Palette, Moon, Sun, Save } from "lucide-react";

interface Settings {
  theme: string;
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
}

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "theme-dark", label: "Dark", icon: Moon },
  { value: "theme-dracula", label: "Dracula", icon: Moon },
  { value: "theme-dracula-light", label: "Dracula Light", icon: Sun },
  { value: "theme-tokyo-night", label: "Tokyo Night", icon: Moon },
  { value: "theme-tokyo-light", label: "Tokyo Light", icon: Sun },
  { value: "theme-ayu", label: "Ayu Dark", icon: Moon },
  { value: "theme-ayu-light", label: "Ayu Light", icon: Sun },
  { value: "theme-github-dark", label: "GitHub Dark", icon: Moon },
  { value: "theme-github-light", label: "GitHub Light", icon: Sun },
  { value: "theme-one-dark-pro", label: "One Dark Pro", icon: Moon },
  { value: "theme-one-light-pro", label: "One Light Pro", icon: Sun },
  { value: "theme-monokai-pro", label: "Monokai Pro", icon: Moon },
  { value: "theme-monokai-light", label: "Monokai Light", icon: Sun },
  { value: "theme-night-owl", label: "Night Owl", icon: Moon },
  { value: "theme-light-owl", label: "Light Owl", icon: Sun },
  { value: "theme-shades-of-purple", label: "Shades of Purple", icon: Moon },
  { value: "theme-shades-of-purple-light", label: "Shades of Purple Light", icon: Sun },
  { value: "theme-atom-one-light", label: "Atom One Light", icon: Sun }
];

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    notifications: true,
    emailUpdates: false,
    language: "en"
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply theme and language
  useEffect(() => {
    const body = document.body;
    // Remove all theme classes
    body.className = body.className.replace(/theme-\w+/g, '');
    
    if (settings.theme !== "light") {
      body.classList.add(settings.theme);
    }
    
    // Apply language to document
    document.documentElement.lang = settings.language;
  }, [settings.theme, settings.language]);

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => {
                      const IconComponent = theme.icon;
                      return (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{theme.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new answers and comments</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly digest and important updates</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => updateSetting('emailUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="language">Display Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}