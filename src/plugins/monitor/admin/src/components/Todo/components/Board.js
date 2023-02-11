import React, { useState } from "react";
import styled from "styled-components";
import { Flex, Typography, Button, Textarea } from "@strapi/design-system";
import { Plus, More } from "@strapi/icons";
import TodoCard from "./Card";
import CustomIconButton from "./IconButton";
import { Droppable } from "react-beautiful-dnd";
import { SimpleMenu, MenuItem } from "@strapi/design-system/SimpleMenu";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { normalize } from "utils";

const Container = styled("div")`
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background-color: #eaebec;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 10px 10px #cacccb;
  }
`;

const AddButton = styled(Button)`
  border: 1px #ccc dashed;
  border-radius: 12px;
  background: #f9f9f9;
  color: #1c1c1c;
  height: ${(props) => (props.large ? "8em" : "2.5em")};
  & span {
    display: flex;
    align-items: center;
  }
  & svg {
    margin-right: 5px;
  }
  &::after {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const Board = ({
  id,
  title,
  items = [],
  addCard,
  removeCard,
  removeBoard,
  updateCard,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState("");

  const createCard = (title) => {
    request("/monitor/todos", {
      method: "POST",
      body: {
        data: {
          title,
          board: id,
        },
      },
    })
      .then((data) => {
        setContent("");
        setIsVisible(false);
        addCard(normalize(data), id);
      })
      .catch(console.log);
  };

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      height="100%"
      overflow="hidden"
    >
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Typography variant="beta">{title}</Typography>
        <Flex>
          <CustomIconButton
            textColor="neutral500"
            icon={<Plus />}
            label="Create"
            onClick={() => setIsVisible(true)}
          />
          <SimpleMenu as={CustomIconButton} icon={<More />} label="More">
            <MenuItem onClick={removeBoard}>Remove</MenuItem>
          </SimpleMenu>
        </Flex>
      </Flex>
      <Container>
        <Droppable droppableId={id.toString()}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: 1, paddingTop: 1 }}
            >
              {items.map((item, i) => (
                <TodoCard
                  key={i}
                  index={i}
                  todo={item}
                  updateCard={updateCard}
                  removeCard={removeCard}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Container>

      <AddButton
        fullWidth
        variant="ghost"
        large={items.length === 0}
        onClick={() => setIsVisible(true)}
      >
        <Plus />
        Add Task
      </AddButton>
      <Dialog
        onClose={() => setIsVisible(false)}
        title="Create a Todo"
        isOpen={isVisible}
      >
        <DialogBody>
          <Textarea
            placeholder="Enter a title for this card..."
            name="title"
            aria-label="Title"
            required
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={() => setIsVisible(false)} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button variant="primary500" onClick={() => createCard(content)}>
              Confirm
            </Button>
          }
        />
      </Dialog>
    </Flex>
  );
};

export default Board;
