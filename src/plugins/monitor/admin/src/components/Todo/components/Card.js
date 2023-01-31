import React from "react";
import styled from "styled-components";
import { Flex, Box, Initials } from "@strapi/design-system";
import { CheckCircle } from "@strapi/icons";
import { Draggable } from "react-beautiful-dnd";

const TodoCard = ({
  todo,
  index,
  removeCard,
  updateCard,
  children,
  ...props
}) => (
  <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
    {(provided, snapshot) => (
      <>
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div style={{ paddingBottom: 12 }}>
            <StyledTodoCard
              {...props}
              style={{
                boxShadow: snapshot.isDragging
                  ? "rgba(0, 0, 0, 0.2) 0px 19px 38px, rgba(0, 0, 0, 0.11) 0px 15px 12px"
                  : "none",
              }}
            >
              <Flex alignItems="center">
                <Box marginRight={4}>
                  <CheckCircle />
                </Box>
                {todo.title}
              </Flex>
              <Flex justifyContent="space-between" marginTop={6}>
                <Initials>KW</Initials>
                <Box>2</Box>
              </Flex>
            </StyledTodoCard>
          </div>

          {provided.placeholder}
        </div>
      </>
    )}
  </Draggable>
);

const StyledTodoCard = styled("div")`
  padding: 12px;
  border: 1px #e2e4e5 solid;
  border-radius: 12px;
  box-shadow: none;
  cursor: pointer;
  background: white;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    background: #ebecf0;
  }
`;

export default TodoCard;
