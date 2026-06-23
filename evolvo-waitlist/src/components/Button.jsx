import React from "react";
import "./button.css";

function Button({ title, onPress }) {
  return (
    <button onClick={onPress} className="button">
      {title}
    </button>
  );
}

export default Button;
