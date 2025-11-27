import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFeedAPI } from "./feedAPI";

export const getFeed = createAsyncThunk("feed/get", async () => {
  const res = await getFeedAPI();
  return res.data;
});

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    loading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      });
  },
});

export default feedSlice.reducer;
