import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useIntl } from "react-intl";
import {
  SettingsPageTitle,
  LoadingIndicatorPage,
  useNotification,
  request,
  onRowClick,
  stopPropagation,
  useOverlayBlocker,
  useFocusWhenNavigate,
} from "@strapi/helper-plugin";
import upperFirst from "lodash/upperFirst";
import { Main, IconButton } from "@strapi/design-system";
import { useNotifyAT } from "@strapi/design-system/LiveRegions";
import {
  HeaderLayout,
  Layout,
  ContentLayout,
} from "@strapi/design-system/Layout";
import Pencil from "@strapi/icons/Pencil";
import { Table, Thead, Tr, Th, Tbody, Td } from "@strapi/design-system/Table";
import { Typography } from "@strapi/design-system/Typography";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import createProvidersArray from "./utils/createProvidersArray";
import FormModal from "../../components/FormModal";
import forms from "./utils/forms";
import { fetchData, putProvider } from "./utils/api";
import { getTrad } from "../../utils";

export default function SettingPage() {
  const { formatMessage } = useIntl();
  useFocusWhenNavigate();
  const { notifyStatus } = useNotifyAT();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [providerToEditName, setProviderToEditName] = useState(null);
  const toggleNotification = useNotification();
  const { lockApp, unlockApp } = useOverlayBlocker();

  const {
    isLoading: isLoadingForData,
    data: modifiedData,
    isFetching,
  } = useQuery("get-providers", () => fetchData(toggleNotification), {
    onSuccess() {
      notifyStatus(
        formatMessage({
          id: getTrad("Providers.data.loaded"),
          defaultMessage: "Providers have been loaded",
        })
      );
    },
    initialData: {},
  });

  const isLoading = isLoadingForData || isFetching;

  const submitMutation = useMutation(putProvider, {
    async onSuccess() {
      await queryClient.invalidateQueries("get-providers");
      toggleNotification({
        type: "info",
        message: { id: getTrad("notification.success.submit") },
      });

      // trackUsageRef.current("didEditAuthenticationProvider");
      setIsSubmiting(false);
      handleToggleModal();
      unlockApp();
    },
    onError() {
      toggleNotification({
        type: "warning",
        message: { id: "notification.error" },
      });
      unlockApp();
      setIsSubmiting(false);
    },
    refetchActive: false,
  });

  const providers = useMemo(
    () => createProvidersArray(modifiedData),
    [modifiedData]
  );

  const layoutToRender = useMemo(() => {
    if (providerToEditName === "repo") {
      return forms.repo;
    }
    return forms.providers;
  }, [providerToEditName]);

  const handleToggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickEdit = (provider) => {
    setProviderToEditName(provider.name);
    handleToggleModal();
  };

  const handleSubmit = async (values) => {
    setIsSubmiting(true);

    lockApp();

    // trackUsageRef.current('willEditAuthenticationProvider');

    const body = { ...modifiedData, [providerToEditName]: values };

    submitMutation.mutate({ providers: body });
  };
  return (
    <Layout>
      <SettingsPageTitle name={"Configuration"} />
      <Main labelledBy="title" aria-busy={isSubmiting}>
        <HeaderLayout id="title" title="Monitor settings" />

        {isLoading ? (
          <LoadingIndicatorPage />
        ) : (
          <ContentLayout>
            <Table colCount={3} rowCount={3}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography variant="sigma" textColor="neutral600">
                      Name
                    </Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma" textColor="neutral600">
                      Status
                    </Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">
                      <VisuallyHidden>Settings</VisuallyHidden>
                    </Typography>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {providers.map((provider) => (
                  <Tr
                    key={provider.name}
                    {...onRowClick({
                      fn: () => handleClickEdit(provider),
                    })}
                  >
                    <Td width="45%">
                      <Typography fontWeight="semiBold" textColor="neutral800">
                        {provider.name}
                      </Typography>
                    </Td>
                    <Td width="65%">
                      <Typography
                        textColor={
                          provider.enabled ? "success600" : "danger600"
                        }
                        data-testid={`enable-${provider.name}`}
                      >
                        {provider.enabled
                          ? formatMessage({
                              id: "global.enabled",
                              defaultMessage: "Enabled",
                            })
                          : formatMessage({
                              id: "global.disabled",
                              defaultMessage: "Disabled",
                            })}
                      </Typography>
                    </Td>
                    <Td {...stopPropagation}>
                      <IconButton
                        onClick={() => handleClickEdit(provider)}
                        noBorder
                        icon={<Pencil />}
                        label="Edit"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ContentLayout>
        )}
      </Main>
      <FormModal
        initialData={modifiedData[providerToEditName]}
        isOpen={isOpen}
        isSubmiting={isSubmiting}
        layout={layoutToRender}
        headerBreadcrumbs={["Edit Provider", upperFirst(providerToEditName)]}
        onToggle={handleToggleModal}
        onSubmit={handleSubmit}
        providerToEditName={providerToEditName}
      />
    </Layout>
  );
}
