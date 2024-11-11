import React from "react";
import {
  WrapperInfo,
  WrapperContainer,
  Label,
  WrapperItemOrder,
  WrapperItemOrderInfo,
} from "./style";
import { WrapperValue } from "./style";
import { convertPrice } from "../../utils";
import { useLocation } from "react-router";
import { orderContant } from "../../contant";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "5px" }}>
          Đơn hàng của tôi
        </h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperContainer>
            <WrapperInfo>
              <div>
                <Label>Phương thức giao hàng</Label>
                <WrapperValue>
                  <span
                    style={{
                      color: "#ea8500",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    {orderContant.delivery[state?.delivery]}
                  </span>
                  Giao hàng tiết kiệm
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo>
              <div>
                <Label htmlFor="">Phương thức thanh toán</Label>
                <WrapperValue>
                  {orderContant.payment[state?.payment]}
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperItemOrderInfo>
              {state.orders?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "500px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                      <div
                        style={{
                          width: "260px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "15px",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <span
                          style={{
                            fontSize: "15px",
                            color: "#242424",
                            margin: "120px",
                          }}
                        >
                          Giá tiền: {convertPrice(order?.price)}
                        </span>
                      </span>
                      <span>
                        <span
                          style={{
                            fontSize: "15px",
                            color: "#242424",
                            margin: "120px",
                          }}
                        >
                          Số lượng: {order?.amount}
                        </span>
                      </span>
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperItemOrderInfo>
            <div>
              <span>
                <span
                  style={{
                    // fontSize: "13px",
                    // color: "#242424",
                    color: "red",
                    fontSize: "16px",
                    float: "right",
                  }}
                >
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                </span>
              </span>
            </div>
          </WrapperContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
