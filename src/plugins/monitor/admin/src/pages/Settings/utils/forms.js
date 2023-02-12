import * as yup from "yup";
import { translatedErrors } from "@strapi/helper-plugin";

const enabledDescription = {
  id: "enabledDescription",
  defaultMessage: "If disabled, you won't be able to use this provider.",
};
const enabledLabel = {
  id: "enabledLable",
  defaultMessage: "Enable",
};
const keyLabel = {
  id: "keyLabel",
  defaultMessage: "Token",
};
const textPlaceholder = {
  id: "textPlaceholder",
  defaultMessage: "TEXT",
};

const forms = {
  providers: {
    form: [
      [
        {
          intlLabel: enabledLabel,
          name: "enabled",
          type: "bool",
          description: enabledDescription,
          size: 6,
          validations: {
            required: true,
          },
        },
      ],
    ],
    schema: yup.object().shape({
      enabled: yup.bool().required(translatedErrors.required),
    }),
  },
  repo: {
    form: [
      [
        {
          intlLabel: enabledLabel,
          name: "enabled",
          type: "bool",
          description: enabledDescription,
          size: 6,
          validations: {
            required: true,
          },
        },
      ],
      [
        {
          intlLabel: keyLabel,
          name: "key",
          type: "text",
          placeholder: textPlaceholder,
          size: 12,
          validations: {
            required: true,
          },
        },
      ],
    ],
    schema: yup.object().shape({
      enabled: yup.bool().required(translatedErrors.required),
      key: yup.string().when("enabled", {
        is: true,
        then: yup.string().required(translatedErrors.required),
        otherwise: yup.string(),
      }),
    }),
  },
};

export default forms;
