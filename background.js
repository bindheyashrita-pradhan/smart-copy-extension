// background.js - Runs in the background, handles clipboard

console.log(' Smart Copy background script loaded!');

// ============================================
//  HANDLE COPY MESSAGES FROM CONTENT SCRIPT
// =============================================
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copyStyledHTML") {
    console.log('📥 Received styled HTML to copy');
    
    copyToClipboard(message.html, message.text)
      .then(() => {
        console.log('✅ Successfully copied to clipboard!');
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error('❌ Failed to copy:', err);
        sendResponse({ success: false, error: err.message });
      });
    
    return true; // Keep message channel open for async response
  }
});

// =============================================
//  COPY FUNCTION - Writes both HTML and Plain Text
// =============================================
async function copyToClipboard(html, text) {
  try {
    // Create a Blob for HTML format
    const htmlBlob = new Blob([html], { type: 'text/html' });
    
    // Create a Blob for Plain Text format (fallback)
    const textBlob = new Blob([text], { type: 'text/plain' });
    
    // Create ClipboardItem with both formats
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    });
    
    // Write to clipboard
    await navigator.clipboard.write([clipboardItem]);
    
    return true;
  } catch (err) {
    console.error('Clipboard write error:', err);
    throw err;
  }
}

// =============================================
//  KEYBOARD SHORTCUT: Ctrl+Shift+C
// =============================================
browser.commands.onCommand.addListener((command) => {
  if (command === "smart-copy") {
    console.log('⌨️ Keyboard shortcut triggered!');
    
    // Get the active tab
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        if (tabs.length === 0) return;
        
        const activeTab = tabs[0];
        console.log(`📄 Sending smartCopy to tab: ${activeTab.id}`);
        
        // Send message to content script in active tab
        browser.tabs.sendMessage(activeTab.id, { action: "smartCopy" })
          .then(response => {
            if (response && response.success) {
              console.log('✅ Smart copy executed successfully');
            } else {
              console.warn('⚠️ Smart copy failed:', response?.error);
            }
          })
          .catch(err => {
            console.error('❌ Error sending message to content script:', err);
            // Show a fallback notification
            showNotification('Please select some text first!');
          });
      })
      .catch(err => {
        console.error('❌ Error getting active tab:', err);
      });
  }
});

// =============================================
//  NOTIFICATION HELPER (for errors)
// =============================================
function showNotification(message) {
  // We can't create DOM elements here, so we'll use the native notification API
  browser.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Smart Copy',
    message: message
  }).catch(() => {
    // If notifications aren't supported, just log it
    console.warn('Notification:', message);
  });
}

// =============================================
//  CLEANUP: Handle extension updates
// =============================================
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🎉 Smart Copy extension installed!');
  } else if (details.reason === 'update') {
    console.log('🔄 Smart Copy extension updated!');
  }
});