import api from "./api";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};