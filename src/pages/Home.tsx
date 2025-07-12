
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/Header";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionCardCompact } from "@/components/QuestionCardCompact";
import { FilterSidebar } from "@/components/FilterSidebar";

// Mock data for demonstration
const mockQuestions = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First Name, and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "JOIN"],
    author: "User Name",
    votes: 8,
    answers: 2,
    isAnswered: true,
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    title: "React useState not updating state immediately",
    description: "I'm having trouble with useState not updating the state immediately when I call the setter function. The component doesn't re-render with the new value...",
    tags: ["React", "JavaScript", "Hooks"],
    author: "Developer123",
    votes: 15,
    answers: 4,
    isAnswered: true,
    createdAt: "4 hours ago"
  },
  {
    id: "3",
    title: "Best practices for TypeScript interface design",
    description: "What are the best practices when designing interfaces in TypeScript? Should I use interfaces or types? When should I extend vs when should I use union types?",
    tags: ["TypeScript", "Interfaces", "Best-Practices"],
    author: "TSLearner",
    votes: 23,
    answers: 6,
    isAnswered: true,
    createdAt: "1 day ago"
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to use which?",
    description: "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the main differences and use cases for each?",
    tags: ["CSS", "Grid", "Flexbox"],
    author: "CSSNewbie",
    votes: 12,
    answers: 0,
    isAnswered: false,
    createdAt: "2 days ago"
  },
  {
    id: "5",
    title: "Python list comprehension vs for loop performance",
    description: "I've heard that list comprehensions are faster than for loops in Python. Is this always true? When should I use each approach?",
    tags: ["Python", "Performance", "List-Comprehension"],
    author: "PythonDev",
    votes: 18,
    answers: 3,
    isAnswered: true,
    createdAt: "3 days ago"
  }
];

const availableTags = ["SQL", "React", "JavaScript", "TypeScript", "CSS", "Python", "JOIN", "Hooks", "Interfaces", "Best-Practices", "Grid", "Flexbox", "Performance", "List-Comprehension"];

export default function Home() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all-tags");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");

  // Helper function to parse relative time strings
  const parseTimeAgo = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s+(hour|day|week|month|year)s?\s+ago/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    const multipliers = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    
    return value * (multipliers[unit as keyof typeof multipliers] || 0);
  };

  // Load user questions from localStorage and listen for changes
  useEffect(() => {
    const loadQuestions = () => {
      const userQuestions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
      setQuestions([...userQuestions, ...mockQuestions]);
    };
    
    loadQuestions();
    
    // Listen for storage changes to update questions when deleted from other pages
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userQuestions') {
        loadQuestions();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-window updates
    const handleQuestionUpdate = () => {
      loadQuestions();
    };
    
    window.addEventListener('questionUpdated', handleQuestionUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('questionUpdated', handleQuestionUpdate);
    };
  }, []);

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "answered" && question.isAnswered) ||
                           (statusFilter === "unanswered" && !question.isAnswered);
      
      const matchesTag = tagFilter === "all-tags" || question.tags.includes(tagFilter);
      
      return matchesSearch && matchesStatus && matchesTag;
    });

    // Sort questions
    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt.includes('ago') ? Date.now() - parseTimeAgo(a.createdAt) : a.createdAt);
          const dateB = new Date(b.createdAt.includes('ago') ? Date.now() - parseTimeAgo(b.createdAt) : b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });
      case "votes":
        return filtered.sort((a, b) => b.votes - a.votes);
      case "answers":
        return filtered.sort((a, b) => b.answers - a.answers);
      case "newest":
      default:
        return filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt.includes('ago') ? Date.now() - parseTimeAgo(a.createdAt) : a.createdAt);
          const dateB = new Date(b.createdAt.includes('ago') ? Date.now() - parseTimeAgo(b.createdAt) : b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
    }
  }, [questions, sortBy, statusFilter, tagFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Questions</h1>
          <div className="flex items-center gap-4">
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as "card" | "compact")}
              className="border rounded-md p-1"
            >
              <ToggleGroupItem 
                value="card" 
                aria-label="Card view"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="compact" 
                aria-label="Compact view"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tags">All Tags</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border">
          {filteredAndSortedQuestions.map((question) => (
            viewMode === "card" ? (
              <QuestionCard key={question.id} question={question} />
            ) : (
              <QuestionCardCompact key={question.id} question={question} />
            )
          ))}
        </div>
        
        {filteredAndSortedQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found matching your criteria.</p>
            <Button 
              className="mt-4 bg-primary hover:bg-primary/90"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTagFilter("all-tags");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "ghost"}
                size="sm"
                className={page === 1 ? "bg-primary hover:bg-primary/90" : ""}
              >
                {page === 7 ? "..." : page}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
