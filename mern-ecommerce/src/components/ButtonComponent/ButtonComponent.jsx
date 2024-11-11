import React from "react";
import { Button } from "antd";

const ButtonComponent = (props) => {
  const { size, style, text, icon, disabled, ...rests } = props;
  const defaultBackground = disabled ? "#ccc" : "rgb(11, 116, 229)";
  return (
    <Button
      size={size}
      type="primary"
      icon={icon}
      style={{
        background: style?.background || defaultBackground,
        ...style,
      }}
      {...rests}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
