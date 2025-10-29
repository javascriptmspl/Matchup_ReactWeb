// cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCartFromLocalStorage, updateCartInLocalStorage } from '../../api/sho/shopAPI';

// Async thunk for adding items to the cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product, { getState }) => {
    // Access the current state to get existing cart items
    const { cart } = getState();
    
    // Add the new product to the cart
    const updatedCart = [...cart.items, product];

    // Update the local storage
    updateCartInLocalStorage(updatedCart);

    // Return the updated cart
    return updatedCart;
  }
);

// Async thunk for removing items from the cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (index, { getState }) => {
    // Access the current state to get existing cart items
    const { cart } = getState();

    // Remove the item from the cart
    const updatedCart = cart.items.filter((item, i) => i !== index);

    // Update the local storage
    updateCartInLocalStorage(updatedCart);

    // Return the updated cart
    return updatedCart;
  }
);

// Update quantity for an item
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ index, quantity }, { getState }) => {
    const { cart } = getState();
    const normalizedQty = Math.max(1, Number.isFinite(quantity) ? Number(quantity) : 1);
    const updatedCart = cart.items.map((item, i) =>
      i === index ? { ...item, pack: normalizedQty } : item
    );
    updateCartInLocalStorage(updatedCart);
    return updatedCart;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromLocalStorage(),
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add other cart-related reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateQuantityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { actions: cartActions, reducer: cartReducer } = cartSlice;
