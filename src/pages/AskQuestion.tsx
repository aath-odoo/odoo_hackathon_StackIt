import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your question.",
        variant: "destructive"
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description for your question.",
        variant: "destructive"
      });
      return;
    }
    
    if (tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to your question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Question posted!",
        description: "Your question has been successfully posted.",
      });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} notificationCount={3} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Ask a Question</h1>
          <p className="text-muted-foreground text-lg">
            Be specific and imagine you're asking a question to another person
          </p>
        </div>

        <div className="bg-card rounded-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="text-base font-medium">Title</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to center a div with CSS?"
                className="text-base h-12"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Be specific and imagine you're asking a question to another person
                </p>
                <span className="text-xs text-muted-foreground">0/200</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <span className="text-red-500">*</span>
              </div>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Include all the information someone would need to answer your question..."
              />
              <p className="text-sm text-muted-foreground">
                Include all the information someone would need to answer your question
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
                <span className="text-red-500">*</span>
              </div>
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="Add up to 5 tags to describe what your question is about (press Enter to add)"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Add up to 5 tags to describe what your question is about
                </p>
                <span className="text-xs text-muted-foreground">0/5 tags</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium"
              >
                {isSubmitting ? "Posting..." : "Post Your Question"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
                className="px-8 py-3 text-base"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}