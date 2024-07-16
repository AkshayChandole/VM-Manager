import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_BASE_URL}/api`;
console.log(API_URL);
export const registerUser = (userData) =>
  axios.post(`${API_URL}/signup`, userData);

export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);
