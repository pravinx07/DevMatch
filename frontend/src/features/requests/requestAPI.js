// import { api } from "../utils/axiosInstance";
import { api } from "../../utils/axiosInstance";

export const sendRequestAPI = (status, toUserId) =>
  api.post(`/user/request/send/${status}/${toUserId}`);

export const getReceivedRequestsAPI = () =>
  api.get("/user/request/recieved");

export const reviewRequestAPI = (status, requestId) =>
  api.patch(`/user/request/reviews/${status}/${requestId}`);
