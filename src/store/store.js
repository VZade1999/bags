import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./shopping-cart/cartSlice"; // Import reducer directly from default slice
import cartUiReducer from "./shopping-cart/cartUiSlice"; // Import reducer directly
import { productSlice } from "./Products/productsSlice"; // Import product slice if not default
import { userSlice } from "./userSlice"; // Same as above

const store = configureStore({
  reducer: {
    cart: cartReducer,        // Using reducer directly without `.reducer`
    cartUi: cartUiReducer.reducer,    // Same for UI slice
    productsData: productSlice.reducer, // Access the reducer explicitly if it's not a default export
    user: userSlice.reducer,  // Access the reducer explicitly if not default
  },
});

export default store;
