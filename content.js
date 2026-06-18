// content.js - Runs on every webpage
console.log(' Smart Copy extension loaded!');

// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "smartCopy") {
    console.log(' Smart Copy triggered!');
    
    const selection = window.getSelection();
    
    // Check if user has selected anything
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
    //  INJECT WORD-FRIENDLY INLINE STYLES
    // =============================================
    
    // 1. BOLD - convert <strong> and <b> to inline font-weight
    tempDiv.querySelectorAll('strong, b').forEach(el => {
      el.style.fontWeight = 'bold';
      // Keep the original text
    });
    
    // 2. ITALIC - convert <em> and <i> to inline font-style
    tempDiv.querySelectorAll('em, i').forEach(el => {
      el.style.fontStyle = 'italic';
    });
    
    // 3. UNDERLINE - if any <u> exists
    tempDiv.querySelectorAll('u').forEach(el => {
      el.style.textDecoration = 'underline';
    });
    
    // 4. CODE (inline) - monospace + background
    tempDiv.querySelectorAll('code').forEach(el => {
      el.style.fontFamily = 'Consolas, "Courier New", monospace';
      el.style.backgroundColor = '#f4f4f4';
      el.style.padding = '2px 6px';
      el.style.borderRadius = '3px';
      el.style.fontSize = '0.9em';
      el.style.color = '#c7254e';
    });
    
    // 5. CODE BLOCKS (pre) - full block styling
    tempDiv.querySelectorAll('pre').forEach(el => {
      el.style.backgroundColor = '#f8f8f8';
      el.style.padding = '12px 16px';
      el.style.borderRadius = '6px';
      el.style.border = '1px solid #ddd';
      el.style.fontFamily = 'Consolas, "Courier New", monospace';
      el.style.fontSize = '0.9em';
      el.style.overflow = 'auto';
      el.style.whiteSpace = 'pre-wrap';
      el.style.wordWrap = 'break-word';
    });
    
    // 6. LISTS - preserve indentation
    tempDiv.querySelectorAll('ul, ol').forEach(el => {
      el.style.marginLeft = '20px';
      el.style.paddingLeft = '20px';
    });
    
    // 7. LIST ITEMS - add some spacing
    tempDiv.querySelectorAll('li').forEach(el => {
      el.style.marginBottom = '4px';
    });
    
    // 8. HEADINGS (h1-h6) - make them bold and larger
    tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      el.style.fontWeight = 'bold';
      if (el.tagName === 'H1') el.style.fontSize = '24px';
      else if (el.tagName === 'H2') el.style.fontSize = '20px';
      else if (el.tagName === 'H3') el.style.fontSize = '18px';
      else if (el.tagName === 'H4') el.style.fontSize = '16px';
      el.style.margin = '10px 0';
    });
    
    // 9. PARAGRAPHS - add spacing
    tempDiv.querySelectorAll('p').forEach(el => {
      el.style.margin = '8px 0';
    });
    
    // 10. LINKS - preserve href and make blue + underlined
    tempDiv.querySelectorAll('a').forEach(el => {
      el.style.color = '#0066cc';
      el.style.textDecoration = 'underline';
      // Keep the href attribute
      if (el.href) {
        el.style.cursor = 'pointer';
      }
    });
    
    // 11. BLOCKQUOTES - add left border and padding
    tempDiv.querySelectorAll('blockquote').forEach(el => {
      el.style.borderLeft = '4px solid #ccc';
      el.style.paddingLeft = '16px';
      el.style.marginLeft = '0';
      el.style.color = '#555';
    });
    
    // 12. TABLES - add borders
    tempDiv.querySelectorAll('table').forEach(el => {
      el.style.borderCollapse = 'collapse';
      el.style.width = '100%';
      el.style.margin = '10px 0';
    });
    
    tempDiv.querySelectorAll('td, th').forEach(el => {
      el.style.border = '1px solid #ddd';
      el.style.padding = '8px 12px';
      el.style.textAlign = 'left';
    });
    
    tempDiv.querySelectorAll('th').forEach(el => {
      el.style.backgroundColor = '#f2f2f2';
      el.style.fontWeight = 'bold';
    });
    
    // =============================================
    //  GET THE STYLED HTML
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
    
    // Show a visual feedback
    showCopyNotification();
    
    sendResponse({ success: true });
    return true; // Keep message channel open for async response
  }
});

// =============================================
//  VISUAL FEEDBACK - Show "Copied!" on page
// =============================================
function showCopyNotification() {
  const existing = document.getElementById('smart-copy-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'smart-copy-toast';
  toast.textContent = '✅ Copied with styles!';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    animation: slideIn 0.3s ease;
    pointer-events: none;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  // Remove after 2 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}