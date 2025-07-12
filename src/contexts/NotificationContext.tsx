import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  questionId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Dummy notifications
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'New Answer',
    message: 'Someone answered your question about SQL joins',
    isRead: false,
    createdAt: '5 minutes ago',
    questionId: '1'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Developer123 commented on your answer',
    isRead: false,
    createdAt: '1 hour ago'
  },
  {
    id: '3',
    type: 'mention',
    title: 'You were mentioned',
    message: '@User Name mentioned you in a comment',
    isRead: false,
    createdAt: '2 hours ago'
  },
  {
    id: '4',
    type: 'answer',
    title: 'New Answer',
    message: 'Your question about React hooks has a new answer',
    isRead: true,
    createdAt: '1 day ago'
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
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

  const addNotification = (newNotification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: 'just now'
    };
    setNotifications(prev => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}