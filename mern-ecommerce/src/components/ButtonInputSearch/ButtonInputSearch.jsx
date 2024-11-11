import React from "react";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { SearchOutlined } from "@ant-design/icons";

const ButtonInputSearch = (props) => {
  const { onSearch } = props;
  return (
    <>
      <InputComponent
        size="large"
        placeholder="Tìm kiếm"
        text="Tìm kiếm"
        style={{
          borderRadius: "0",
          border: "none",
          boxShadow: "none",
          backgroundColor: "#fff",
        }}
        onChange={onSearch}
      />
      <ButtonComponent
        size="large"
        type="primary"
        text="Tìm kiếm"
        style={{
          backgroundColor: "rgb(13, 92, 182)",
          color: "#fff",
          borderRadius: "0",
        }}
        icon={<SearchOutlined />}
      />
    </>
  );
};

export default ButtonInputSearch;
