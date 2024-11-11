import React from "react";
import { Input } from "antd";

const InputComponent = (props) => {
  const { size, placeholder, style, ...rests } = props;

  return (
    <Input size={size} placeholder={placeholder} style={style} {...rests} />
  );
};

export default InputComponent;
