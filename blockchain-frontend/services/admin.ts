import api from "./api";

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAllCertificates = async () => {
  const response = await api.get("/admin/certificates");
  return response.data;
};

export const getReports = async () => {
  const response = await api.get("/admin/reports");
  return response.data;
};