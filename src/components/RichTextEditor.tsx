import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Smile
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showToolbar, setShowToolbar] = useState(true);

  const formatText = (format: string) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let formatCode = '';

    switch (format) {
      case 'bold':
        formatCode = `**${selectedText}**`;
        break;
      case 'italic':
        formatCode = `*${selectedText}*`;
        break;
      case 'strikethrough':
        formatCode = `~~${selectedText}~~`;
        break;
      case 'list':
        formatCode = `\n- ${selectedText || 'List item'}`;
        break;
      case 'ordered-list':
        formatCode = `\n1. ${selectedText || 'List item'}`;
        break;
      case 'link':
        formatCode = `[${selectedText || 'Link text'}](URL)`;
        break;
      case 'image':
        formatCode = `![${selectedText || 'Alt text'}](Image URL)`;
        break;
      case 'align-left':
        formatCode = `<div align="left">${selectedText || 'Text'}</div>`;
        break;
      case 'align-center':
        formatCode = `<div align="center">${selectedText || 'Text'}</div>`;
        break;
      case 'align-right':
        formatCode = `<div align="right">${selectedText || 'Text'}</div>`;
        break;
      case 'emoji':
        formatCode = '😊';
        break;
      default:
        formatCode = selectedText;
    }

    newText = value.substring(0, start) + formatCode + value.substring(end);
    onChange(newText);
    
    // Focus back to textarea after formatting
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formatCode.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="border border-border rounded-lg">
      {showToolbar && (
        <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('strikethrough')}
            className="h-8 w-8 p-0"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1 self-center" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('ordered-list')}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1 self-center" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('link')}
            className="h-8 w-8 p-0"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('image')}
            className="h-8 w-8 p-0"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1 self-center" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('align-left')}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('align-center')}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('align-right')}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1 self-center" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('emoji')}
            className="h-8 w-8 p-0"
            title="Insert emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
      />
    </div>
  );
}