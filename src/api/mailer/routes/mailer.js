module.exports = {
  routes: [
    {
      method: "GET",
      path: "/mailer/sample",
      handler: "mailer.sample",
      config: {
        auth: false,
      },
    },
  ],
};
