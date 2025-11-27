import { api } from "../../utils/axiosInstance";

export const getConnectionsAPI = () => api.get("/user/connections");
