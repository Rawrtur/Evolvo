import React from "react";
import "./button.css";

function Button({ title, onPress, disabled = false, innerPadding=30 }) {
  return (
    <button onClick={onPress} className="button" style={{
      paddingLeft: innerPadding,
      paddingRight: innerPadding
    }} disabled={disabled}>
      {title}
    </button>
  );
}

export default Button;
