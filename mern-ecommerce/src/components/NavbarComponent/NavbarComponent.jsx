import React from "react";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextValue,
  WrapperTextPrice,
} from "./style";
import { Checkbox, Rate } from "antd";

const NavbarComponent = () => {
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <span>{option}</span>;
        });

      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );

      case "star":
        return options.map((option) => {
          return (
            <div style={{ display: "flex" }}>
              <Rate
                disabled
                defaultValue={option}
                style={{ fontSize: "12px", paddingRight: "4px" }}
              />
              <span>{`từ ${option} sao`}</span>
            </div>
          );
        });

      case "price":
        return options.map((option) => {
          return <span>{option}</span>;
        });

      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLabelText>Danh mục</WrapperLabelText>

      <WrapperTextValue>
        <WrapperContent>
          {renderContent("text", ["Tủ lạnh", "TV", "Máy giặt"])}
        </WrapperContent>

        <WrapperContent>
          {renderContent("checkbox", [
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ])}
        </WrapperContent>

        <WrapperContent>{renderContent("star", [3, 4, 5])}</WrapperContent>

        <WrapperTextPrice>
          <WrapperContent>
            {renderContent("price", ["Giá từ 40.000", "Trên 50.0000"])}
          </WrapperContent>
        </WrapperTextPrice>
      </WrapperTextValue>
    </div>
  );
};

export default NavbarComponent;
