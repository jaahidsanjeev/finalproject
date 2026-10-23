
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: []
  },

  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;

      const existing = state.items.find(
        (item) => item.id === product.id
      );

      if (existing) {
        state.items = state.items.filter(
          (item) => item.id !== product.id
        );
      } else {
        state.items.push(product);
      }
    }
  }
});

export const { toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
