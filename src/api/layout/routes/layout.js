module.exports = {
  routes: [
    {
      method: "GET",
      path: "/layout",
      handler: "layout.getLayout",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/layout",
      handler: "layout.updateLayout",
      config: {
        auth: false,
      },
    },
  ],
};
