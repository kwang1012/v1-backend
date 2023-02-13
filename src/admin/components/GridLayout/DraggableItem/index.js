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
  ({ component, children, ...props }, ref) => {
    return (
      <>
        {component ? (
          <div ref={ref}>{createElement(component, props, ...children)}</div>
        ) : (
          <Container {...props} />
        )}
      </>
    );
  }
);
