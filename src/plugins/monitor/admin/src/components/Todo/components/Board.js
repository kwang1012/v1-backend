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
    <div>
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
      <Droppable droppableId={id.toString()}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
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
      <AddButton
        fullWidth
        variant="ghost"
        large={items.length === 0}
        onClick={() => setIsVisible(true)}
      >
        <Plus />
        Add Task
      </AddButton>
    </div>
  );
};

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
`;

export default Board;
