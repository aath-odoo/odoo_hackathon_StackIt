
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { QuestionCard } from "@/components/QuestionCard";
import { ActivityChart } from "@/components/ActivityChart";
import { User, Calendar, Award, MessageSquare, ThumbsUp, Settings, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserActivity } from "@/hooks/useUserActivity";

interface UserStats {
  questionsAsked: number;
  answersGiven: number;
  reputation: number;
  acceptedAnswers: number;
  totalVotes: number;
  joinDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  timezone: string;
  bio: string;
}


const initialUserProfile: UserProfile = {
  name: "User Name",
  email: "user@example.com",
  avatar: "",
  timezone: "UTC",
  bio: "Software developer passionate about solving complex problems."
};

const mockUserQuestions = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner...",
    tags: ["SQL", "JOIN"],
    author: "User Name",
    votes: 8,
    answers: 2,
    isAnswered: true,
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    title: "Best practices for database indexing",
    description: "What are the best practices when creating indexes...",
    tags: ["Database", "Indexing", "Performance"],
    author: "User Name",
    votes: 15,
    answers: 5,
    isAnswered: true,
    createdAt: "1 week ago"
  }
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { activities } = useUserActivity();
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'activity'>('questions');
  const [isOwnProfile] = useState(true); // Mock - would check if viewing own profile
  const [userProfile, setUserProfile] = useState<UserProfile>(user ? { 
    name: user.username, 
    email: user.email, 
    avatar: user.avatar || "", 
    timezone: "UTC", 
    bio: "Software developer passionate about solving complex problems." 
  } : initialUserProfile);
  const [editProfile, setEditProfile] = useState<UserProfile>(userProfile);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Calculate dynamic user stats from activities
  const userStats = useMemo(() => {
    const totalQuestions = activities.reduce((sum, activity) => sum + activity.questions, 0);
    const totalAnswers = activities.reduce((sum, activity) => sum + activity.answers, 0);
    const reputation = (totalQuestions * 5) + (totalAnswers * 10); // Basic reputation calculation
    
    return {
      questionsAsked: totalQuestions,
      answersGiven: totalAnswers,
      reputation,
      acceptedAnswers: Math.floor(totalAnswers * 0.3), // Assume 30% acceptance rate
      totalVotes: Math.floor((totalQuestions + totalAnswers) * 2.5), // Assume average votes
      joinDate: "January 2024"
    };
  }, [activities]);

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      const newProfile = { 
        name: user.username, 
        email: user.email, 
        avatar: user.avatar || "", 
        timezone: "UTC", 
        bio: "Software developer passionate about solving complex problems." 
      };
      setUserProfile(newProfile);
      setEditProfile(newProfile);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Member since {userStats.joinDate}
                  </p>
                  {userProfile.bio && (
                    <p className="text-muted-foreground mt-2">{userProfile.bio}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {userStats.reputation} reputation
                    </Badge>
                    <Badge variant="secondary">Active Contributor</Badge>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={editProfile.name}
                          onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editProfile.email}
                          onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={editProfile.bio}
                          onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={editProfile.timezone} onValueChange={(value) => setEditProfile({...editProfile, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="avatar"
                            value={editProfile.avatar}
                            onChange={(e) => setEditProfile({...editProfile, avatar: e.target.value})}
                            placeholder="Avatar URL..."
                          />
                          <Button variant="outline" size="sm" className="border-border hover:bg-accent hover:text-accent-foreground">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border hover:bg-accent hover:text-accent-foreground">
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          setUserProfile(editProfile);
                          // Update the auth context with new username
                          updateUser({ 
                            username: editProfile.name, 
                            email: editProfile.email,
                            avatar: editProfile.avatar 
                          });
                          setIsEditDialogOpen(false);
                          toast({
                            title: "Profile updated",
                            description: "Your profile has been successfully updated.",
                          });
                        }}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.questionsAsked}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.answersGiven}</div>
              <div className="text-sm text-muted-foreground">Answers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.acceptedAnswers}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.totalVotes}</div>
              <div className="text-sm text-muted-foreground">Votes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.reputation}</div>
              <div className="text-sm text-muted-foreground">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'questions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('questions')}
            className={activeTab === 'questions' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Questions ({userStats.questionsAsked})
            </Button>
          <Button
            variant={activeTab === 'answers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('answers')}
            className={activeTab === 'answers' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Answers ({userStats.answersGiven})
            </Button>
          <Button
            variant={activeTab === 'activity' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('activity')}
            className={activeTab === 'activity' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
          >
            <Award className="h-4 w-4 mr-2" />
            Activity
          </Button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Questions</h2>
              <div className="bg-card rounded-lg border">
                {mockUserQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Answers</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    No recent answers to display.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Activity Overview</h2>
              
              <ActivityChart />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Answer accepted on "How to join 2 columns in SQL"</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Received upvote on "Database indexing practices"</span>
                      <span className="text-muted-foreground">4 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Asked new question "SQL JOIN performance"</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
