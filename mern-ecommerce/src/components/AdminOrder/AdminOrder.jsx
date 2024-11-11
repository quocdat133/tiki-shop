import React from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartsComponent from "./PieChartsComponent";

const AdminOrder = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);

  const getAllOrders = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    retry: 3,
    retryDelay: 1000,
  });
  const { data: orders } = queryOrder;

  //  --------------table------------------
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: "8px",
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
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
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "UserName",
      dataIndex: "userName",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "shippingPrice",
      dataIndex: "shippingPrice",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("shippingPrice"),
    },
    {
      title: "totalPrice",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("totalPrice"),
    },
  ];
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order?._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        itemsPrice: order?.itemsPrice,
        shippingPrice: order?.shippingPrice,
        totalPrice: order?.totalPrice,
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        paymentMethod: orderContant.payment[order?.paymentMethod],
      };
    });

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ height: "200px", width: "200px" }}>
        <PieChartsComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent data={dataTable} columns={columns} />
      </div>

      <DrawerComponent title="Chi tiết người dùng" width="90%">
        <Form
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <InputComponent name="name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <InputComponent name="email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <InputComponent name="phone" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <InputComponent name="address" />
          </Form.Item>

          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input your avatar!" }]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <WrapperUploadFile maxCount={1} name="avatar">
                <Button icon={<UploadOutlined />}>Select File</Button>
              </WrapperUploadFile>
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
    </div>
  );
};

export default AdminOrder;
