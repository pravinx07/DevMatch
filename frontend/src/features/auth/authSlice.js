import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/axiosInstance";

// =========================
//   LOGIN USER - /user/login
// =========================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/login", body);

      // expected backend response:
      // { statusCode, data: user, message, accessToken }
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Login failed. Try again." }
      );
    }
  }
);

// =========================
//   REGISTER USER - /user/register
// =========================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed." }
      );
    }
  }
);

// =========================
//   GET USER PROFILE - /user/profile/view
// =========================
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/profile/view");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Unable to fetch profile." }
      );
    }
  }
);

// =========================
//   UPDATE AVATAR - /user/avatar
// =========================
export const updateAvatar = createAsyncThunk(
  "auth/avatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Avatar upload failed." }
      );
    }
  }
);

// =========================
//   SLICE
// =========================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    }
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data;      // user data
        state.token = action.payload.accessToken; // token

        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // PROFILE
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })

      // UPDATE AVATAR
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload.data;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
