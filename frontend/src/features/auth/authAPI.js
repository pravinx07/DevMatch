import { api } from "../../utils/axiosInstance";

// POST /user/register  (multipart/form-data)
export const registerAPI = (formData) =>
  api.post("/user/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
