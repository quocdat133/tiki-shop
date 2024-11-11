const UserRouter = require("../routes/UserRouter");
const ProductRouter = require("../routes/ProductRouter");
const OrderRouter = require("../routes/OrderRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
};

module.exports = routes;
