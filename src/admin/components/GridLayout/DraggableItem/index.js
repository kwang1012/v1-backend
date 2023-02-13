import React, { forwardRef, createElement } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: move;
`;

export const DraggableItem = forwardRef(
  ({ component, children, className, ...props }, ref) => {
    return (
      <>
        {component ? (
          <div ref={ref} {...props}>
            {createElement(component, { className, height: "100%" }, children)}
          </div>
        ) : (
          <Container {...props} />
        )}
      </>
    );
  }
);
