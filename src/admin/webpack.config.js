"use strict";
const path = require("path");

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  /**
   * Overwrite the dashboard home Component
   */
  /* config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/pages\/HomePage\/index\.js/,
      path.resolve(__dirname, "pages/HomePage.js")
    )
  ); */
  config.resolve.alias = {
    ...config.resolve.alias,
    moment$: path.dirname(require.resolve("moment")),
    "react-chartjs-2$": path.dirname(require.resolve("react-chartjs-2")),
    "react-grid-layout$": path.dirname(require.resolve("react-grid-layout")),
    components: path.resolve(__dirname, "components"),
    utils: path.resolve(__dirname, "utils"),
  };

  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          // require.resolve("@babel/preset-env"),
          require.resolve("@babel/preset-react"),
        ],
      },
    },
  });

  return config;
};
