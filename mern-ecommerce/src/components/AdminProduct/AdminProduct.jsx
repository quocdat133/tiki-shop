import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, message, Select, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { getBase64, renderOption } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initial = () => ({
    name: "",
    type: "",
    price: "",
    rating: "",
    discount: "",
    description: "",
    image: "",
    countInStock: "",
    newType: "",
  });
  const [stateProduct, setStateProduct] = useState(initial);

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const mutation = useMutationHook((data) => {
    const {
      name,
      type,
      price,
      rating,
      description,
      image,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      type,
      price,
      rating,
      discount,
      description,
      image,
      countInStock,
    });
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["product"],
    queryFn: getAllProducts,
    retry: 3,
    retryDelay: 1000,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const { data, isSuccess, isError } = mutation;

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      type: "",
      price: "",
      rating: "",
      discount: "",
      description: "",
      image: "",
      countInStock: "",
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError, data, handleCancel]);

  const onFinish = () => {
    const params = {
      name: stateProduct?.name,
      type:
        stateProduct?.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      price: stateProduct?.price,
      rating: stateProduct?.rating,
      discount: stateProduct?.discount,
      description: stateProduct?.description,
      image: stateProduct?.image,
      countInStock: stateProduct?.countInStock,
    };

    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStateProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    try {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProduct({
        ...stateProduct,
        image: file.preview,
      });
    } catch (error) {
      message.error("Có lỗi khi tải ảnh");
    }
  };

  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const [stateProductDetails, setStateProductDetails] = useState(initial);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  const handleOnChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    try {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProductDetails({
        ...stateProductDetails,
        image: file.preview,
      });
    } catch (error) {
      message.error("Có lỗi khi tải ảnh");
    }
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    try {
      const res = await ProductService.getDetailsProduct(rowSelected);
      if (res?.data) {
        setStateProductDetails({
          name: res?.data?.name,
          type: res?.data?.type,
          price: res?.data?.price,
          rating: res?.data?.rating,
          discount: res?.data?.discount,
          description: res?.data?.description,
          image: res?.data?.image,
          countInStock: res?.data?.countInStock,
        });
      }
      setIsLoadingUpdate(false);
    } catch (error) {
      setIsLoadingUpdate(false);
      message.error("Failed to fetch product details");
    }
  };

  const handleDetailsProduct = async () => {
    setIsOpenDrawer(true);
    // Thêm việc fetch chi tiết sản phẩm ngay khi mở drawer
    if (rowSelected) {
      setIsLoadingUpdate(true);
      try {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res?.data) {
          setStateProductDetails({
            name: res?.data?.name,
            type: res?.data?.type,
            price: res?.data?.price,
            rating: res?.data?.rating,
            discount: res?.data?.discount,
            description: res?.data?.description,
            image: res?.data?.image,
            countInStock: res?.data?.countInStock,
          });
        }
        setIsLoadingUpdate(false);
      } catch (error) {
        setIsLoadingUpdate(false);
        message.error("Failed to fetch product details");
      }
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const {
    data: dataUpdated,
    isError: isErrorUpdated,
    isSucces: isSuccessUpdated,
  } = mutationUpdate;

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      type: "",
      price: "",
      rating: "",
      discount: "",
      description: "",
      image: "",
      countInStock: "",
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated, handleCloseDrawer]);

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    handleCloseDrawer();
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ fontSize: "30px", color: "orange", cursor: "pointer" }}
          onClick={() => {
            handleDetailsProduct();
          }}
        />
      </div>
    );
  };

  // custom search table

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  //  --------------table------------------
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        } else {
          return record.price <= 50;
        }
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 3;
        } else {
          return record.rating <= 3;
        }
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => renderAction(),
    },
  ];
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  // ---------------------------------------------------
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  // bước 1:
  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });
  // bước 2:
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  // bước 3:
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted, handleCloseDrawer]);
  // bước 4:
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  //deleteMany
  // bước 1:
  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });
  // bước 2:
  const {
    data: dataDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;
  // bước 3:
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [
    isSuccessDeletedMany,
    isErrorDeletedMany,
    dataDeletedMany,
    handleCloseDrawer,
  ]);
  // bước 4:
  const handleDeleteManyProduct = (ids) => {
    console.log("ids: ", ids);
    mutationDeleteMany.mutate(
      { id: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  // ---------AllTypeProduct------------
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
    // if (res?.status === "OK") {
    //   setTypeProducts(res?.data);
    // }
  };

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  // Fix 5: Add proper cleanup for rowSelected effect
  useEffect(() => {
    let isMounted = true;

    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected).finally(() => {
        if (isMounted) {
          setIsLoadingUpdate(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [rowSelected]);
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          style={{
            height: "150px",
            width: "150px",
            borderStyle: "dashed",
            borderRadius: "6px",
          }}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
          isLoading={isLoadingProducts}
          data={dataTable}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              }, // click row
            };
          }}
        />
      </div>
      <ModalComponent
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={mutation.isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOption(typeProduct?.data?.data)}
              />
            </Form.Item>

            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnChange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your countInStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: "Please input your discount!" },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnchangeAvatar}
                  maxCount={1}
                  value={stateProduct.image}
                  name="image"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </WrapperUploadFile>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    style={{
                      objectFit: "cover",
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      marginLeft: "10px",
                    }}
                    alt=""
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your countInStock!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: "Please input your discount!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnChangeDetails}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                  value={stateProductDetails.image}
                  name="image"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </WrapperUploadFile>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      objectFit: "cover",
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      marginLeft: "10px",
                    }}
                    alt=""
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingUpdate}>
          <div>Bạn có chắc xóa sản phẩm này không ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
