import axios from "axios";

const API_URL = "http://localhost:50000/api";

export const registerUser = (userData) =>
  axios.post(`${API_URL}/signup`, userData);

export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);
