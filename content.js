let dictionary;

async function loadDictionary() {
  try {
    const affPath = chrome.runtime.getURL('Dic/English.aff');
    const dicPath = chrome.runtime.getURL('Dic/English.dic');
    const [affResponse, dicResponse] = await Promise.all([
      fetch(affPath), fetch(dicPath)
    ]);
    const [affData, dicData] = await Promise.all([
      affResponse.text(), dicResponse.text()
    ]);
    dictionary = new Typo("en_US", affData, dicData, { platform: 'any' });
    console.log("Dictionary loaded successfully.");
  } catch (error) {
    console.error('Failed to load dictionary:', error);
  }
}

function underlineErrors(errors) {
  errors.forEach(error => {
    const regex = new RegExp(`\\b${error}\\b`, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, 
      `<span class="grammar-error" style="border-bottom: 2px solid red;">${error}</span>`);
  });
}

async function checkSpelling() {
  if (!dictionary) {
    await loadDictionary();
  }
  const text = document.body.innerText;
  const words = text.split(/\s+/);
  const errors = words.filter(word => !dictionary.check(word));
  underlineErrors(errors);
  return errors.length;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    const numErrors = await checkSpelling();
    sendResponse({ errors: numErrors });
  }
  return true;
});

if (!dictionary) {
  loadDictionary();
}
