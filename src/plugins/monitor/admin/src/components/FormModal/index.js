/**
 *
 * FormModal
 *
 */

import React, { useEffect, useState, useMemo } from "react";
import { useIntl } from "react-intl";
import { Button } from "@strapi/design-system/Button";
import { Stack } from "@strapi/design-system/Stack";
import { Breadcrumbs, Crumb } from "@strapi/design-system/Breadcrumbs";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@strapi/design-system/ModalLayout";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { Form, request } from "@strapi/helper-plugin";
import Input from "./Input";

const FormModal = ({
  headerBreadcrumbs,
  initialData,
  isSubmiting,
  layout,
  isOpen,
  onSubmit,
  onToggle,
  providerToEditName,
}) => {
  const { formatMessage } = useIntl();
  const [repos, setRepos] = useState(null);

  useEffect(() => {
    if (isOpen && providerToEditName === "repo") {
      request("/monitor/github/repos")
        .then((data) => setRepos(data))
        .catch(console.log);
    }
  }, [isOpen]);

  const options = useMemo(
    () => ({
      ...(providerToEditName === "repo"
        ? {
            repos,
          }
        : {}),
    }),
    [repos]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ModalLayout onClose={onToggle} labelledBy="title">
      <ModalHeader>
        <Breadcrumbs label={headerBreadcrumbs.join(", ")}>
          {headerBreadcrumbs.map((crumb) => (
            <Crumb key={crumb}>{crumb}</Crumb>
          ))}
        </Breadcrumbs>
      </ModalHeader>
      <Formik
        onSubmit={(values) => onSubmit(values)}
        initialValues={initialData}
        validationSchema={layout.schema}
        validateOnChange={false}
      >
        {({ errors, handleChange, values }) => {
          return (
            <Form>
              <ModalBody>
                <Stack spacing={1}>
                  <Grid gap={5}>
                    {layout.form.map((row) =>
                      row.map(
                        (input) =>
                          (input.name !== "repos" || repos) && (
                            <GridItem key={input.name} col={input.size} xs={12}>
                              <Input
                                {...input}
                                error={errors[input.name]}
                                onChange={handleChange}
                                value={values[input.name]}
                                providerToEditName={providerToEditName}
                                options={options[input.name]}
                              />
                            </GridItem>
                          )
                      )
                    )}
                  </Grid>
                </Stack>
              </ModalBody>
              <ModalFooter
                startActions={
                  <Button variant="tertiary" onClick={onToggle} type="button">
                    {formatMessage({
                      id: "app.components.Button.cancel",
                      defaultMessage: "Cancel",
                    })}
                  </Button>
                }
                endActions={
                  <Button type="submit" loading={isSubmiting}>
                    {formatMessage({
                      id: "global.save",
                      defaultMessage: "Save",
                    })}
                  </Button>
                }
              />
            </Form>
          );
        }}
      </Formik>
    </ModalLayout>
  );
};

FormModal.defaultProps = {
  initialData: null,
  providerToEditName: null,
};

FormModal.propTypes = {
  headerBreadcrumbs: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialData: PropTypes.object,
  layout: PropTypes.shape({
    form: PropTypes.arrayOf(PropTypes.array),
    schema: PropTypes.object,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isSubmiting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  providerToEditName: PropTypes.string,
};

export default FormModal;
