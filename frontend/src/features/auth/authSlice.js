import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/axiosInstance";

// HIT: POST /user/login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/login", body);
      return res.data; // assuming { data: user, message, accessToken? }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    // if your backend returns token in response, we can add it later
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("token"); // only if you store it later
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // ApiResponse(200, data, message)
        state.error = null;

        // if backend sends accessToken in payload, store it:
        if (action.payload.accessToken) {
          localStorage.setItem("token", action.payload.accessToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
