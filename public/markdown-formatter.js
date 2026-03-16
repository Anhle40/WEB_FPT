// 🎨 Markdown to HTML Formatter
// Dùng để format AI responses đẹp hơn

function formatMarkdownToHTML(text) {
    if (!text) return '';
    
    // Xử lý bullet points trước tiên
    text = text
        // Bullet points với * ở đầu dòng
        .replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>')
        // Group các li liền kề thành ul
        .replace(/(<li class="ml-4 mb-1">• .+<\/li>)(\s*<li class="ml-4 mb-1">• .+<\/li>)*/g, function(match) {
            return '<ul class="list-disc mb-3">' + match + '</ul>';
        });
    
    return text
        // Bold text với **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Headers với # ## ###
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>')
        
        // Code blocks với `code`
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
        
        // Clean up
        .replace(/^\s+|\s+$/g, '')
        .replace(/^/, '<p class="mb-4">') + (text || '') + (/$/, '</p>');
}

// 🎯 Export để dùng
if (typeof window !== 'undefined') {
    window.formatMarkdownToHTML = formatMarkdownToHTML;
}
