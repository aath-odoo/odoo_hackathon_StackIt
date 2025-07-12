interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Simple markdown to HTML converter for basic formatting
  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert strikethrough text
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br />');
    
    // Convert unordered lists
    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>');
    
    // Convert ordered lists  
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol class="list-decimal list-inside">$1</ol>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
    
    // Convert code blocks (basic)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code class="text-sm">$2</code></pre>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded text-sm">$1</code>');
    
    return html;
  };

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}