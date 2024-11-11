import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemSelected: [],
  shippingAddress: {},
  paymentMethod: {},
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  // itemsPrice + shippingPrice + taxPrice
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },

    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemSelected?.find(
        (item) => item?.product === idProduct
      );
      if (itemOrder && itemOrder.amount > 1) {
        // Added check
        itemOrder.amount--;
      }
      if (itemOrderSelected && itemOrderSelected.amount > 1) {
        // Added check
        itemOrderSelected.amount--;
      }
    },

    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemSelected?.find(
        (item) => item?.product === idProduct
      );
      if (itemOrder) {
        // Added check
        itemOrder.amount++;
      }
      if (itemOrderSelected) {
        // Added check
        itemOrderSelected.amount++;
      }
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrders = state.orderItems?.filter(
        (item) => item.product !== idProduct
      );
      const itemOrdersSelected = state.orderItemSelected?.filter(
        (item) => item.product !== idProduct
      );
      state.orderItems = itemOrders;
      state.orderItemSelected = itemOrdersSelected;
    },

    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;
      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const itemOrdersSelected = state?.orderItemSelected?.filter(
        // Changed from orderItems to orderItemSelected
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = itemOrders;
      state.orderItemSelected = itemOrdersSelected;
    },
    
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order?.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemSelected = orderSelected;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeAllOrderProduct,
  selectedOrder,
} = orderSlide.actions;

export default orderSlide.reducer;
