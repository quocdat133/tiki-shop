import React from "react";
import { Input, Button } from "antd";

const InputSearch = (props) => {
  const { size, placeholder, text } = props;
  return (
    <div style={{ display: "flex" }}>
      <Input
        size={size}
        placeholder={placeholder}
        style={{
          borderRadius: "0",
          border: "none",
          boxShadow: "none",
          backgroundColor: "#fff",
        }}
      />
      <Button
        size={size}
        type="primary"
        icon={<SearchOutlined />}
        style={{
          backgroundColor: "rgb(13, 92, 182)",
          color: "#fff",
          borderRadius: "0",
        }}
      >
        {text}
      </Button>
    </div>
  );
};

export default InputSearch;
