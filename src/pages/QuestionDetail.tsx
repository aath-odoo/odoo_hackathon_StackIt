
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ChevronUp, ChevronDown, CheckCircle, MessageSquare, Clock, User, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useAuth } from "@/contexts/AuthContext";

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
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoggedIn, hasPermission } = useAuth();
  
  // Load question data from localStorage as well

  // Load question data based on ID
  useEffect(() => {
    // Load user questions from localStorage
    const userQuestions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
    
    // Mock data lookup - in real app this would be an API call
    const mockQuestions = {
      "1": {
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
      },
      "2": {
        id: "2",
        title: "React useState not updating state immediately",
        description: "I'm having trouble with useState not updating the state immediately when I call the setter function. The component doesn't re-render with the new value...",
        tags: ["React", "JavaScript", "Hooks"],
        author: "Developer123",
        votes: 15,
        answers: 4,
        isAnswered: true,
        createdAt: "4 hours ago",
        userVote: null
      },
      "3": {
        id: "3",
        title: "Best practices for TypeScript interface design",
        description: "What are the best practices when designing interfaces in TypeScript? Should I use interfaces or types? When should I extend vs when should I use union types?",
        tags: ["TypeScript", "Interfaces", "Best-Practices"],
        author: "TSLearner",
        votes: 23,
        answers: 6,
        isAnswered: true,
        createdAt: "1 day ago",
        userVote: null
      },
      "4": {
        id: "4",
        title: "CSS Grid vs Flexbox: When to use which?",
        description: "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the main differences and use cases for each?",
        tags: ["CSS", "Grid", "Flexbox"],
        author: "CSSNewbie",
        votes: 12,
        answers: 0,
        isAnswered: false,
        createdAt: "2 days ago",
        userVote: null
      },
      "5": {
        id: "5",
        title: "Python list comprehension vs for loop performance",
        description: "I've heard that list comprehensions are faster than for loops in Python. Is this always true? When should I use each approach?",
        tags: ["Python", "Performance", "List-Comprehension"],
        author: "PythonDev",
        votes: 18,
        answers: 3,
        isAnswered: true,
        createdAt: "3 days ago",
        userVote: null
      }
    };

    // Check user questions first
    const userQuestion = userQuestions.find((q: any) => q.id === id);
    if (userQuestion) {
      setQuestion(userQuestion);
      // Load answers for this question from localStorage
      const storedAnswers = JSON.parse(localStorage.getItem(`answers_${id}`) || '[]');
      setAnswers(storedAnswers);
    } else {
      const foundQuestion = mockQuestions[id as keyof typeof mockQuestions];
      if (foundQuestion) {
        setQuestion(foundQuestion);
        setAnswers(id === "1" ? mockAnswers : []); // Only question 1 has answers for now
      } else {
        // Question not found, redirect to 404 or home
        navigate("/");
      }
    }
  }, [id, navigate]);

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
    if (!isLoggedIn || (question.author !== user?.username && !hasPermission('moderate'))) {
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

  const handleDeleteAnswer = (answerId: string) => {
    if (!hasPermission('moderate')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete answers.",
        variant: "destructive"
      });
      return;
    }

    if (confirm("Are you sure you want to delete this answer?")) {
      setAnswers(prev => prev.filter(answer => answer.id !== answerId));
      setQuestion(prev => ({ ...prev, answers: prev.answers - 1 }));
      
      // Update localStorage
      const currentAnswers = answers.filter(answer => answer.id !== answerId);
      localStorage.setItem(`answers_${question.id}`, JSON.stringify(currentAnswers));
      
      toast({
        title: "Answer deleted",
        description: "The answer has been removed.",
      });
    }
  };

  const handleDeleteQuestion = () => {
    if (!hasPermission('moderate')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete questions.",
        variant: "destructive"
      });
      return;
    }

    if (confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      // Remove from localStorage if it's a user question
      const userQuestions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
      const updatedQuestions = userQuestions.filter((q: any) => q.id !== question.id);
      localStorage.setItem('userQuestions', JSON.stringify(updatedQuestions));
      
      // Remove answers for this question
      localStorage.removeItem(`answers_${question.id}`);
      
      toast({
        title: "Question deleted",
        description: "The question has been removed.",
      });
      
      // Dispatch custom event to update Home page
      window.dispatchEvent(new CustomEvent('questionUpdated'));
      
      navigate("/");
    }
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
    setTimeout(async () => {
      const answer: Answer = {
        id: Date.now().toString(),
        content: newAnswer,
        author: user?.username || "Current User",
        votes: 0,
        isAccepted: false,
        createdAt: "just now",
        userVote: null
      };

      setAnswers(prev => [...prev, answer]);
      setQuestion(prev => ({ ...prev, answers: prev.answers + 1 }));
      
      // Save answers to localStorage
      const currentAnswers = JSON.parse(localStorage.getItem(`answers_${question.id}`) || '[]');
      currentAnswers.push(answer);
      localStorage.setItem(`answers_${question.id}`, JSON.stringify(currentAnswers));
      
      // Record activity
      import('@/hooks/useUserActivity').then(module => {
        module.recordActivityStandalone('answer');
      });
      
      setNewAnswer("");
      setIsSubmitting(false);

      toast({
        title: "Answer submitted",
        description: "Your answer has been posted successfully.",
      });
    }, 1000);
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center">
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
                  <MarkdownRenderer content={question.description} />
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
                       <span className="text-primary">{question.author}</span>
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <MessageSquare className="h-4 w-4" />
                     <span>{question.answers} answers</span>
                     {hasPermission('moderate') && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={handleDeleteQuestion}
                         className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     )}
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
                      
                       {(question.author === user?.username || hasPermission('moderate')) && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleAcceptAnswer(answer.id)}
                           className={`p-2 ${answer.isAccepted ? 'text-green-500' : 'text-muted-foreground'}`}
                         >
                           <CheckCircle className="h-6 w-6" />
                         </Button>
                       )}
                       
                       {hasPermission('moderate') && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDeleteAnswer(answer.id)}
                           className="p-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                         >
                           <Trash2 className="h-4 w-4" />
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
                        <MarkdownRenderer content={answer.content} />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          answered {answer.createdAt}
                        </span>
                         <div className="flex items-center gap-2">
                           <span className="flex items-center gap-1">
                             <User className="h-4 w-4" />
                             <span className="text-primary">{answer.author}</span>
                           </span>
                           {hasPermission('moderate') && (
                             <Badge variant="outline" className="text-xs">
                               <Shield className="h-3 w-3 mr-1" />
                               Admin
                             </Badge>
                           )}
                         </div>
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
                  size="lg"
                  className="text-base font-medium"
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
