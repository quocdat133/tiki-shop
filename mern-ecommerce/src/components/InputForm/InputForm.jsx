import React from "react";
import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const { size, placeholder = "Nhập text", style, value, onChange, ...rests } = props;
  return (
    <WrapperInputStyle
      placeholder={placeholder}
      style={style}
      {...rests}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputForm;
