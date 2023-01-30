"use strict";
const path = require("path");

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  /**
   * Overwrite the dashboard home Component
   */
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/pages\/HomePage\/index\.js/,
      path.resolve(__dirname, "pages/HomePage.js")
    )
  );
  config.resolve.alias = {
    ...config.resolve.alias,
    moment$: path.dirname(require.resolve("moment")),
    components: path.resolve(__dirname, "components"),
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
