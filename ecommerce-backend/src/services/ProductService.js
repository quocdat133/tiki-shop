const Product = require("../models/ProductModel");

const createProduct = async (product) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = product;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name is already",
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        discount,
        description,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const updateProduct = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateProduct,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const deleteProduct = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "DELETE PRODUCT SUCCESS",
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const deleteManyProduct = async (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      // deleteMany của mongoose
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to delete products");
    }
  });
};

const getAllProduct = async (
  limit,
  page,
  sortOrder,
  sortField,
  filterOrder,
  filterField
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      // filter
      if (filterOrder && filterField) {
        const label = filterField;
        const allProductFilter = await Product.find({
          [label]: { $regex: filterOrder },
        })
          .limit(limit)
          .skip(limit * page);

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allProductFilter,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      // -------------------------------------------------------

      // sort
      if (sortOrder && sortField) {
        const objectSort = {};
        // sortField sẽ là key, sortOrder sẽ là giá trị
        objectSort[sortField] = sortOrder;
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(limit * page)
          .sort(objectSort);

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      // -------------------------------------------------------

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: await Product.find()
          .limit(limit)
          .skip(limit * page),
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const getDetailsProduct = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: checkProduct,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

const getAllType = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allType,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create product");
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
