import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, message, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";
import { useSelector } from "react-redux";

const AdminUser = () => {
  const [form] = Form.useForm();

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["User"],
    queryFn: getAllUsers,
    retry: 3,
    retryDelay: 1000,
  });
  const { isLoading: isLoadingUsers, data: users } = queryUser;

  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    isAdmin: false,
  });

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleOnChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prevState) => ({
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
      setStateUserDetails({
        ...stateUserDetails,
        avatar: file.preview,
      });
    } catch (error) {
      message.error("Có lỗi khi tải ảnh");
    }
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    try {
      const res = await UserService.getDetailsUser(rowSelected);
      console.log("res: ", res);
      if (res?.data) {
        setStateUserDetails({
          name: res?.data?.name,
          email: res?.data?.email,
          address: res?.data?.address,
          avatar: res?.data?.avatar,
          phone: res?.data?.phone,
          isAdmin: res?.data?.isAdmin,
        });
      }
      setIsLoadingUpdate(false);
    } catch (error) {
      setIsLoadingUpdate(false);
      message.error("Failed to fetch User details");
    }
  };

  const handleDetailsUser = async () => {
    setIsOpenDrawer(true);
    // Thêm việc fetch chi tiết người dùng ngay khi mở drawer
    if (rowSelected) {
      setIsLoadingUpdate(true);
      try {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res?.data) {
          setStateUserDetails({
            name: res?.data?.name,
            email: res?.data?.email,
            address: res?.data?.address,
            avatar: res?.data?.avatar,
            phone: res?.data?.phone,
            isAdmin: res?.data?.isAdmin,
          });
        }
        setIsLoadingUpdate(false);
      } catch (error) {
        setIsLoadingUpdate(false);
        message.error("Failed to fetch User details");
      }
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const {
    data: dataUpdated,
    isError: isErrorUpdated,
    isSucces: isSuccessUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
    return dataUpdated;
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
      isAdmin: false,
    });
    form.resetFields();
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
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
            handleDetailsUser();
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
    }) => (
      <div
        style={{
          padding: "8px",
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
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      ...getColumnSearchProps("isAdmin"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => renderAction(),
    },
  ];
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      };
    });

  // ---------------------------------------------------
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  // bước 1:
  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
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
    return dataDeleted;
  }, [isSuccessDeleted, isErrorDeleted]);
  // bước 4:
  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  //deleteMany
  // bước 1:
  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
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
    return dataDeletedMany;
  }, [isSuccessDeletedMany, isErrorDeletedMany]);
  // bước 4:
  const handleDeleteManyUser = (ids) => {
    console.log("ids: ", ids);
    mutationDeleteMany.mutate(
      { id: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUser}
          isLoading={isLoadingUsers}
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

      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
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
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUserDetails.type}
                onChange={handleOnChangeDetails}
                name="email"
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
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: "Please input your avatar!" }]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                  value={stateUserDetails.avatar}
                  name="avatar"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </WrapperUploadFile>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
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
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isLoadingUpdate}>
          <div>Bạn có chắc xóa tài khoản này không ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
