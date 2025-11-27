import { api } from "../../utils/axiosInstance";

export const getFeedAPI = (page = 1, limit = 10) =>
  api.get(`/user/feed?page=${page}&limit=${limit}`);
