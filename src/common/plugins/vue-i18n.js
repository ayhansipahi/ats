import Vue from "vue";
import VueI18n from "vue-i18n";
import i18nService from "../i18n.service";
import ApiService from "@/common/api.service";

Vue.use(VueI18n);

// get current selected language
const lang = localStorage.getItem("language") || "tr";

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang // set locale
});

export default i18n;

const loadedLanguages = [];

function setI18nLanguage(lang) {
  i18n.locale = lang;
  document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

export async function loadLanguageAsync() {
  const lang = i18nService.getActiveLanguage();
  if (loadedLanguages.includes(lang)) {
    if (i18n.locale !== lang) setI18nLanguage(lang);
    return Promise.resolve();
  }
  const response = await ApiService.query("Language/get", {
    params: {
      languageCode: lang
    }
  });
  let msgs = {};
  try {
    msgs = JSON.parse(response.data.Data.Value);
  } catch (e) {
    throw "invalid language json";
  }

  loadedLanguages.push(lang);
  i18n.setLocaleMessage(lang, msgs);
  setI18nLanguage(lang);
}
