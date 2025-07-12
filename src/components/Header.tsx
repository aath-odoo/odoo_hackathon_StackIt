
import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationSystem } from "@/components/NotificationSystem";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  notificationCount?: number;
  isLoggedIn?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({ notificationCount = 0, isLoggedIn = false, onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    navigate('/login');
  };

  return (
    <>
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              StackIt
            </Link>
            

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Button 
                    onClick={() => navigate('/ask')} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6"
                  >
                    Ask Question
                  </Button>
                  
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2"
                    >
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-500">
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  
                </>
              ) : (
                <Button onClick={() => navigate('/login')} variant="outline">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <NotificationSystem 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}
