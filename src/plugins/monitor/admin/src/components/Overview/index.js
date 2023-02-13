import React from "react";
import { Box, Flex, Typography } from "@strapi/design-system";
import { Clock, List } from "@strapi/icons";
import styled from "styled-components";
// import { DraggableContainer, DraggableItem } from "../GridLayout";
// import { Card } from "@strapi/design-system";

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
  // const layout = [
  //   { i: "a", x: 0, y: 0, w: 1, h: 2 },
  //   { i: "b", x: 1, y: 0, w: 3, h: 2 },
  //   { i: "c", x: 4, y: 0, w: 1, h: 2 },
  // ];

  return (
    <>
      {/* <DraggableContainer
        style={{
          width: "100%",
          height: "100%",
          background: "#cc336310",
          borderRadius: 4,
        }}
        layout={layout}
        cols={12}
        rowHeight={30}
      >
        <DraggableItem key="a" component={Card}>
          123
        </DraggableItem>
        <DraggableItem key="b" component={Card}>
          b
        </DraggableItem>
        <DraggableItem key="c" component={Card}>
          c
        </DraggableItem>
      </DraggableContainer> */}
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
