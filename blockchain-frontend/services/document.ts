import api from "./api";

export const getMyDocuments = async () => {
  const response = await api.get("/documents/my-documents");
  return response.data;
};

export const getDocumentById = async (id: number) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const downloadDocument = async (id: number) => {
  const response = await api.get(`/documents/download/${id}`, {
    responseType: "blob",
  });

  return response;
};

// ================= Employer Verification History =================

export const getVerificationHistory = async () => {
  const response = await api.get("/documents/verification-history");
  return response.data;
};