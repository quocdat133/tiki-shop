import React from "react";
import { useNavigate } from "react-router";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .replace(/\s+/g, "_")}` // Replace spaces with underscores
    );
  };
  return (
    <div
      style={{ padding: "0 10px", color: " rgb(39, 39, 42)" }}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>
  );
};

export default TypeProduct;
