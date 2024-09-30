import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

const initialState = {
  cartItems: loadCartFromLocalStorage(), // Load initial state from local storage
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =========== add item ============
    pushItem(state, action) {
      state.cartItems.push(action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Save to local storage
    },

    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;

      // Check if the item already exists in the cart
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id && item.color === newItem.color
      );

      if (existingItem) {
        // If it exists, increment the quantity
        existingItem.quantity += 1;
      } else {
        // If it doesn't exist, add it to the cart with quantity of 1
        newItem.quantity = 1; // Set initial quantity
        state.cartItems.push(newItem);
      }

      // Save to local storage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // =========== remove item ============
    removeItem(state, action) {
      const { id, color } = action.payload; // Get both ID and color to identify the item

      const existingItem = state.cartItems.find(
        (item) => item.id === id && item.color === color
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          // If the quantity is greater than 1, decrement it
          existingItem.quantity -= 1;
        } else {
          // If the quantity is 1, remove the item from the cart
          state.cartItems = state.cartItems.filter(
            (item) => !(item.id === id && item.color === color)
          );
        }
      }

      // Save to local storage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // =========== clear cart ============
    clearCart(state) {
      state.cartItems = [];
      localStorage.removeItem("cartItems"); // Remove from local storage
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer; // Make sure to export the reducer here
