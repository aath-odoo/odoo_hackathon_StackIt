import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Activity } from "lucide-react";
import { useUserActivity, ActivityData } from "@/hooks/useUserActivity";

export function ActivityChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { generateActivityData } = useUserActivity();
  const activityData = useMemo(() => generateActivityData(), [generateActivityData]);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Group data by weeks
  const weeks = useMemo(() => {
    const weeksArray: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    activityData.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      
      if (index === 0) {
        // Fill the beginning of the first week with empty days
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', count: 0, level: 0 });
        }
      }
      
      currentWeek.push(day);
      
      if (dayOfWeek === 6 || index === activityData.length - 1) {
        // End of week or last day
        if (currentWeek.length < 7) {
          // Fill the end of the last week
          while (currentWeek.length < 7) {
            currentWeek.push({ date: '', count: 0, level: 0 });
          }
        }
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeksArray;
  }, [activityData]);
  
  const getIntensityColor = (level: number): string => {
    switch (level) {
      case 0: return 'bg-muted';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-400 dark:bg-green-600';
      case 4: return 'bg-green-500 dark:bg-green-500';
      default: return 'bg-muted';
    }
  };
  
  const totalContributions = activityData.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [activityData]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Overview
          </CardTitle>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>{totalContributions} contributions in {selectedYear}</span>
            <span>Current streak: {currentStreak} days</span>
          </div>
          
          {/* Chart */}
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex text-xs text-muted-foreground ml-8">
              {months.map((month, index) => (
                <div 
                  key={month} 
                  className="flex-1 text-center"
                  style={{ 
                    visibility: index % 2 === 0 ? 'visible' : 'hidden' 
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
            
            {/* Grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 text-xs text-muted-foreground mr-2">
                <div className="h-3"></div> {/* Spacer for month labels */}
                {days.map((day, index) => (
                  <div 
                    key={day} 
                    className="h-3 flex items-center"
                    style={{ 
                      visibility: index % 2 === 1 ? 'visible' : 'hidden' 
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Activity grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(day.level)} transition-colors hover:ring-1 hover:ring-primary`}
                        title={day.date ? `${day.count} contributions on ${day.date}` : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}