import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import official from "../../assets/images/official.png";
import { useNavigate } from "react-router";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const {
    countInStock,
    name,
    price,
    rating,
    selled,
    discount,
    id,
    image,
    description,
    type,
  } = props;
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <WrapperCardStyle
      hoverable
      header={{ width: "200xp", height: "200px" }}
      style={{ width: 200 }}
      body={{ padding: "10px" }}
      cover={<img alt="example" src={image} />}
      onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
      disabled={countInStock === 0}
    >
      <img
        src={official}
        alt="official"
        style={{
          height: "14px",
          width: "68px",
          position: "absolute",
          top: "0",
          left: "0",
          borderTopLeftRadius: "3px",
        }}
      />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span>{rating}</span>
          <StarFilled style={{ color: "yellow", fontSize: "10px" }} />
        </span>
        <WrapperStyleTextSell>| Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{convertPrice(price)}</span>
        <WrapperDiscountText>- {discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
