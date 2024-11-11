import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();
  const handlePageSignIn = () => {
    navigate("/sign-in");
  };

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handlePageSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnchangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
    console.log("sign - up: ", email, password, confirmPassword);
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
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "10px",
                right: "8px",
                fontSize: "15px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={mutation.isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              text="Đăng ký"
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
            Bạn đã có tài khoản?
            <WrapperTextLight onClick={handlePageSignIn}>
              Đăng nhập
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

export default SignUpPage;
