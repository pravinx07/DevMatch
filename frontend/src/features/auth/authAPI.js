import { api } from "../../utils/axiosInstance";

export const registerAPI = (data) =>
  api.post("/user/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginAPI = (data) => api.post("/user/login", data);

export const logoutAPI = () => api.post("/user/logout");

export const changePasswordAPI = (body) =>
  api.post("/user/change-password", body);

export const updateAvatarAPI = (formData) =>
  api.patch("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProfileAPI = () => api.get("/user/profile/view");
