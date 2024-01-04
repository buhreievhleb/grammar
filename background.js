chrome.runtime.onInstalled.addListener(() => {
    console.log("Grammar Checker Extension successfully installed.");
    chrome.tabs.create({ url: "welcome.html" });
});
