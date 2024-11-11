import { Col, Row, Image, Button, Rate } from "antd";
import React, { useState } from "react";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";

const ProductDetailsComponent = ({ idProduct }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [numProduct, setNumProduct] = useState(1);
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res?.data;
    }
  };

  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    retry: 3,
    retryDelay: 1000,
    enable: !!idProduct,
  });

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleOnChange = (type) => {
    if (type === "decrease") {
      setNumProduct(numProduct - 1);
    } else if (type === "increase") {
      setNumProduct(numProduct + 1);
    }
  };

  const user = useSelector((state) => state.user);

  // ----------------handleAddOrderProduct-----------------
  const dispatch = useDispatch();

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      console.log("Adding product:", {
        orderItem: {
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?.id,
        },
      });
      // {
      //   name: { type: String, require: true },
      //   amount: { type: Number, require: true },
      //   image: { type: String, require: true },
      //   price: { type: Number, require: true },
      //   product: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "Product",
      //     require: true,
      //   },
      // },
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
          },
        })
      );
    }
  };
  console.log("productDetails: ", productDetails);
  return (
    <Loading isLoading={isLoading}>
      <Row style={{ padding: "16px", backgroundColor: "#fff" }}>
        <Col
          span={10}
          style={{
            borderRight: "1px solid #e5e5e5",
            paddingRight: "8px",
            borderRadius: "4px",
          }}
        >
          <Image src={productDetails?.image} alt="" preview={false} />
          <div>
            <Row
              style={{ paddingTop: "10px 0", justifyContent: "space-between" }}
            >
              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>

              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>

              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>

              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>

              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>

              <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt=""
                  preview={false}
                />
              </WrapperStyleColImage>
            </Row>
          </div>
        </Col>

        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>

          <WrapperAddressProduct>
            Giao đến:{" "}
            <span style={{ color: "red" }}>
              {user?.address} - {user?.city}
            </span>
          </WrapperAddressProduct>

          <div
            style={{
              margin: "10px 0 20px",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
              padding: "10px 0",
            }}
          >
            <div style={{ marginBottom: "6px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <Button
                style={{
                  border: "none",
                  background: "transparent",
                  width: "30px",
                  cursor: "pointer",
                }}
              >
                <MinusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  onClick={() => handleOnChange("decrease")}
                />
              </Button>
              <WrapperInputNumber
                value={numProduct}
                onChange={onChange}
                size="small"
              />
              <Button
                style={{
                  border: "none",
                  background: "transparent",
                  width: "30px",
                }}
              >
                <PlusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  onClick={() => handleOnChange("increase")}
                />
              </Button>
            </WrapperQualityProduct>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ButtonComponent
              text="Chọn mua"
              type="outline"
              size={40}
              style={{
                border: "none",
                color: "#fff",
                width: "220px",
                height: "48px",
                borderRadius: "4px",
                backgroundColor: "rgb(255, 67, 69)",
                fontWeight: 700,
                fontSize: "15px",
              }}
              onClick={handleAddOrderProduct}
            />

            <ButtonComponent
              text="Mua trả sau"
              type="outline"
              size={40}
              style={{
                border: "1px solid rgb(13, 92, 182)",
                color: "rgb(13, 92, 182)",
                width: "220px",
                height: "48px",
                borderRadius: "4px",
                backgroundColor: "#fff",
                fontWeight: 700,
                fontSize: "15px",
              }}
            />
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
