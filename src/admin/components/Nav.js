import React from "react";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import ChevronLeft from "@strapi/icons/ChevronLeft";
import ChevronRight from "@strapi/icons/ChevronRight";

export default function Nav() {
  return (
    <Flex justifyContent="space-between">
      <Typography as="h2" variant="alpha">
        Good morning, Kai!
      </Typography>
      <Box>
        <ChevronLeft />
        <ChevronRight />
      </Box>
    </Flex>
  );
}
