import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <h5
        style={{
          fontSize: "15px",
          marginTop: "5px",
          marginBottom: "10px",
          height: "20px",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            color: "rgb(11, 116, 229)",
          }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </span>
        <span> - Chi tiết sản phẩm</span>
      </h5>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
