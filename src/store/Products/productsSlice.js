import { createSlice } from "@reduxjs/toolkit";
import product_01_image_01 from "../../assets/images/product_common.png";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    category: [],
    products: [],
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setCategory, setProducts } = productSlice.actions;

export default productSlice.reducer;
