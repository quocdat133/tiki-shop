import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import slider4 from "../../assets/images/slider4.webp";
import slider5 from "../../assets/images/slider5.webp";
import slider6 from "../../assets/images/slider6.webp";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/Loading";

const HomePage = () => {
  const [limit, setLimit] = useState(6);
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 300);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];

    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["product", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  // -----------getAllType------------
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  // Kiểm tra xem đã load hết sản phẩm chưa
  const isMaxProducts = products?.data?.length >= products?.total;

  // Xử lý load more
  const handleLoadMore = () => {
    if (!isMaxProducts && !isLoading) {
      setLimit((prev) => prev + 6);
    }
  };

  return (
    <>
      <div style={{ padding: "0 120px", width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>

      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "100%", margin: "0 auto", padding: "0 120px" }}
        >
          <SliderComponent
            arrayImages={[slider1, slider2, slider3, slider4, slider5, slider6]}
          />

          <Loading isLoading={isLoading}>
            <WrapperProducts>
              {products?.data?.map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </WrapperProducts>
          </Loading>

          {products?.total > 0 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <WrapperButtonMore
                disabled={isMaxProducts || isLoading}
                onClick={handleLoadMore}
                text={
                  isLoading
                    ? "Đang tải..."
                    : isMaxProducts
                    ? "Hết sản phẩm"
                    : "Xem thêm"
                }
                type="outline"
                style={{
                  border: isMaxProducts
                    ? "none"
                    : "1px solid rgb(11, 116, 229)",
                  color: isMaxProducts ? "#fff" : "rgb(11, 116, 229)",
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                  background: isMaxProducts ? "#ccc" : "#fff",
                  fontWeight: 500,
                  cursor: isMaxProducts ? "not-allowed" : "pointer",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
