const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description, discount } =
      req.body;

    if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const data = req.body;

    if (!productID) {
      return res.status(200).json({
        status: "ERR",
        message: "The productID is required",
      });
    }
    const response = await ProductService.updateProduct(productID, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(200).json({
        status: "ERR",
        message: "The productID is required",
      });
    }
    const response = await ProductService.deleteProduct(productID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.id;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sortOrder, sortField, filterOrder, filterField } =
      req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || 8,
      Number(page) || 0,
      sortOrder,
      sortField,
      filterOrder,
      filterField
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(200).json({
        status: "ERR",
        message: "The productID is required",
      });
    }
    const response = await ProductService.getDetailsProduct(productID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
};
