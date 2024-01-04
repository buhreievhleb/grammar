document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (!currentTab.url.startsWith('http://') && !currentTab.url.startsWith('https://')) {
          console.error('This is not a web page.');
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          function: pageScript,
        });
      });
    });
  });
  
  function pageScript() {
    chrome.runtime.sendMessage({ action: "analyzePage" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else if (response) {
        console.log(`Errors found: ${response.errors}`);
      }
    });
  }
  