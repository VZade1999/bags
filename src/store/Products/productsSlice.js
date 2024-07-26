import { createSlice } from "@reduxjs/toolkit";
import product_01_image_01 from "../../assets/images/product_common.png";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    category: [],
    products: [
      {
        id: "1",
        title: "Loaf Bread ",
        price: 35.0,
        image01: product_01_image_01,
        category: "School Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "10",
        title: "Loaf Bread ",
        price: 35.0,
        image01: product_01_image_01,
        category: "Office Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "2",
        title: "Loaf Bread ",
        price: 35.0,
        image01: product_01_image_01,
        category: "Ladies Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "3",
        title: "Loaf Bread ",
        price: 35.0,
        image01: product_01_image_01,
        category: "Traveling Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "4",
        title: "Loaf Veg ",
        price: 35.0,
        image01: product_01_image_01,
        category: "Traveling Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "5",
        title: "Paneer",
        price: 35.0,
        image01: product_01_image_01,
        category: "Traveling Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "6",
        title: "Butter Roti",
        price: 35.0,
        image01: product_01_image_01,
        category: "Office Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
      {
        id: "7",
        title: "Egg Masala",
        price: 35.0,
        image01: product_01_image_01,
        category: "Office Bags",

        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
      },
    ],
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
