import React from "react";
import { Box, Flex, Typography } from "@strapi/design-system";
import { Clock, List } from "@strapi/icons";
import styled from "styled-components";

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
`;

const GridItem = ({ ...props }) => {
  const bg = `https://picsum.photos/200/100?id=${Math.random()}`;
  return (
    <StyledGridItem {...props} style={{ backgroundImage: `url(${bg})` }} />
  );
};

const StyledGridItem = styled.div`
  width: 100%;
  aspect-ratio: 2/1;
  background-color: #ccc;
  background-size: contain;
  border-radius: 4px;
  overflow: hidden;
  padding: 8px 12px;
  cursor: pointer;
`;

export default function Overview() {
  return (
    <>
      <Flex marginTop={10}>
        <Box marginRight={4}>
          <Clock />
        </Box>
        <Typography variant="beta">Recently viewed</Typography>
      </Flex>
      <Grid marginTop={6}>
        <GridItem>
          <Typography variant="delta" style={{ color: "white" }}>
            Personal
          </Typography>
        </GridItem>
      </Grid>
      <Box marginTop={10}>
        <Typography variant="beta" textColor="neutral500">
          YOUR WORKSPACES
        </Typography>
      </Box>
      <Flex marginTop={8}>
        <Box marginRight={4}>
          <List />
        </Box>
        <Typography variant="beta">Todo charts</Typography>
      </Flex>
      <Grid marginTop={6}>
        <GridItem>
          <Typography variant="delta" style={{ color: "white" }}>
            Personal
          </Typography>
        </GridItem>
      </Grid>
      <Flex marginTop={8}>
        <Box marginRight={4}>
          <List />
        </Box>
        <Typography variant="beta">Other projects</Typography>
      </Flex>
      <Grid marginTop={6}>
        <GridItem>
          <Typography variant="delta" style={{ color: "white" }}>
            KKapp
          </Typography>
        </GridItem>
        <GridItem>
          <Typography variant="delta" style={{ color: "white" }}>
            Pipeline Parallelism
          </Typography>
        </GridItem>
      </Grid>
    </>
  );
}
