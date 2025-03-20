let blocklist = [];

// Load blocklist from storage on startup
chrome.storage.sync.get("blocklist", (data) => {
  blocklist = data.blocklist || [];
});

// Listen for web requests and block if the URL matches the blocklist
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    return { cancel: true };
  },
  { urls: blocklist },
  ["blocking"]
);

// Listen for updates to the blocklist
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateBlocklist") {
    blocklist = message.blocklist.map(domain => `*://${domain}/*`);
    chrome.storage.sync.set({ blocklist: message.blocklist });
    sendResponse({ success: true });
  }
});
