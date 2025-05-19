const lang = navigator.language || navigator.userLanguage;

const langCode = lang.split("-")[0];
const supportedLangs = ["en", "pt"];
const defaultLang = "en";
const langToLoad = supportedLangs.includes(langCode) ? langCode : defaultLang;
const langFile = `./lang/${langToLoad}.json`;
const langFileFallback = `./lang/${defaultLang}.json`;

const loadLangFile = async (file) => {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Error loading language file: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loadLanguage = async () => {
  const langData = await loadLangFile(langFile);
  if (langData) {
    return langData;
  } else {
    return await loadLangFile(langFileFallback);
  }
};

const translatePage = async () => {
  const langData = await loadLanguage();
  if (!langData) {
    console.error("No language data available.");
    return;
  }

  const elementsToTranslate = document.querySelectorAll("[data-i18n]");
  elementsToTranslate.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (langData[key]) {
      element.textContent = langData[key];
    } else {
      console.warn(`Missing translation for key: ${key}`);
    }
  });
};

$(function () {
  $("body").scrollspy({
    target: ".navbar",
    offset: 0,
  });
});

translatePage();
