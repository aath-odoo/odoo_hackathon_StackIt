
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ChevronUp, ChevronDown, CheckCircle, MessageSquare, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Answer {
  id: string;
  content: string;
  author: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: number;
  isAnswered: boolean;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

// Mock data - in a real app this would come from an API
const mockQuestion: Question = {
  id: "1",
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: `I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First Name, and column 2 consists of last name I want a column to combine both first name and last name.

For example:
- Column 1: John
- Column 2: Doe
- Result Column: John Doe

I've tried using CONCAT but I'm getting syntax errors. Can someone help me with the correct SQL syntax?`,
  tags: ["SQL", "JOIN", "CONCAT"],
  author: "User Name",
  votes: 8,
  answers: 3,
  isAnswered: true,
  createdAt: "2 hours ago",
  userVote: null
};

const mockAnswers: Answer[] = [
  {
    id: "1",
    content: `You can use the CONCAT function to combine columns in SQL:

\`\`\`sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM your_table;
\`\`\`

Alternatively, you can use the || operator in some databases:

\`\`\`sql
SELECT first_name || ' ' || last_name AS full_name
FROM your_table;
\`\`\`

The first approach works in MySQL, SQL Server, and PostgreSQL. The second approach works in SQLite and PostgreSQL.`,
    author: "SQLExpert",
    votes: 15,
    isAccepted: true,
    createdAt: "1 hour ago",
    userVote: null
  },
  {
    id: "2",
    content: `Another approach is to create a new column and update it:

\`\`\`sql
ALTER TABLE your_table ADD COLUMN full_name VARCHAR(255);
UPDATE your_table SET full_name = CONCAT(first_name, ' ', last_name);
\`\`\`

This creates a permanent column in your table with the combined values.`,
    author: "DatabaseGuru",
    votes: 7,
    isAccepted: false,
    createdAt: "30 minutes ago",
    userVote: null
  }
];

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question>(mockQuestion);
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn] = useState(true); // Mock authentication state

  const handleVote = (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote.",
        variant: "destructive"
      });
      return;
    }

    if (targetType === 'question') {
      setQuestion(prev => {
        const currentVote = prev.userVote;
        let newVotes = prev.votes;
        let newUserVote: 'up' | 'down' | null = type;

        if (currentVote === type) {
          // Remove vote
          newVotes = type === 'up' ? prev.votes - 1 : prev.votes + 1;
          newUserVote = null;
        } else if (currentVote) {
          // Change vote
          newVotes = type === 'up' ? prev.votes + 2 : prev.votes - 2;
        } else {
          // New vote
          newVotes = type === 'up' ? prev.votes + 1 : prev.votes - 1;
        }

        return { ...prev, votes: newVotes, userVote: newUserVote };
      });
    } else if (targetId) {
      setAnswers(prev => prev.map(answer => {
        if (answer.id === targetId) {
          const currentVote = answer.userVote;
          let newVotes = answer.votes;
          let newUserVote: 'up' | 'down' | null = type;

          if (currentVote === type) {
            newVotes = type === 'up' ? answer.votes - 1 : answer.votes + 1;
            newUserVote = null;
          } else if (currentVote) {
            newVotes = type === 'up' ? answer.votes + 2 : answer.votes - 2;
          } else {
            newVotes = type === 'up' ? answer.votes + 1 : answer.votes - 1;
          }

          return { ...answer, votes: newVotes, userVote: newUserVote };
        }
        return answer;
      }));
    }

    toast({
      title: "Vote recorded",
      description: `Your ${type}vote has been recorded.`,
    });
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!isLoggedIn || question.author !== "User Name") {
      toast({
        title: "Permission denied",
        description: "Only the question author can accept answers.",
        variant: "destructive"
      });
      return;
    }

    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId ? !answer.isAccepted : false
    })));

    setQuestion(prev => ({ ...prev, isAnswered: true }));

    toast({
      title: "Answer accepted",
      description: "The answer has been marked as accepted.",
    });
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an answer.",
        variant: "destructive"
      });
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const answer: Answer = {
        id: Date.now().toString(),
        content: newAnswer,
        author: "Current User",
        votes: 0,
        isAccepted: false,
        createdAt: "just now",
        userVote: null
      };

      setAnswers(prev => [...prev, answer]);
      setQuestion(prev => ({ ...prev, answers: prev.answers + 1 }));
      setNewAnswer("");
      setIsSubmitting(false);

      toast({
        title: "Answer submitted",
        description: "Your answer has been posted successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} notificationCount={3} />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Back to Questions
        </Button>

        {/* Question */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('up', 'question')}
                  className={`p-2 ${question.userVote === 'up' ? 'text-orange-500' : 'text-muted-foreground'}`}
                >
                  <ChevronUp className="h-6 w-6" />
                </Button>
                <span className="text-2xl font-bold">{question.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('down', 'question')}
                  className={`p-2 ${question.userVote === 'down' ? 'text-orange-500' : 'text-muted-foreground'}`}
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
                
                <div className="prose max-w-none mb-4">
                  <p className="whitespace-pre-wrap">{question.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      asked {question.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="text-orange-500">{question.author}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers} answers</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{answers.length} Answers</h2>
          
          <div className="space-y-6">
            {answers
              .sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0))
              .map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? "border-green-500 border-2" : ""}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('up', 'answer', answer.id)}
                        className={`p-2 ${answer.userVote === 'up' ? 'text-orange-500' : 'text-muted-foreground'}`}
                      >
                        <ChevronUp className="h-6 w-6" />
                      </Button>
                      <span className="text-xl font-bold">{answer.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('down', 'answer', answer.id)}
                        className={`p-2 ${answer.userVote === 'down' ? 'text-orange-500' : 'text-muted-foreground'}`}
                      >
                        <ChevronDown className="h-6 w-6" />
                      </Button>
                      
                      {question.author === "User Name" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className={`p-2 ${answer.isAccepted ? 'text-green-500' : 'text-muted-foreground'}`}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <div className="flex items-center gap-2 mb-3 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Accepted Answer</span>
                        </div>
                      )}
                      
                      <div className="prose max-w-none mb-4">
                        <p className="whitespace-pre-wrap">{answer.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          answered {answer.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="text-orange-500">{answer.author}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Answer Form */}
        {isLoggedIn ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here..."
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? "Posting..." : "Post Your Answer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You must be logged in to post an answer.
              </p>
              <Button onClick={() => navigate("/login")}>
                Log In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
