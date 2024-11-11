import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });
  const { isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isLoading={mutation.isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>

            <InputForm
              id="name"
              style={{ width: "300px" }}
              value={name}
              onChange={handleOnchangeName}
            />
            <ButtonComponent
              onClick={handleUpdate}
              text="Cập nhật"
              style={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              id="email"
              style={{ width: "300px" }}
              value={email}
              onChange={handleOnchangeEmail}
            />
            <ButtonComponent
              onClick={handleUpdate}
              text="Cập nhật"
              style={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
            <InputForm
              id="phone"
              style={{ width: "300px" }}
              value={phone}
              onChange={handleOnchangePhone}
            />
            <ButtonComponent
              onClick={handleUpdate}
              text="Cập nhật"
              style={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>

            {avatar && (
              <img
                src={avatar}
                style={{
                  objectFit: "cover",
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                }}
                alt="avatar"
              />
            )}
            <ButtonComponent
              onClick={handleUpdate}
              text="Cập nhật"
              style={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">Address</WrapperLabel>
            <InputForm
              id="address"
              style={{ width: "300px" }}
              value={address}
              onChange={handleOnchangeAddress}
            />
            <ButtonComponent
              onClick={handleUpdate}
              text="Cập nhật"
              style={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </WrapperInput>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
