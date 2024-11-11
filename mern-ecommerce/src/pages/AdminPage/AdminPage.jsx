import { Menu } from "antd";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";

const AdminPage = () => {
  const items = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "product",
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
    },
    {
      key: "order",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
    },
  ];

  const [keySelected, setKeySelected] = useState("");
  const handleOnClick = ({ key }) => {
    console.log("Selected Key:", key); // Kiểm tra key khi click
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <AdminOrder />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Header isHiddenSearch isHiddenCart />
      <div style={{ display: "flex", overflow: "hidden" }}>
        <Menu
          onClick={handleOnClick}
          mode="inline"
          defaultSelectedKeys={["user"]}
          style={{
            width: 256,
            height: "100vh",
            boxShadow: "1px 1px 2px #ccc",
          }}
          items={items}
        />
        <div style={{ flex: "1", padding: "15px 0 15px 15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
