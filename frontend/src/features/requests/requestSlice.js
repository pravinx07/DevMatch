import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendRequestAPI,
  getReceivedRequestsAPI,
  reviewRequestAPI,
} from "./requestAPI";

export const getReceivedRequests = createAsyncThunk(
  "requests/received",
  async () => {
    const res = await getReceivedRequestsAPI();
    return res.data;
  }
);

export const reviewRequest = createAsyncThunk(
  "requests/review",
  async ({ status, requestId }) => {
    const res = await reviewRequestAPI(status, requestId);
    return res.data;
  }
);

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    list: [],
  },

  extraReducers: (builder) => {
    builder.addCase(getReceivedRequests.fulfilled, (state, action) => {
      state.list = action.payload.data;
    });
  },
});

export default requestSlice.reducer;
