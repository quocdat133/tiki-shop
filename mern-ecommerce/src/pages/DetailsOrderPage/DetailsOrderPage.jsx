import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { useSelector } from "react-redux";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";

const DetailsOrderPage = () => {
  const params = useParams();
  const { id } = params;
  console.log("params: ", params);
  const location = useLocation();
  console.log("location: ", location);
  const order = useSelector((state) => state?.order);

  const { state } = location;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getOrderDetails(id, state?.access_token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetailsOrder,
  });

  const { data } = queryOrder;

  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result || 0;
  }, [order]);

  return (
    <div style={{ width: "100%", height: "100vh", background: "f5f5fa" }}>
      <div style={{ width: "1270px", margin: "0 auto" }}></div>
      <h4 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}>
        Chi tiết đơn hàng
      </h4>
      <WrapperHeaderUser>
        <WrapperInfoUser>
          <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
          <WrapperContentInfo>
            <div className="name-info">
              Tên người nhận: {data?.shippingAddress?.fullName}
            </div>
            <div className="address-info">
              Địa chỉ:
              <span style={{ color: "red" }}>
                {`${data?.shippingAddress?.address}`}-{" "}
                {`${data?.shippingAddress?.city}`}
              </span>
            </div>
            <div className="phone-info">
              Điện thoại: <span>{data?.shippingAddress?.phone}</span>
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>
        <WrapperInfoUser>
          <WrapperLabel>Hình thức giao hàng</WrapperLabel>
          <WrapperContentInfo>
            <div className="delivery-info" style={{ fontSize: "15px" }}>
              <span className="name-delivery">FAST</span>Giao hàng tiết kiệm
            </div>
            <div className="delivery-fee" style={{ fontSize: "15px" }}>
              <span>Phí giao hàng</span>
              {data?.shippingPrice}
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>
        <WrapperInfoUser>
          <WrapperLabel>Hình thức thanh toán</WrapperLabel>
          <WrapperContentInfo>
            <div className="payment-info" style={{ fontSize: "15px" }}>
              {orderContant[data?.paymentMethod]}
            </div>
            <div className="status-payment">
              {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </div>
          </WrapperContentInfo>
        </WrapperInfoUser>
      </WrapperHeaderUser>
      <WrapperStyleContent>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "610px" }}>Sản phẩm</div>
          <WrapperItemLabel>Giá</WrapperItemLabel>
          <WrapperItemLabel>Số lượng</WrapperItemLabel>
          <WrapperItemLabel>Giảm giá</WrapperItemLabel>
        </div>
        {data?.orderItems?.map((order) => {
          console.log("order: ", order);
          return (
            <WrapperProduct>
              <WrapperNameProduct>
                <img
                  src={order?.image}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    border: "1px solid rgb(238, 238, 238)",
                    padding: "2px",
                  }}
                />

                <div
                  style={{
                    width: "260px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginLeft: "10px",
                    height: "70px",
                  }}
                >
                  {order?.name}
                </div>
              </WrapperNameProduct>
              <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
              <WrapperItem>{order?.amount}</WrapperItem>
              <WrapperItem>
                {order?.discount
                  ? convertPrice((priceMemo * order?.discount) / 100)
                  : 0}
              </WrapperItem>
            </WrapperProduct>
          );
        })}

        <WrapperAllPrice style={{ textAlign: "right", width: "100%" }}>
          <WrapperItemLabel>Tạm tính</WrapperItemLabel>
          <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
        </WrapperAllPrice>

        <WrapperAllPrice style={{ textAlign: "right", width: "100%" }}>
          <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
          <WrapperItem>{data?.shippingPrice}</WrapperItem>
        </WrapperAllPrice>

        <WrapperAllPrice style={{ textAlign: "right", width: "100%" }}>
          <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
          <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
        </WrapperAllPrice>
      </WrapperStyleContent>
    </div>
  );
};

export default DetailsOrderPage;
