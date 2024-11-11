const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false, require: true },
    phone: { type: Number },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
  },
  {
    // adds createAt and updateAt mỗi khi được tạo hoặc sửa đổi
    // These fields are especially useful for tracking the lifecycle of documents, enabling you to know when data was created and last updated. You don't need to manually handle these fields unless you want to set custom timestamps.
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
