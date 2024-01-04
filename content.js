let dictionary;

// Загрузка словаря для Typo.js
function loadDictionary() {
    const affPath = chrome.runtime.getURL('Dic/English (American).aff');
    const dicPath = chrome.runtime.getURL('Dic/English (American).dic');

    Promise.all([
        fetch(affPath).then(response => response.text()),
        fetch(dicPath).then(response => response.text())
    ]).then(([affData, dicData]) => {
        dictionary = new Typo("en_US", affData, dicData);
    });
}

// Подчеркивание ошибок
function underlineErrors(errors) {
    errors.forEach(error => {
        const regex = new RegExp(`\\b${error}\\b`, 'gi');
        document.body.innerHTML = document.body.innerHTML.replace(regex, `<span class="grammar-error">${error}</span>`);
    });
}

// Проверка текста на странице
function checkSpelling() {
    const text = document.body.innerText;
    const words = text.split(/\s+/);
    const errors = words.filter(word => !dictionary.check(word));
    underlineErrors(errors);
    return errors.length;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePage") {
        if (!dictionary) {
            loadDictionary();
            sendResponse({error: "Dictionary is not loaded yet."});
            return;
        }
        const numErrors = checkSpelling();
        sendResponse({ errors: numErrors });
    }
    return true;
});

// При инъекции скрипта начинаем загрузку словаря
loadDictionary();
