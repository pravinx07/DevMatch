import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import feedReducer from "../features/feed/feedSlice";
import connectionReducer from "../features/connections/connectionSlice";
import requestReducer from "../features/requests/requestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
});
