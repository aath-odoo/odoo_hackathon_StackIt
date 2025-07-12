
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { QuestionCard } from "@/components/QuestionCard";
import { User, Calendar, Award, MessageSquare, ThumbsUp, Settings } from "lucide-react";

interface UserStats {
  questionsAsked: number;
  answersGiven: number;
  reputation: number;
  acceptedAnswers: number;
  totalVotes: number;
  joinDate: string;
}

const mockUserStats: UserStats = {
  questionsAsked: 12,
  answersGiven: 47,
  reputation: 1250,
  acceptedAnswers: 23,
  totalVotes: 156,
  joinDate: "January 2024"
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
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'activity'>('questions');
  const [isOwnProfile] = useState(true); // Mock - would check if viewing own profile

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} notificationCount={3} />
      
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
                  <h1 className="text-3xl font-bold">User Name</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Member since {mockUserStats.joinDate}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {mockUserStats.reputation} reputation
                    </Badge>
                    <Badge variant="secondary">Active Contributor</Badge>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{mockUserStats.questionsAsked}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{mockUserStats.answersGiven}</div>
              <div className="text-sm text-muted-foreground">Answers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{mockUserStats.acceptedAnswers}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{mockUserStats.totalVotes}</div>
              <div className="text-sm text-muted-foreground">Votes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{mockUserStats.reputation}</div>
              <div className="text-sm text-muted-foreground">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'questions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('questions')}
            className={activeTab === 'questions' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Questions ({mockUserStats.questionsAsked})
          </Button>
          <Button
            variant={activeTab === 'answers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('answers')}
            className={activeTab === 'answers' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Answers ({mockUserStats.answersGiven})
          </Button>
          <Button
            variant={activeTab === 'activity' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('activity')}
            className={activeTab === 'activity' ? 'bg-orange-500 hover:bg-orange-600' : ''}
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
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
