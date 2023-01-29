import AuthLogo from "./extensions/logo.png";
import MenuLogo from "./extensions/logo.png";
import favicon from "./extensions/favicon.ico";

const config = {
  auth: {
    logo: AuthLogo,
  },
  head: {
    favicon: favicon,
  },
  locales: [],
  translations: {
    en: {
      "Auth.form.welcome.title": "Welcome to KKapp!",
      "app.components.LeftMenu.navbrand.title": "KKapp Dashboard",
    },
  },
  menu: {
    logo: MenuLogo,
  },
  theme: {
    light: {
      colors: {
        primary100: "#fcedf2",
        primary200: "#ed87a7",
        primary500: "#CC3363",
        primary600: "#bf2857",
        primary700: "#a8204a",
        buttonPrimary500: "#CC3363",
        buttonPrimary600: "#bf2857",
        danger700: "#b72b1a",
      },
    },
    dark: {},
  },
};

const bootstrap = (app) => {};

export default {
  config,
  bootstrap,
};
