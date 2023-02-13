/**
 *
 * Input
 *
 */

import React from "react";
import { useIntl } from "react-intl";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { TextInput } from "@strapi/design-system/TextInput";
import { Select, Option } from "@strapi/design-system/Select";
import * as Helper from "@strapi/helper-plugin";
import PropTypes from "prop-types";

const Input = ({
  description,
  disabled,
  intlLabel,
  error,
  name,
  onChange,
  placeholder,
  providerToEditName,
  type,
  value,
  multi = false,
  options = [],
}) => {
  const { formatMessage } = useIntl();
  const inputValue =
    name === "noName"
      ? `${strapi.backendURL}/api/connect/${providerToEditName}/callback`
      : multi && !value
      ? []
      : value;

  const label = formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { provider: providerToEditName, ...intlLabel.values }
  );
  const hint = description
    ? formatMessage(
        { id: description.id, defaultMessage: description.defaultMessage },
        { provider: providerToEditName, ...description.values }
      )
    : "";

  if (type === "bool") {
    return (
      <ToggleInput
        aria-label={name}
        checked={value}
        disabled={disabled}
        hint={hint}
        label={label}
        name={name}
        offLabel={formatMessage({
          id: "app.components.ToggleCheckbox.off-label",
          defaultMessage: "Off",
        })}
        onLabel={formatMessage({
          id: "app.components.ToggleCheckbox.on-label",
          defaultMessage: "On",
        })}
        onChange={(e) => {
          onChange({ target: { name, value: e.target.checked } });
        }}
      />
    );
  }

  const formattedPlaceholder = placeholder
    ? formatMessage(
        { id: placeholder.id, defaultMessage: placeholder.defaultMessage },
        { ...placeholder.values }
      )
    : "";

  const errorMessage = error
    ? formatMessage({ id: error, defaultMessage: error })
    : "";

  if (type === "select") {
    return (
      <Select
        id={name}
        aria-label={name}
        disabled={disabled}
        error={errorMessage}
        label={label}
        name={name}
        onChange={onChange}
        placeholder={formattedPlaceholder}
        value={inputValue}
        clearLabel="Clear"
        multi
        onClear={() => {
          onChange({ target: { name, value: [] } });
        }}
      >
        {options.map((option) => (
          <Option value={option.value}>{option.text}</Option>
        ))}
      </Select>
    );
  }

  return (
    <TextInput
      aria-label={name}
      disabled={disabled}
      error={errorMessage}
      label={label}
      name={name}
      onChange={onChange}
      placeholder={formattedPlaceholder}
      type={type}
      value={inputValue}
    />
  );
};

Input.defaultProps = {
  description: null,
  disabled: false,
  error: "",
  placeholder: null,
  value: "",
};

Input.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }),
  providerToEditName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default Input;
