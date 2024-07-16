import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_BASE_URL}/api/users`;

const getToken = () => {
  return localStorage.getItem("token");
};

const axiosConfig = {
  headers: {
    Authorization: getToken(),
  },
};

export const getUsers = async () => {
  return axios.get(API_URL, axiosConfig);
};

export const addUser = async (user) => {
  return axios.post(API_URL, user, axiosConfig);
};

export const editUser = async (username, newUserData) => {
  return axios.put(`${API_URL}/${username}`, newUserData, axiosConfig);
};

export const deleteUser = async (username) => {
  return axios.delete(`${API_URL}/${username}`, axiosConfig);
};

export const decryptUserPassword = async (username) => {
  const response = await axios.get(
    `${API_URL}/${username}/decrypt`,
    axiosConfig
  );
  return response.data;
};
