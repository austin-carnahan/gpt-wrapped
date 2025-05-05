/**
 * Get an API key, prompting the user the first time.
 * @param  {string} storageKey  e.g. 'openaiKey' or 'hfKey'
 * @param  {string} friendly    Shown in the prompt dialog
 * @returns {string}            The key string (or '' if user cancels)
 */
export function getApiKey(storageKey, friendly) {
    let key = localStorage.getItem(storageKey);
    if (!key) {
      key = prompt(`Enter your ${friendly} (kept only in this browser)`);
      if (key) localStorage.setItem(storageKey, key.trim());
    }
    return key ?? '';          // empty string if user hit “Cancel”
  }