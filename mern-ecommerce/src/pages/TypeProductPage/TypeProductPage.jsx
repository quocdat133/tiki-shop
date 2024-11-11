import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import { Col, Row, Button } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/Loading";

const TypeProductPage = () => {
  const location = useLocation();
  const type = location.pathname.split("/")[2];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 6,
    total: 0,
    hasMore: true,
  });

  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);

  const fetchProductType = async (type, page, limit, isLoadMore = false) => {
    try {
      setLoading(true);
      const res = await ProductService.getTypeProduct(type, page, limit);
      if (res?.status === "OK") {
        const filteredProducts = res.data.filter((pro) => {
          if (!searchDebounce) return true;
          return pro?.name
            ?.toLowerCase()
            ?.includes(searchDebounce?.toLowerCase());
        });

        if (isLoadMore) {
          setProducts((prev) => [...prev, ...filteredProducts]);
        } else {
          setProducts(filteredProducts);
        }

        setPagination((prev) => ({
          ...prev,
          total: res.total,
          hasMore:
            filteredProducts.length === limit &&
            products.length + filteredProducts.length < res.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      setPagination((prev) => ({ ...prev, page: 0 })); // Reset page when type changes
      fetchProductType(type, 0, pagination.limit);
    }
  }, [type, searchDebounce]);

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    setPagination((prev) => ({ ...prev, page: nextPage }));
    fetchProductType(type, nextPage, pagination.limit, true);
  };

  return (
    <div
      style={{
        padding: "0 120px",
        background: "#efefef",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
        <Row
          style={{
            flexWrap: "nowrap",
            paddingTop: "10px",
            height: "calc(100% - 20px)",
          }}
        >
          <WrapperNavbar span={4}>
            <NavbarComponent />
          </WrapperNavbar>
          <Col
            span={20}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Loading isLoading={loading && !pagination.page}>
              <WrapperProducts>
                {products.map((product) => (
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

            {products.length > 0 && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  style={{
                    border: !pagination.hasMore
                      ? "none"
                      : "1px solid rgb(11, 116, 229)",
                    color: !pagination.hasMore ? "#fff" : "rgb(11, 116, 229)",
                    width: "240px",
                    height: "38px",
                    borderRadius: "4px",
                    background: !pagination.hasMore ? "#ccc" : "#fff",
                  }}
                  onClick={handleLoadMore}
                  disabled={!pagination.hasMore || loading}
                >
                  {loading
                    ? "Đang tải..."
                    : pagination.hasMore
                    ? "Xem thêm"
                    : "Hết sản phẩm"}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;
