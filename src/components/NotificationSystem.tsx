
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, MessageSquare, ThumbsUp, X } from "lucide-react";

interface Notification {
  id: string;
  type: 'answer' | 'vote' | 'accept' | 'comment';
  title: string;
  message: string;
  questionId?: string;
  isRead: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "answer",
    title: "New answer on your question",
    message: "Someone answered your question about SQL joins",
    questionId: "1",
    isRead: false,
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    type: "vote",
    title: "Your answer was upvoted",
    message: "Your answer received an upvote",
    questionId: "2",
    isRead: false,
    createdAt: "4 hours ago"
  },
  {
    id: "3",
    type: "accept",
    title: "Your answer was accepted",
    message: "The question author accepted your answer",
    questionId: "3",
    isRead: true,
    createdAt: "1 day ago"
  }
];

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'vote':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'accept':
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.createdAt}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
