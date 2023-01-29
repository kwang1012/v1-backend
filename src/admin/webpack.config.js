"use strict";
const path = require('path')

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  /**
   * Overwrite the dashboard home Component
   */
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /.cache\/admin\/src\/pages\/HomePage\/index\.js/,
      path.resolve(__dirname, "components/HomePage.js")
    )
  );

  return config;
};
