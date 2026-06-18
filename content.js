// content.js - Complete version with perfect styling

console.log('🔥 Smart Copy extension loaded!');

// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "smartCopy") {
    console.log('📋 Smart Copy triggered!');
    return handleSmartCopy(sendResponse);
  }
  
  if (message.action === "getSelection") {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      sendResponse({ 
        text: selection.toString(),
        success: true 
      });
    } else {
      sendResponse({ 
        text: '',
        success: false,
        error: 'No text selected' 
      });
    }
    return true;
  }
  
  if (message.action === "processClipboard") {
    const rawText = message.text;
    const styledHTML = convertToStyledHTML(rawText);
    
    browser.runtime.sendMessage({
      action: "copyStyledHTML",
      html: styledHTML,
      text: rawText
    });
    
    sendResponse({ success: true });
    return true;
  }
});

// =============================================
// 🎯 HANDLE SMART COPY - Preserve ALL styles
// =============================================
function handleSmartCopy(sendResponse) {
  const selection = window.getSelection();
  
  if (!selection || selection.isCollapsed) {
    console.warn('⚠️ No text selected!');
    sendResponse({ success: false, error: 'No text selected' });
    return;
  }

  if (!selection.rangeCount) {
    sendResponse({ success: false, error: 'No range selected' });
    return;
  }

  const range = selection.getRangeAt(0);
  const clonedContents = range.cloneContents();
  
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(clonedContents);
  
  // =============================================
  // 🎨 INJECT PERFECT WORD STYLES
  // =============================================
  
  // 1. BOLD - Keep bold with proper styling
  tempDiv.querySelectorAll('strong, b').forEach(el => {
    el.style.fontWeight = '700';
    el.style.color = '#1a1a1a';
  });
  
  // 2. ITALIC - Keep italic
  tempDiv.querySelectorAll('em, i').forEach(el => {
    el.style.fontStyle = 'italic';
    el.style.color = '#1a1a1a';
  });
  
  // 3. UNDERLINE
  tempDiv.querySelectorAll('u').forEach(el => {
    el.style.textDecoration = 'underline';
  });
  
  // 4. INLINE CODE - Like my style
  tempDiv.querySelectorAll('code').forEach(el => {
    el.style.fontFamily = 'Consolas, "Courier New", monospace';
    el.style.backgroundColor = '#f1f1f1';
    el.style.padding = '2px 8px';
    el.style.borderRadius = '4px';
    el.style.fontSize = '0.92em';
    el.style.color = '#c7254e';
    el.style.border = '1px solid #e1e1e1';
  });
  
  // 5. CODE BLOCKS - Dark background like mine
  tempDiv.querySelectorAll('pre').forEach(el => {
    el.style.backgroundColor = '#2d2d2d';
    el.style.color = '#f8f8f2';
    el.style.padding = '16px 20px';
    el.style.borderRadius = '8px';
    el.style.fontFamily = 'Consolas, "Courier New", monospace';
    el.style.fontSize = '0.9em';
    el.style.overflow = 'auto';
    el.style.whiteSpace = 'pre-wrap';
    el.style.wordWrap = 'break-word';
    el.style.border = '1px solid #404040';
    el.style.margin = '12px 0';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    
    // Make code inside pre look good
    el.querySelectorAll('code').forEach(code => {
      code.style.backgroundColor = 'transparent';
      code.style.color = '#f8f8f2';
      code.style.padding = '0';
      code.style.border = 'none';
      code.style.fontSize = 'inherit';
    });
  });
  
  // 6. LISTS - Perfect indentation like my style
  tempDiv.querySelectorAll('ul, ol').forEach(el => {
    el.style.marginLeft = '24px';
    el.style.paddingLeft = '20px';
    el.style.marginTop = '8px';
    el.style.marginBottom = '8px';
  });
  
  // 7. LIST ITEMS - Clean spacing
  tempDiv.querySelectorAll('li').forEach(el => {
    el.style.marginBottom = '6px';
    el.style.lineHeight = '1.6';
    el.style.color = '#1a1a1a';
  });
  
  // 8. NESTED LISTS
  tempDiv.querySelectorAll('ul ul, ul ol, ol ul, ol ol').forEach(el => {
    el.style.marginTop = '4px';
    el.style.marginBottom = '4px';
  });
  
  // 9. HEADINGS - Like my style
  tempDiv.querySelectorAll('h1').forEach(el => {
    el.style.fontSize = '28px';
    el.style.fontWeight = '700';
    el.style.color = '#1a1a1a';
    el.style.margin = '24px 0 12px 0';
    el.style.borderBottom = '3px solid #667eea';
    el.style.paddingBottom = '8px';
  });
  
  tempDiv.querySelectorAll('h2').forEach(el => {
    el.style.fontSize = '24px';
    el.style.fontWeight = '700';
    el.style.color = '#1a1a1a';
    el.style.margin = '20px 0 10px 0';
    el.style.borderBottom = '2px solid #e5e7eb';
    el.style.paddingBottom = '6px';
  });
  
  tempDiv.querySelectorAll('h3').forEach(el => {
    el.style.fontSize = '20px';
    el.style.fontWeight = '600';
    el.style.color = '#1a1a1a';
    el.style.margin = '16px 0 8px 0';
  });
  
  tempDiv.querySelectorAll('h4, h5, h6').forEach(el => {
    el.style.fontSize = '18px';
    el.style.fontWeight = '600';
    el.style.color = '#1a1a1a';
    el.style.margin = '12px 0 6px 0';
  });
  
  // 10. PARAGRAPHS - Clean spacing
  tempDiv.querySelectorAll('p').forEach(el => {
    el.style.margin = '8px 0';
    el.style.lineHeight = '1.7';
    el.style.color = '#1a1a1a';
  });
  
  // 11. LINKS - Blue and underlined like my style
  tempDiv.querySelectorAll('a').forEach(el => {
    el.style.color = '#0066cc';
    el.style.textDecoration = 'underline';
    el.style.fontWeight = '500';
    if (el.href) {
      el.style.cursor = 'pointer';
    }
  });
  
  // 12. BLOCKQUOTES - Like my style with left border
  tempDiv.querySelectorAll('blockquote').forEach(el => {
    el.style.borderLeft = '4px solid #667eea';
    el.style.paddingLeft = '20px';
    el.style.margin = '12px 0';
    el.style.padding = '8px 20px';
    el.style.backgroundColor = '#f8f9fa';
    el.style.borderRadius = '4px';
    el.style.color = '#374151';
    el.style.fontStyle = 'italic';
  });
  
  // 13. TABLES - Clean borders
  tempDiv.querySelectorAll('table').forEach(el => {
    el.style.borderCollapse = 'collapse';
    el.style.width = '100%';
    el.style.margin = '12px 0';
    el.style.fontSize = '0.95em';
  });
  
  tempDiv.querySelectorAll('td, th').forEach(el => {
    el.style.border = '1px solid #d1d5db';
    el.style.padding = '10px 14px';
    el.style.textAlign = 'left';
    el.style.color = '#1a1a1a';
  });
  
  tempDiv.querySelectorAll('th').forEach(el => {
    el.style.backgroundColor = '#f3f4f6';
    el.style.fontWeight = '700';
    el.style.color = '#1a1a1a';
  });
  
  tempDiv.querySelectorAll('tr:nth-child(even)').forEach(el => {
    el.style.backgroundColor = '#fafafa';
  });
  
  // 14. HORIZONTAL RULES
  tempDiv.querySelectorAll('hr').forEach(el => {
    el.style.border = 'none';
    el.style.borderTop = '2px solid #e5e7eb';
    el.style.margin = '24px 0';
  });
  
  // 15. STRIKETHROUGH
  tempDiv.querySelectorAll('del, s, strike').forEach(el => {
    el.style.textDecoration = 'line-through';
    el.style.color = '#6b7280';
  });
  
  // 16. SUBSCRIPT/SUPERSCRIPT
  tempDiv.querySelectorAll('sub').forEach(el => {
    el.style.verticalAlign = 'sub';
    el.style.fontSize = '0.75em';
  });
  
  tempDiv.querySelectorAll('sup').forEach(el => {
    el.style.verticalAlign = 'super';
    el.style.fontSize = '0.75em';
  });
  
  // 17. Add base font
  tempDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  tempDiv.style.fontSize = '16px';
  tempDiv.style.lineHeight = '1.7';
  tempDiv.style.color = '#1a1a1a';
  
  // =============================================
  // 🚀 GET THE STYLED HTML
  // =============================================
  
  const styledHTML = tempDiv.innerHTML;
  const plainText = selection.toString();
  
  // Send to background script to copy to clipboard
  browser.runtime.sendMessage({
    action: "copyStyledHTML",
    html: styledHTML,
    text: plainText,
    url: window.location.href
  }).then(response => {
    console.log('✅ Copy response:', response);
  }).catch(err => {
    console.error('❌ Error sending to background:', err);
  });
  
  // Show visual feedback
  showCopyNotification();
  
  sendResponse({ success: true });
  return true;
}

// =============================================
// 🔤 Convert plain text to styled HTML
// =============================================
function convertToStyledHTML(text) {
  // Split into lines
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  let listType = 'ul';
  let inCodeBlock = false;
  let codeContent = '';
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Check for code blocks
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeContent = '';
        continue;
      } else {
        inCodeBlock = false;
        html += `<pre style="background:#2d2d2d;color:#f8f8f2;padding:16px 20px;border-radius:8px;font-family:Consolas,monospace;font-size:0.9em;overflow:auto;border:1px solid #404040;margin:12px 0;">${escapeHtml(codeContent)}</pre>`;
        continue;
      }
    }
    
    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }
    
    if (!trimmed) {
      if (inList) {
        html += `</${listType}>`;
        inList = false;
      }
      html += '<br>';
      continue;
    }
    
    // Check for headings
    if (trimmed.match(/^#{1,6}\s/)) {
      if (inList) {
        html += `</${listType}>`;
        inList = false;
      }
      const match = trimmed.match(/^(#{1,6})\s(.+)/);
      const level = match[1].length;
      const content = match[2];
      const sizes = {1:28, 2:24, 3:20, 4:18, 5:16, 6:14};
      html += `<h${level} style="font-size:${sizes[level]}px;font-weight:${level <= 3 ? 700 : 600};color:#1a1a1a;margin:${level <= 2 ? '20px 0 10px 0' : '12px 0 6px 0'};${level <= 2 ? 'border-bottom:2px solid #e5e7eb;padding-bottom:6px;' : ''}">${formatInline(content)}</h${level}>`;
      continue;
    }
    
    // Check for unordered list
    if (trimmed.match(/^[-*•]\s/)) {
      const content = trimmed.replace(/^[-*•]\s/, '');
      if (!inList || listType !== 'ul') {
        if (inList) html += `</${listType}>`;
        html += '<ul style="margin-left:24px;padding-left:20px;margin-top:8px;margin-bottom:8px;">';
        inList = true;
        listType = 'ul';
      }
      html += `<li style="margin-bottom:6px;line-height:1.6;color:#1a1a1a;">${formatInline(content)}</li>`;
      continue;
    }
    
    // Check for ordered list
    if (trimmed.match(/^\d+\.\s/)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      if (!inList || listType !== 'ol') {
        if (inList) html += `</${listType}>`;
        html += '<ol style="margin-left:24px;padding-left:20px;margin-top:8px;margin-bottom:8px;">';
        inList = true;
        listType = 'ol';
      }
      html += `<li style="margin-bottom:6px;line-height:1.6;color:#1a1a1a;">${formatInline(content)}</li>`;
      continue;
    }
    
    // Blockquote
    if (trimmed.startsWith('> ')) {
      if (inList) {
        html += `</${listType}>`;
        inList = false;
      }
      const content = trimmed.replace(/^> /, '');
      html += `<blockquote style="border-left:4px solid #667eea;padding:8px 20px;margin:12px 0;background:#f8f9fa;border-radius:4px;color:#374151;font-style:italic;">${formatInline(content)}</blockquote>`;
      continue;
    }
    
    // Regular paragraph
    if (inList) {
      html += `</${listType}>`;
      inList = false;
    }
    html += `<p style="margin:8px 0;line-height:1.7;color:#1a1a1a;">${formatInline(line)}</p>`;
  }
  
  if (inList) {
    html += `</${listType}>`;
  }
  
  return html;
}

// =============================================
// 🔤 Format inline text
// =============================================
function formatInline(text) {
  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1a1a1a;">$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong style="font-weight:700;color:#1a1a1a;">$1</strong>');
  
  // Italic: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em style="font-style:italic;color:#1a1a1a;">$1</em>');
  text = text.replace(/_(.+?)_/g, '<em style="font-style:italic;color:#1a1a1a;">$1</em>');
  
  // Code: `text`
  text = text.replace(/`(.+?)`/g, '<code style="font-family:Consolas,monospace;background:#f1f1f1;padding:2px 8px;border-radius:4px;font-size:0.92em;color:#c7254e;border:1px solid #e1e1e1;">$1</code>');
  
  // Links: [text](url)
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#0066cc;text-decoration:underline;font-weight:500;">$1</a>');
  
  return text;
}

// =============================================
// 🔒 Escape HTML
// =============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================
// 💬 Visual feedback
// =============================================
function showCopyNotification() {
  const existing = document.getElementById('smart-copy-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'smart-copy-toast';
  toast.textContent = '✅ Copied with perfect styles!';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 14px 28px;
    border-radius: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 999999;
    animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    pointer-events: none;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateY(40px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}