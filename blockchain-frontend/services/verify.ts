import api from "./api";

export const verifyCertificate = async (formData: FormData) => {
  const response = await api.post(
    "/documents/verify",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};