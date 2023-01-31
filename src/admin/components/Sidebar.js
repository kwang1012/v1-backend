import React from "react";
import styled from "styled-components";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import {
  Card,
  CardBody,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system/Card";
import { IconButton } from "@strapi/design-system/IconButton";
import { TextButton } from "@strapi/design-system/TextButton";
import { Button } from "@strapi/design-system/Button";
import { ProgressBar } from "@strapi/design-system/ProgressBar";
import { Initials } from "@strapi/design-system/Avatar";
import ChevronDown from "@strapi/icons/ChevronDown";
import Calendar from "@strapi/icons/Calendar";
import Bell from "@strapi/icons/Bell";
import Message from "@strapi/icons/Message";
import Discuss from "@strapi/icons/Discuss";
import { useAppInfos } from "@strapi/helper-plugin";

const Wrapper = styled(Box)`
  padding: 12px;
  background-color: #fcedf2;
  border-radius: 16px;
  height: calc(100vh - 48px);
  grid-column: span 3;
  position: sticky;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const CustomProgressBar = styled(ProgressBar)`
  background: #fcedf2;
  height: 15px;
  border-radius: 8px;
  &::before {
    border-radius: 8px;
    background: #cc3363;
  }
`;

const Dot = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export default function Sidebar({ todos }) {
  const { userDisplayName } = useAppInfos();

  const initials = userDisplayName
    .split(" ")
    .map((name) => name.substring(0, 1))
    .join("")
    .substring(0, 2);
  return (
    <Wrapper>
      <Flex justifyContent="end">
        <Box marginRight={2}>
          <IconButton icon={<Calendar />} label="Calendar" />
        </Box>
        <Box marginRight={2}>
          <IconButton icon={<Bell />} label="Notifications" />
        </Box>
        <Box marginRight={2}>
          <IconButton icon={<Message />} label="Message" />
        </Box>
        <TextButton>
          <Flex>
            <Box marginRight={1}>
              <Initials>{initials}</Initials>
            </Box>
            <ChevronDown />
          </Flex>
        </TextButton>
      </Flex>
      <Flex marginTop={4} direction="column" alignItems="stretch" flex="1">
        <Card padding={4} marginBottom={6}>
          <Typography variant="beta">Formation status</Typography>
          <Box marginTop={3} marginBottom={3}>
            <Typography>In progress</Typography>
          </Box>
          <CustomProgressBar style={{ width: "100%" }} value={80}>
            80%
          </CustomProgressBar>
          <Flex
            direction="column"
            alignItems="center"
            marginTop={3}
            marginBottom={3}
          >
            <Typography variant="omega" fontWeight="bold">
              Estimated processing
            </Typography>
            <Typography>4-5 business days</Typography>
          </Flex>
          <Button fullWidth>View status</Button>
        </Card>
        <Typography variant="delta">Your to-Do list</Typography>
        {todos.map((todo, i) => (
          <Card key={i} marginTop={i == 0 ? 6 : 1}>
            <CardBody>
              <Box
                padding={2}
                style={{ borderRadius: 12 }}
                background="neutral200"
              >
                <Discuss />
              </Box>
              <CardContent paddingLeft={2}>
                <CardTitle>{todo.title}</CardTitle>
                <CardSubtitle>{todo.time}</CardSubtitle>
              </CardContent>
              <CardBadge>{todo.priority}</CardBadge>
            </CardBody>
          </Card>
        ))}
        <Card marginTop="auto" padding={2}>
          <Flex>
            <Dot margin={2} background="primary500" />
            <CardContent paddingLeft={2}>
              <CardTitle>Board meeting</CardTitle>
              <CardSubtitle>Feb 22 at 6:00 pm</CardSubtitle>
              <Typography variant="pi" textColor="neutral200" lineHeight={0}>
                You have been invited to attend a meeting of the Board
                Directors.
              </Typography>
            </CardContent>
          </Flex>
        </Card>
      </Flex>
    </Wrapper>
  );
}
