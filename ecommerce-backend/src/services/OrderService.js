const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const createOrder = async (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
    } = newOrder;
    try {
      const promise = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          const createdOrder = await Order.create({
            orderItems,
            shippingAddress: {
              fullName,
              address,
              city,
              phone,
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user,
          });
          if (createdOrder) {
            return {
              status: "OK",
              message: "SUCCESS",
            };
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promise);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${newData.join(",")} không đủ hàng`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const getAllOrderDetails = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const getOrderDetails = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const cancelOrderDetails = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderToDelete = null;

      // Kiểm tra đơn hàng tồn tại trước
      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng",
        });
        return;
      }

      // Process each order item
      const results = await Promise.all(
        data.map(async (orderItem) => {
          try {
            // Kiểm tra sản phẩm có tồn tại không
            const product = await Product.findById(orderItem.product);

            if (!product) {
              return {
                status: "ERR",
                message: "Không tìm thấy sản phẩm",
                productId: orderItem.product,
              };
            }

            // Thực hiện update mà không cần kiểm tra selled
            const productData = await Product.findByIdAndUpdate(
              orderItem.product,
              {
                $inc: {
                  countInStock: +orderItem.amount,
                  selled: -orderItem.amount,
                },
              },
              { new: true }
            );

            if (productData.selled < 0) {
              // Nếu sau khi update mà selled < 0, rollback lại
              await Product.findByIdAndUpdate(orderItem.product, {
                $inc: {
                  countInStock: -orderItem.amount,
                  selled: +orderItem.amount,
                },
              });

              return {
                status: "ERR",
                message: `Không thể hủy đơn hàng do số lượng không hợp lệ (selled sẽ âm)`,
                productId: orderItem.product,
              };
            }

            return {
              status: "OK",
              productId: orderItem.product,
            };
          } catch (err) {
            return {
              status: "ERR",
              message: "Lỗi khi cập nhật sản phẩm",
              productId: orderItem.product,
              error: err.message,
            };
          }
        })
      );

      // Check if any products failed to update
      const failedProducts = results.filter(
        (result) => result.status === "ERR"
      );

      if (failedProducts.length > 0) {
        resolve({
          status: "ERR",
          message: `Không thể hủy đơn hàng. ${failedProducts
            .map((p) => `Sản phẩm ${p.productId}: ${p.message}`)
            .join("; ")}`,
          failedProducts,
        });
        return;
      }

      // If all products were updated successfully, delete the order
      try {
        orderToDelete = await Order.findByIdAndDelete(id);

        resolve({
          status: "OK",
          message: "Hủy đơn hàng thành công",
          data: orderToDelete,
        });
      } catch (err) {
        resolve({
          status: "ERR",
          message: "Lỗi khi hủy đơn hàng",
          error: err.message,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: "Lỗi server",
        error: e.message,
      });
    }
  });
};

const getAllOrder = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrder,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
};
