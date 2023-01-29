import AuthLogo from './extensions/logo.png';
import MenuLogo from './extensions/logo.png';
import favicon from './extensions/favicon.ico';

const config = {
  auth: {
    logo: AuthLogo,
  },
  head: {
    favicon: favicon,
  },
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
  menu: {
    logo: MenuLogo,
  },
  theme: {
    // overwrite light theme properties
    light: {
      colors: {
        primary100: '#757ce8',
        primary200: '#757ce8',
        primary500: '#CC3363',
        primary600: '#bf2857',
        primary700: '#bf2857',
        danger700: '#b72b1a'
      },
    },
    // overwrite dark theme properties
    dark: {
       // ...
    }
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
