module.exports = {
  routes: [
    {
      method: "GET",
      path: "/comments/count/view",
      handler: "comment.getCount",
      config: {
        auth: false,
      },
    },
  ],
};
