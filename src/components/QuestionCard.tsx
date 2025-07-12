import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

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

interface QuestionCardProps {
  question: Question;
  onVoteChange?: (questionId: string, newVoteCount: number) => void;
}

export function QuestionCard({ question, onVoteChange }: QuestionCardProps) {
  const [currentVotes, setCurrentVotes] = useState(question.votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    let newVotes = currentVotes;
    let newUserVote: 'up' | 'down' | null = type;

    if (userVote === type) {
      // Remove vote
      newVotes = type === 'up' ? currentVotes - 1 : currentVotes + 1;
      newUserVote = null;
    } else if (userVote) {
      // Change vote
      newVotes = type === 'up' ? currentVotes + 2 : currentVotes - 2;
    } else {
      // New vote
      newVotes = type === 'up' ? currentVotes + 1 : currentVotes - 1;
    }

    setCurrentVotes(newVotes);
    setUserVote(newUserVote);
    onVoteChange?.(question.id, newVotes);
  };

  return (
    <Link to={`/question/${question.id}`} className="block border-b border-border py-6 hover:bg-muted/20 transition-colors">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-4 min-w-[80px] text-center">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleVote(e, 'up')}
              className={`p-1 h-6 w-6 hover:bg-muted transition-colors ${
                userVote === 'up' 
                  ? 'text-primary bg-muted' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-foreground">{currentVotes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleVote(e, 'down')}
              className={`p-1 h-6 w-6 hover:bg-muted transition-colors ${
                userVote === 'down' 
                  ? 'text-destructive bg-muted' 
                  : 'text-muted-foreground hover:text-destructive'
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{question.answers}</span>
            {question.isAnswered && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="block hover:text-primary transition-colors">
            <h3 className="text-lg font-medium mb-2 text-foreground hover:text-primary transition-colors">
              {question.title}
            </h3>
          </div>
          
          <div className="text-muted-foreground text-sm mb-3 line-clamp-2">
            <MarkdownRenderer content={question.description} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-muted hover:bg-muted/80">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>asked by <span className="text-primary">{question.author}</span></span>
            <span className="mr-4">{question.createdAt}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}