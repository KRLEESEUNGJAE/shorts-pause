/**
 * Shorts Pause - Popup Script
 */
const STORAGE_KEY = 'pauseEnabled';

const toggleInput = document.getElementById('pauseToggle');
const statusLabel = document.getElementById('statusText');

// Load saved state
chrome.storage.sync.get([STORAGE_KEY], ({ pauseEnabled }) => {
  toggleInput.checked = pauseEnabled ?? false;
  updateStatusLabel(toggleInput.checked);
});

// Handle toggle change
toggleInput.addEventListener('change', () => {
  const enabled = toggleInput.checked;
  chrome.storage.sync.set({ [STORAGE_KEY]: enabled });
  updateStatusLabel(enabled);
  notifyContentScript(enabled);
});

function updateStatusLabel(enabled) {
  statusLabel.textContent = enabled ? 'ON' : 'OFF';
  statusLabel.className = `status ${enabled ? 'on' : 'off'}`;
}

function notifyContentScript(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'PAUSE_TOGGLE', enabled }).catch(() => {});
    }
  });
}
