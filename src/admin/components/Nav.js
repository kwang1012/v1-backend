import React from "react";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { Tooltip } from "@strapi/design-system/Tooltip";
import Layout from "@strapi/icons/Layout";
import Cross from "@strapi/icons/Cross";
import styled from "styled-components";

const ToggleButton = styled.div`
  cursor: pointer;
  & path {
    fill: #7a7b7c;
  }
  &.editing {
    & path {
      fill: #ee5e52;
    }
  }
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Nav({ onToggle, editing }) {
  return (
    <Flex justifyContent="space-between">
      <Typography as="h2" variant="alpha">
        Good morning, Kai!
      </Typography>
      <Box>
        <Tooltip description={editing ? "Done" : "Edit layout"}>
          <ToggleButton className={editing ? "editing" : ""} onClick={onToggle}>
            {editing ? <Cross /> : <Layout />}
          </ToggleButton>
        </Tooltip>
      </Box>
    </Flex>
  );
}
