document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('checkButton'); 
    const resultsDiv = document.getElementById('results'); 

    checkButton.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0].url.startsWith('http://') && !tabs[0].url.startsWith('https://')) {
                resultsDiv.textContent = 'This is not a web page.';
                return;
            }
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: () => {
                    chrome.runtime.sendMessage({action: "analyzePage"});
                }
            }, (injectionResults) => {
                if (chrome.runtime.lastError || injectionResults.length === 0) {
                    resultsDiv.textContent = 'Error injecting script.';
                } else {
                    resultsDiv.textContent = 'Spell check started.';
                }
            });
        });
    });
});
