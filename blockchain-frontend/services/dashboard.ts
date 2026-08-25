import axios from "axios";

const API_URL = "http://127.0.0.1:5555";


// ============================================================
// Student Dashboard
// ============================================================

export const getStudentDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/student`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// ============================================================
// University Dashboard
// ============================================================

export const getUniversityDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/university`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// ============================================================
// Employer Dashboard
// ============================================================

export const getEmployerDashboard = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard/employer`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// ============================================================
// Admin Dashboard
// ============================================================

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