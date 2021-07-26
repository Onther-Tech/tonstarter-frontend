import i18next, {InitOptions} from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {en} from './locales';

const i18n = i18next;

const options: InitOptions = {
  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  //remove logger
  debug: false,
  resources: {
    en: {
      common: en.en,
    },
  },

  fallbackLng: 'en',
  ns: ['common'],

  defaultNS: 'common',

  react: {
    wait: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    nsMode: 'default',
  },
};

i18n.use(LanguageDetector).init(options);
i18n.changeLanguage(navigator.language, (err, t) => {
  if (err) console.log(`Something went wrong during loading`);
});

export default i18n;
