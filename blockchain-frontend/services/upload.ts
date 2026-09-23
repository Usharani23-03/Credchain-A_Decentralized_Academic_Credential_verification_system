import api from "./api";

export const uploadCertificate = async (formData: FormData) => {
  const response = await api.post(
    "/documents/upload",
    formData
  );

  return response.data;
};