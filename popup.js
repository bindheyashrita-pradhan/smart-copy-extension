// popup.js - Controls the popup UI

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const statusEl = document.getElementById('status');
  
  copyBtn.addEventListener('click', async () => {
    statusEl.textContent = '⏳ Copying...';
    statusEl.style.color = '#f59e0b';
    
    try {
      // Get the active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      // Send message to content script
      const response = await browser.tabs.sendMessage(activeTab.id, { action: "smartCopy" });
      
      if (response && response.success) {
        statusEl.textContent = '✅ Copied with styles!';
        statusEl.style.color = '#10b981';
      } else {
        statusEl.textContent = '❌ Failed: ' + (response?.error || 'Unknown error');
        statusEl.style.color = '#ef4444';
      }
    } catch (err) {
      console.error('Popup error:', err);
      statusEl.textContent = '❌ Error: ' + err.message;
      statusEl.style.color = '#ef4444';
    }
  });
});