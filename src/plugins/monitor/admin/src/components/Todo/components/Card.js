import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Flex, Box, Badge, Typography } from "@strapi/design-system";
import { CheckCircle } from "@strapi/icons";
import { Draggable } from "react-beautiful-dnd";
import moment from "moment";
import CardDetail from "./CardDetail";

const Avatar = styled(Box)`
  background: #bf2857;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: white;
  line-height: 24px;
  text-align: center;
  font-size: 0.7rem;
`;

const StyledTodoCard = styled.div`
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

const TodoCard = ({
  todo,
  index,
  removeCard,
  updateCard,
  children,
  ...props
}) => {
  const badgeProps = useMemo(() => {
    let backgroundColor = "neutral150";
    let textColor = "neutral600";
    switch (todo.priority || "normal") {
      case "low":
        textColor = "neutral900";
        backgroundColor = "secondary500";
        break;
      case "normal":
        textColor = "neutral900";
        backgroundColor = "warning500";
        break;
      case "high":
        textColor = "neutral0";
        backgroundColor = "danger600";
        break;
    }
    return {
      backgroundColor,
      textColor,
    };
  }, [todo]);
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <Draggable key={`todo-draggable-${todo.id}`} draggableId={`todo-draggable-${todo.id}`} index={index}>
        {(provided, snapshot) => (
          <>
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div style={{ paddingBottom: 12 }} className="drag-target">
                <StyledTodoCard
                  {...props}
                  style={{
                    boxShadow: snapshot.isDragging
                      ? "rgba(0, 0, 0, 0.2) 0px 19px 38px, rgba(0, 0, 0, 0.11) 0px 15px 12px"
                      : "none",
                  }}
                  onClick={() => setIsVisible(true)}
                >
                  <Flex alignItems="center">
                    <Box marginRight={3}>
                      <CheckCircle />
                    </Box>
                    <Typography ellipsis>{todo.title}</Typography>
                  </Flex>
                  <Flex justifyContent="start" marginTop={2}>
                    <Badge {...badgeProps}>{todo.priority || "normal"}</Badge>
                  </Flex>
                  <Flex justifyContent="space-between" marginTop={6}>
                    <Flex alignItems="center">
                      <Avatar marginRight={2}>KW</Avatar>
                      <Typography textColor="neutral600" variant="pi">
                        {todo.due && moment(todo.due).format("M-DD")}
                      </Typography>
                    </Flex>
                    <Box>
                      <Typography textColor="neutral600" variant="pi">
                        2
                      </Typography>
                    </Box>
                  </Flex>
                </StyledTodoCard>
              </div>
              {provided.placeholder}
            </div>
          </>
        )}
      </Draggable>
      {isVisible && (
        <CardDetail todo={todo} onClose={() => setIsVisible(false)} />
      )}
    </>
  );
};

export default TodoCard;
