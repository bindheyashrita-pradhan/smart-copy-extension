// popup.js - Controls the popup UI

let lastCopiedText = '';
let lastCopiedHTML = '';

document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const statusBox = document.getElementById('statusBox');
  const toast = document.getElementById('toast');
  
  // Check if there's text in clipboard on popup open
  checkClipboardContent();
  
  // Process button click handler
  processBtn.addEventListener('click', async () => {
    processBtn.disabled = true;
    processBtn.innerHTML = '⏳ Processing...';
    
    try {
      // Get the active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      // First, try to get text from clipboard
      const clipboardText = await getClipboardText();
      
      if (!clipboardText || clipboardText.trim().length === 0) {
        showToast('⚠️ No text found in clipboard!');
        processBtn.innerHTML = '📋 Copy text first';
        processBtn.disabled = false;
        return;
      }
      
      // Send message to content script to process the text
      const response = await browser.tabs.sendMessage(activeTab.id, { 
        action: "processClipboard",
        text: clipboardText
      });
      
      if (response && response.success) {
        // Update status
        statusBox.innerHTML = `
          <div class="status-icon">✅</div>
          <div class="status-text">
            <strong>Copy is Ready!</strong><br>
            Text has been formatted for Word
          </div>
          <div class="preview-text">${escapeHtml(clipboardText.substring(0, 60))}${clipboardText.length > 60 ? '...' : ''}</div>
        `;
        statusBox.className = 'status-box has-content';
        
        // Show success toast
        showToast('✅ Copy is Ready! Paste in Word');
        
        processBtn.className = 'btn btn-success';
        processBtn.innerHTML = '✅ Copied Successfully!';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          processBtn.className = 'btn btn-primary';
          processBtn.innerHTML = '🔄 Process & Copy to Word';
          processBtn.disabled = false;
        }, 3000);
      } else {
        showToast('❌ Failed to process text');
        processBtn.innerHTML = '❌ Try Again';
        processBtn.disabled = false;
      }
    } catch (err) {
      console.error('Popup error:', err);
      showToast('❌ Error: ' + err.message);
      processBtn.innerHTML = '🔄 Process & Copy to Word';
      processBtn.disabled = false;
    }
  });
});

// =============================================
// 📋 Get text from clipboard
// =============================================
async function getClipboardText() {
  try {
    // Try reading clipboard
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.log('Could not read clipboard directly:', err);
    
    // Fallback: Ask content script to get selection
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const response = await browser.tabs.sendMessage(tabs[0].id, { 
        action: "getSelection" 
      });
      return response?.text || '';
    } catch (e) {
      console.error('Fallback failed:', e);
      return '';
    }
  }
}

// =============================================
// 🔍 Check if there's text in clipboard
// =============================================
async function checkClipboardContent() {
  try {
    const text = await getClipboardText();
    const statusBox = document.getElementById('statusBox');
    
    if (text && text.trim().length > 0) {
      statusBox.innerHTML = `
        <div class="status-icon">📝</div>
        <div class="status-text">
          <strong>Text detected in clipboard!</strong><br>
          Click "Process & Copy to Word"
        </div>
        <div class="preview-text">${escapeHtml(text.substring(0, 60))}${text.length > 60 ? '...' : ''}</div>
      `;
      statusBox.className = 'status-box has-content';
    }
  } catch (err) {
    // Silently fail - user will see default state
  }
}

// =============================================
// 💬 Show toast notification
// =============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// =============================================
// 🔒 Escape HTML to prevent XSS
// =============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}