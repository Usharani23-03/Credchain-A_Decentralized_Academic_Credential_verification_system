import axios from "axios";

const API_URL = "http://localhost:3005";


export const getStudentDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/student`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getUniversityDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/university`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getEmployerDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/employer`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getAdminDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/admin/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};