import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from "antd";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperHeaderSmall,
  WrapperTextHeader,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { searchProduct } from "../../redux/slides/productSlide";

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
    navigate("/");
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  // -------------search------------------
  const [search, setSearch] = useState("");

  const onSearch = (e) => {
    console.log("e.target.value: ", e.target.value);
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  // ------------------order------------------
  const order = useSelector((state) => state?.order);
  console.log("order: ", order);

  // ---------------------popup-----------------
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  return (
    <div>
      {/* gutter tạo khoảng cách giữa các col trong ant design */}
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        <Col span={5}>
          <WrapperTextHeader to="/">
            <img
              src="/assets/icon/tiki.png"
              alt="tiki icon"
              style={{ width: "80px", height: "40px" }}
            />
            <p style={{ color: "white", margin: "5px 0px" }}>Tốt & Nhanh</p>
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13} style={{ display: "flex" }}>
            <ButtonInputSearch onSearch={onSearch} value={search} />
          </Col>
        )}

        <Col
          span={6}
          style={{
            display: "flex",
            gap: "54px",
            alignItems: "center",
          }}
        >
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    objectFit: "cover",
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsOpenPopup((prev) => !prev)}
                    >
                      {userName?.length ? user?.name : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperHeaderSmall>Đăng nhập/ Đăng ký</WrapperHeaderSmall>
                  <div>
                    <WrapperHeaderSmall>Tài khoản</WrapperHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div
              onClick={() => navigate("/order")}
              style={{ cursor: "pointer" }}
            >
              <Badge count={order?.orderItems?.length || 0} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>
              <WrapperHeaderSmall>Giỏ hàng</WrapperHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default Header;
