import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

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
}

interface QuestionCardCompactProps {
  question: Question;
  onVoteChange?: (questionId: string, newVoteCount: number) => void;
}

export function QuestionCardCompact({ question, onVoteChange }: QuestionCardCompactProps) {
  const [currentVotes, setCurrentVotes] = useState(question.votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.preventDefault();
    e.stopPropagation();
    
    let newVotes = currentVotes;
    let newUserVote: 'up' | 'down' | null = type;

    if (userVote === type) {
      newVotes = type === 'up' ? currentVotes - 1 : currentVotes + 1;
      newUserVote = null;
    } else if (userVote) {
      newVotes = type === 'up' ? currentVotes + 2 : currentVotes - 2;
    } else {
      newVotes = type === 'up' ? currentVotes + 1 : currentVotes - 1;
    }

    setCurrentVotes(newVotes);
    setUserVote(newUserVote);
    onVoteChange?.(question.id, newVotes);
  };

  return (
    <Link 
      to={`/question/${question.id}`} 
      className="flex items-center gap-4 p-3 border-b border-border hover:bg-muted/20 transition-colors"
    >
      {/* Vote Section */}
      <div className="flex items-center gap-1 min-w-[60px] text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleVote(e, 'up')}
          className={`p-1 h-5 w-5 hover:bg-muted transition-colors ${
            userVote === 'up' 
              ? 'text-primary bg-muted' 
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[20px]">{currentVotes}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleVote(e, 'down')}
          className={`p-1 h-5 w-5 hover:bg-muted transition-colors ${
            userVote === 'down' 
              ? 'text-destructive bg-muted' 
              : 'text-muted-foreground hover:text-destructive'
          }`}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Answers Section */}
      <div className="flex items-center gap-1 min-w-[40px] text-center">
        <MessageSquare className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">{question.answers}</span>
        {question.isAnswered && (
          <CheckCircle className="h-3 w-3 text-green-500" />
        )}
      </div>

      {/* Title and Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium mb-1 text-foreground hover:text-primary transition-colors truncate">
          {question.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-1">
            {question.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs py-0 px-1 h-4">
                {tag}
              </Badge>
            ))}
            {question.tags.length > 3 && (
              <span className="text-muted-foreground">+{question.tags.length - 3}</span>
            )}
          </div>
          <span className="text-muted-foreground">•</span>
          <span>by <span className="text-primary">{question.author}</span></span>
          <span className="text-muted-foreground">•</span>
          <span>{question.createdAt}</span>
        </div>
      </div>
    </Link>
  );
}