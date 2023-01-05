module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "localhost"),
        port: env("SMTP_PORT", 25),
      },
      settings: {
        defaultFrom: "Kai Wang <kswang@kkapp.cc>",
        defaultReplyTo: "kswang@kkapp.cc",
      },
    },
  },
});
