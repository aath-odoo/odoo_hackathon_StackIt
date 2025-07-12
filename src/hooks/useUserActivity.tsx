import { useState, useEffect } from 'react';

export interface UserActivity {
  date: string;
  questions: number;
  answers: number;
  total: number;
}

export interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels
}

export function useUserActivity() {
  const [activities, setActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    const loadActivities = () => {
      const stored = localStorage.getItem('userActivities');
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    };

    loadActivities();

    // Listen for activity updates
    const handleActivityUpdate = () => {
      loadActivities();
    };

    window.addEventListener('activityUpdated', handleActivityUpdate);
    return () => window.removeEventListener('activityUpdated', handleActivityUpdate);
  }, []);

  const recordActivity = (type: 'question' | 'answer') => {
    const today = new Date().toISOString().split('T')[0];
    const existingActivities = JSON.parse(localStorage.getItem('userActivities') || '[]') as UserActivity[];
    
    const todayIndex = existingActivities.findIndex(activity => activity.date === today);
    
    if (todayIndex >= 0) {
      // Update existing activity
      if (type === 'question') {
        existingActivities[todayIndex].questions += 1;
      } else {
        existingActivities[todayIndex].answers += 1;
      }
      existingActivities[todayIndex].total = 
        existingActivities[todayIndex].questions + existingActivities[todayIndex].answers;
    } else {
      // Create new activity for today
      const newActivity: UserActivity = {
        date: today,
        questions: type === 'question' ? 1 : 0,
        answers: type === 'answer' ? 1 : 0,
        total: 1
      };
      existingActivities.push(newActivity);
    }

    localStorage.setItem('userActivities', JSON.stringify(existingActivities));
    window.dispatchEvent(new CustomEvent('activityUpdated'));
  };


  const generateActivityData = (): ActivityData[] => {
    const data: ActivityData[] = [];
    const today = new Date();
    
    // Generate 365 days of activity data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const userActivity = activities.find(activity => activity.date === dateStr);
      const count = userActivity ? userActivity.total : 0;
      
      let level = 0;
      if (count > 0) {
        if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 6) level = 3;
        else level = 4;
      }
      
      data.push({
        date: dateStr,
        count,
        level
      });
    }
    
    return data;
  };

  return {
    activities,
    recordActivity,
    generateActivityData
  };
}

// Standalone function that can be used without hooks
export const recordActivityStandalone = (type: 'question' | 'answer') => {
  const today = new Date().toISOString().split('T')[0];
  const existingActivities = JSON.parse(localStorage.getItem('userActivities') || '[]') as UserActivity[];
  
  const todayIndex = existingActivities.findIndex(activity => activity.date === today);
  
  if (todayIndex >= 0) {
    if (type === 'question') {
      existingActivities[todayIndex].questions += 1;
    } else {
      existingActivities[todayIndex].answers += 1;
    }
    existingActivities[todayIndex].total = 
      existingActivities[todayIndex].questions + existingActivities[todayIndex].answers;
  } else {
    const newActivity: UserActivity = {
      date: today,
      questions: type === 'question' ? 1 : 0,
      answers: type === 'answer' ? 1 : 0,
      total: 1
    };
    existingActivities.push(newActivity);
  }

  localStorage.setItem('userActivities', JSON.stringify(existingActivities));
  window.dispatchEvent(new CustomEvent('activityUpdated'));
};