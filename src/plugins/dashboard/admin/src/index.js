import { prefixPluginTranslations } from "@strapi/helper-plugin";

import MonitorIcon from "./MonitorIcon";

export default {
  register(app) {
    app.addMenuLink({
      to: "/plugins/monitor",
      icon: MonitorIcon,
      intlLabel: {
        id: "monitor.label",
        defaultMessage: "Monitor",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    // app.registerPlugin({
    //   id: 'monitor',
    //   initializer: Initializer,
    //   isReady: false,
    //   name,
    // });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
