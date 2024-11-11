import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
  WrapperInfo,
  WrapperLeft,
  WrapperRight,
  WrapperTotal,
  WrapperRadio,
  Label,
} from "./style";
import { Form, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";

const PaymentPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state?.order);
  const dispatch = useDispatch();
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");

  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result || 0;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + cur.discount * cur.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000) {
      return 10000;
    } else if (priceMemo === 0) {
      return 0;
    } else return 20000;
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  // ----------------------thông tin giao hàng-----------------------
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        name: user?.name,
        city: user?.city,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleOnChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  // -----------thay đổi địa chỉ--------------
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const mutationAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const {
    isSuccess: isSuccessAddOrder,
    isError: isErrorAddOrder,
    data: dataAddOrder,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccessAddOrder && dataAddOrder?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isErrorAddOrder) {
      message.error("Đặt hàng thất bại");
    }
  }, [isSuccessAddOrder, isErrorAddOrder, dataAddOrder]);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemSelected,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
      });
    }
  };

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}>
          Thanh toán
        </h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperInfo>
              <div>
                <Label>Chọn phương thức thanh toán</Label>
                <WrapperRadio onChange={handleDelivery} value={delivery}>
                  <Radio value="fast" style={{ marginTop: "5px" }}>
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        marginRight: "5px",
                      }}
                    >
                      FAST
                    </span>
                    Giao hàng tiết kiệm
                  </Radio>
                  <Radio value="gojek" style={{ marginTop: "5px" }}>
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        marginRight: "5px",
                      }}
                    >
                      GOJEK
                    </span>
                    Giao hàng tiết kiệm
                  </Radio>
                </WrapperRadio>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              <div>
                <Label htmlFor="">Chọn phương thức thanh toán</Label>
                <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money">
                    Thanh toán tiền mặt khi nhận hàng
                  </Radio>
                </WrapperRadio>
              </div>
            </WrapperInfo>
          </WrapperLeft>

          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Địa chỉ:
                  </span>
                  <span
                    style={{ fontWeight: "bold", color: "red" }}
                  >{`${user?.address} ${user?.city}`}</span>
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={handleChangeAddress}
                  >
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Tạm tính
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Giảm giá
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {`${priceDiscountMemo}%`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Phí giao hàng
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(deliveryPriceMemo)}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Tổng tiền:{" "}
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 62)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "11px",
                      textAlign: "right",
                      marginTop: "10px",
                    }}
                  >
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>

            <ButtonComponent
              onClick={handleAddOrder}
              style={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
              text="Đặt hàng"
              size={40}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <InputComponent
              value={stateUserDetails.name}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <InputComponent
              value={stateUserDetails.type}
              onChange={handleOnChangeDetails}
              name="city"
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnChangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnChangeDetails}
              name="address"
            />
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default PaymentPage;
