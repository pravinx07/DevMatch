import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getConnectionsAPI } from "./connectionAPI";

export const getConnections = createAsyncThunk("connections/get", async () => {
  const res = await getConnectionsAPI();
  return res.data;
});

const connectionSlice = createSlice({
  name: "connections",
  initialState: {
    list: [],
    loading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getConnections.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      });
  },
});

export default connectionSlice.reducer;
