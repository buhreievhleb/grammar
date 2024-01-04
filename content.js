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
  } catch (error) {
    console.error('Failed to load dictionary:', error);
  }
}



// Проверка текста на странице
function checkSpelling() {
    const text = document.body.innerText;
    const words = text.split(/\s+/);
    const errors = words.filter(word => !dictionary.check(word));
    underlineErrors(errors);
    return errors.length;
}

// Подчеркивание ошибок
function underlineErrors(errors) {
    errors.forEach(error => {
        const regex = new RegExp(`\\b${error}\\b`, 'gi');
        document.body.innerHTML = document.body.innerHTML.replace(regex, `<span class="grammar-error">${error}</span>`);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePage") {
        if (!dictionary) {
            loadDictionary().then(() => {
                const numErrors = checkSpelling();
                sendResponse({ errors: numErrors });
            }).catch(error => {
                console.error('Error loading dictionary:', error);
                sendResponse({ errors: 0 });
            });
        } else {
            const numErrors = checkSpelling();
            sendResponse({ errors: numErrors });
        }
    }
    return true; // Для асинхронной отправки ответа
});

// При запуске скрипта начинаем загрузку словаря
if (!dictionary) {
    loadDictionary();
}
