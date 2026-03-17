import React, { useState, useRef } from "react";
import "./Tooltip.css";

export const Tooltip = ({ text, children, position = "top" }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <span className={`tooltip-box tooltip-${position}`}>{text}</span>
      )}
    </span>
  );
};
