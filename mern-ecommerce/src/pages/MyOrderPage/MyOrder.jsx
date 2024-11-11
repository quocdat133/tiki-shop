import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { WrapperContainer } from "../OrderSuccess/style";
import { WrapperItemOrder, WrapperListOrder } from "../MyOrderPage/style";
import { WrapperFooterItem, WrapperHeaderItem, WrapperStatus } from "./style";
import { useLocation, useNavigate } from "react-router";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { message } from "antd";

const MyOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("location: ", location);
  const { state } = location;

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
  });

  const { data } = queryOrder;

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem>
          <img
            src={order?.image}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238",
              padding: "2px",
            }}
            alt=""
          />
          <div
            style={{
              width: "260px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
              fontSize: "13px",
            }}
          >
            {order?.name}
          </div>
          <div style={{ marginLeft: "200px" }}>
            <span style={{ fontSize: "13px", marginRight: "5px" }}>Giá: </span>
            <span
              style={{
                fontSize: "13px",
                color: "#242424",
              }}
            >
              {convertPrice(order?.price)}
            </span>
          </div>

          <div style={{ marginLeft: "200px" }}>
            <span style={{ fontSize: "13px", marginRight: "5px" }}>
              {" "}
              Số lượng:
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#6a2a2a",
              }}
            >
              {order?.amount}
            </span>
          </div>
        </WrapperHeaderItem>
      );
    });
  };

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  // ------------cancleOrder-------------------
  const mutation = useMutationHook((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const { data: dataCancel, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && dataCancel?.status === "OK") {
      message.success();
    } else if (isError) {
      message.error();
    }
  }, [dataCancel, isSuccess, isError]);

  return (
    <WrapperContainer>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h4 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}>
          Đơn hàng của tôi
        </h4>
        <WrapperListOrder>
          {data?.map((order) => {
            console.log("order: ", order);
            return (
              <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Trạng thái
                  </span>
                  <div>
                    <span style={{ color: "rgb(255, 66, 78)" }}>
                      Giao hàng:
                    </span>
                    {order?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}
                  </div>
                  <div>
                    <span style={{ color: "rgb(255, 66, 78)" }}>
                      Thanh toán:
                    </span>
                    {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </div>
                </WrapperStatus>
                {renderProduct(order?.orderItems)}
                <WrapperFooterItem>
                  <div>
                    <span style={{ color: "rgb(255, 66, 78)" }}>Tổng tiền</span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgb(56, 56, 61",
                        fontWeight: 700,
                      }}
                    >
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonComponent
                      onClick={() => handleCancelOrder(order)}
                      size={40}
                      style={{
                        height: "36px",
                        border: "1px solid rgb(11, 116, 229)",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                      text="Hủy đơn hàng"
                    ></ButtonComponent>
                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
                      size={40}
                      style={{
                        height: "36px",
                        border: "1px solid rgb(11, 116, 229)",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                      text="Xem chi tiết"
                    ></ButtonComponent>
                  </div>
                </WrapperFooterItem>
              </WrapperItemOrder>
            );
          })}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default MyOrder;
