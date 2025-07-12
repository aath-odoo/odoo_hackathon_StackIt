import { MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="border-b border-border py-6 hover:bg-muted/20 transition-colors">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-4 min-w-[80px] text-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{question.answers}</span>
            {question.isAnswered && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <Link 
            to={`/question/${question.id}`}
            className="block hover:text-primary transition-colors"
          >
            <h3 className="text-lg font-medium mb-2 text-foreground hover:text-primary transition-colors">
              {question.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {question.description.replace(/<[^>]*>/g, '')}
          </p>
          
          
          <div className="flex items-center justify-end text-xs text-muted-foreground">
            <span>{question.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}