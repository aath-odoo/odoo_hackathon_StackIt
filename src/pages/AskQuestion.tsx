import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// Validation schema
const questionSchema = z.object({
  title: z.string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z.string()
    .min(30, "Description must be at least 30 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  tags: z.array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed")
});

type QuestionFormData = z.infer<typeof questionSchema>;

const DRAFT_KEY = "askQuestion_draft";
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export default function AskQuestion() {
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      tags: []
    }
  });

  const title = watch("title");
  const description = watch("description");

  // Calculate quality score
  const getQualityScore = () => {
    let score = 0;
    if (title.length >= 10) score += 25;
    if (description.length >= 100) score += 25;
    if (tags.length >= 3) score += 25;
    if (title.includes("?")) score += 10;
    if (description.includes("```") || description.includes("code")) score += 15;
    return Math.min(score, 100);
  };

  const qualityScore = getQualityScore();

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.title || draft.description || draft.tags?.length > 0) {
          setShowDraftAlert(true);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [title, description, tags]);

  // Update tags in form when tags state changes
  useEffect(() => {
    setValue("tags", tags, { shouldValidate: true });
  }, [tags, setValue]);

  const saveDraft = () => {
    if (title || description || tags.length > 0) {
      const draft = { title, description, tags };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setValue("title", draft.title || "");
        setValue("description", draft.description || "");
        setTags(draft.tags || []);
        setShowDraftAlert(false);
        toast({
          title: "Draft loaded",
          description: "Your saved draft has been restored.",
        });
      } catch (error) {
        toast({
          title: "Error loading draft",
          description: "There was an error loading your saved draft.",
          variant: "destructive"
        });
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftAlert(false);
    setLastSaved(null);
  };

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call with progress
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new question object
      const newQuestion = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        tags: data.tags,
        author: "User Name",
        votes: 0,
        answers: 0,
        isAnswered: false,
        createdAt: "just now"
      };
      
      // Save to localStorage to persist across page reloads
      const existingQuestions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
      existingQuestions.unshift(newQuestion);
      localStorage.setItem('userQuestions', JSON.stringify(existingQuestions));
      
      // Record activity
      import('@/hooks/useUserActivity').then(module => {
        module.recordActivityStandalone('question');
      });
      
      clearDraft();
      
      toast({
        title: "Question posted!",
        description: "Your question has been successfully posted.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error posting question",
        description: "There was an error posting your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title || description || tags.length > 0) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Ask a Question</h1>
        </div>

        {/* Draft Alert */}
        {showDraftAlert && (
          <Alert className="mb-6 border-orange-500">
            <Save className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You have a saved draft. Would you like to restore it?</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadDraft}>
                  Load Draft
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDraftAlert(false)}>
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-lg border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="text-base font-medium">Title</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., How to center a div with CSS?"
                className="text-base h-12"
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                <div>
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                  {!errors.title && title.length > 0 && (
                    <p className="text-sm text-green-600">
                      Good title!
                    </p>
                  )}
                </div>
                <span className={`text-xs ${title.length > 180 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {title.length}/200
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <span className="text-red-500">*</span>
              </div>
              <RichTextEditor
                value={description}
                onChange={(value) => setValue("description", value, { shouldValidate: true })}
                placeholder="Include all the information someone would need to answer your question..."
              />
              <div className="flex justify-between items-center">
                <div>
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                  {!errors.description && description.length > 30 && (
                    <p className="text-sm text-green-600">
                      Good description!
                    </p>
                  )}
                </div>
                <span className={`text-xs ${description.length > 4500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {description.length}/5000
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
                <span className="text-red-500">*</span>
              </div>
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="Add up to 5 tags to describe what your question is about (press Enter to add)"
                maxTags={5}
              />
              <div className="flex justify-between items-center">
                <div>
                  {errors.tags && (
                    <p className="text-sm text-red-500">{errors.tags.message}</p>
                  )}
                  {!errors.tags && tags.length > 0 && (
                    <p className="text-sm text-green-600">
                      Tags added!
                    </p>
                  )}
                </div>
                <span className={`text-xs ${tags.length >= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {tags.length}/5 tags
                </span>
              </div>
            </div>

            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Save className="h-3 w-3" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || !isValid}
                size="lg"
                className="px-8 text-base font-medium flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Your Question"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 text-base"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="lg"
                onClick={saveDraft}
                disabled={isSubmitting}
                className="px-4 text-base flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}