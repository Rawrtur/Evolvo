import React from "react";
import "./button.css";

function Button({ title, onPress, disabled = false }) {
  return (
    <button onClick={onPress} className="button" disabled={disabled}>
      {title}
    </button>
  );
}

export default Button;
