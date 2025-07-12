
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { QuestionCard } from "@/components/QuestionCard";
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
  const [questions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all-tags");
  const [searchQuery, setSearchQuery] = useState("");

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
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "votes":
        return filtered.sort((a, b) => b.votes - a.votes);
      case "answers":
        return filtered.sort((a, b) => b.answers - a.answers);
      case "newest":
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [questions, sortBy, statusFilter, tagFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} notificationCount={3} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Questions</h1>
        </div>
        
        <div className="bg-card rounded-lg border">
          {filteredAndSortedQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
        
        {filteredAndSortedQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found matching your criteria.</p>
            <Button 
              className="mt-4 bg-orange-500 hover:bg-orange-600"
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
                className={page === 1 ? "bg-orange-500 hover:bg-orange-600" : ""}
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
