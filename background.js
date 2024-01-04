chrome.runtime.onInstalled.addListener(() => {
    console.log("Grammar Checker Extension successfully installed.");
    chrome.tabs.create({ url: "welcome.html" });
});  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzePage") {
      // Проверьте, загружен ли content.js и готов ли он к обработке запроса
      chrome.tabs.sendMessage(sender.tab.id, { action: "isContentScriptReady" }, (response) => {
        if (response?.ready) {
          sendResponse({ status: 'Content script ready.' });
        } else {
          // content.js еще не готов или не был загружен
          sendResponse({ status: 'Content script not ready.' });
        }
      });
      return true; // возврат true необходим для асинхронной обработки sendResponse
    }
});
  