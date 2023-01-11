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
  "email-designer": {
    config: {
      editor: {
        // projectId: [UNLAYER_PROJECT_ID],
        tools: {
          heading: {
            properties: {
              text: {
                value: "This is the new default text!",
              },
            },
          },
        },
        options: {
          features: {
            colorPicker: {
              presets: ["#cc3363", "#F47373", "#697689", "#37D67A"],
            },
          },
          fonts: {
            showDefaultFonts: false,
            customFonts: [
              {
                label: "Anton",
                value: "'Anton', sans-serif",
                url: "https://fonts.googleapis.com/css?family=Anton",
              },
              {
                label: "Lato",
                value: "'Lato', Tahoma, Verdana, sans-serif",
                url: "https://fonts.googleapis.com/css?family=Lato",
              },
            ],
          },
          mergeTags: [
            {
              name: "Email",
              value: "{{= USER.username }}",
              sample: "kswang@kwang.cc",
            },
          ],
        },
        appearance: {
          theme: "dark",
          panels: {
            tools: {
              dock: "left",
            },
          },
        },
      },
    },
  },
});
