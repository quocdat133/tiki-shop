import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo_register.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";
import { jwtDecode } from "jwt-decode";

const SignInPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePageSignUp = () => {
    navigate("/sign-up");
  };

  const mutation = useMutationHook((data) => UserService.loginUser(data));
  const { data, isSuccess } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      try {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(
          updateUser({
            ...res?.data,
            access_token: token,
          })
        );
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    [dispatch] // Chỉ thêm các dependencies cần thiết
  );

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data.access_token);
        }
      }
    }
  }, [isSuccess, data, handleGetDetailsUser, location, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password,
    });
    console.log("email , password: ", email, password);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào,</h1>
          <p>Đăng nhập hoặc Tạo tài khoản</p>
          <InputForm
            placeholder="abc@gmail.com"
            type="text"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "10px",
                right: "8px",
                fontSize: "15px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              value={password}
              onChange={handleOnchangePassword}
              type={isShowPassword ? "text" : "password"}
            />
          </div>

          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}

          <Loading isLoading={mutation.isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              text="Đăng nhập"
              type="outline"
              size={40}
              style={{
                border: "none",
                color: "#fff",
                width: "100%",
                height: "48px",
                borderRadius: "4px",
                backgroundColor: "rgb(255, 67, 69)",
                fontWeight: 700,
                fontSize: "15px",
                margin: "26px 0 10px",
              }}
            />
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <p>
            Chưa có tài khoản?
            <WrapperTextLight onClick={handlePageSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua sắm tại Tiki</h4>
          <span>Siêu ưu đãi mỗi ngày</span>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
