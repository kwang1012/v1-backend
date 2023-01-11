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
    {
      method: "POST",
      path: "/mailer/on-message",
      handler: "mailer.onMessage",
      config: {
        auth: false,
      },
    },
  ],
};
