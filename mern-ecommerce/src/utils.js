import { orderContant } from "./contant";

// Kiểm tra chuỗi JSON hợp lệ
export const isJsonString = (data) => {
  if (!data) return false;
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

// Chuyển đổi file sang base64
export const getBase64 = (file) => {
  if (!file) return Promise.reject(new Error("File is required"));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Tạo options cho select component
export const renderOption = (arr = []) => {
  const result = arr.map((opt) => ({
    value: opt,
    label: opt,
  }));

  result.push({
    label: "Thêm type",
    value: "add_type",
  });

  return result;
};

// Định dạng giá tiền
export const convertPrice = (price) => {
  if (!price && price !== 0) return null;
  try {
    const result = Number(price).toLocaleString("vi-VN");
    return `${result} VNĐ`;
  } catch (error) {
    return null;
  }
};

// Chuyển đổi dữ liệu cho biểu đồ
export const convertDataChart = (data, type) => {
  if (!Array.isArray(data) || !type) return [];

  try {
    const object = data.reduce((acc, opt) => {
      const key = opt[type];
      if (!key) return acc;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(object).map((key) => ({
      name: orderContant.payment[object[key]] || key,
      value: object[key],
    }));
  } catch (error) {
    console.error("Error converting chart data:", error);
    return [];
  }
};
