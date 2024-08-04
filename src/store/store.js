import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./shopping-cart/cartSlice";
import cartUiSlice from "./shopping-cart/cartUiSlice";
import { productSlice } from "./Products/productsSlice";
import { userSlice } from "./userSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    cartUi: cartUiSlice.reducer,
    productsData: productSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
