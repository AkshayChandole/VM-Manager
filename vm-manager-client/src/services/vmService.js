import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_BASE_URL}/api/vms`;

const getToken = () => {
  return localStorage.getItem("token");
};

export const getVMs = async () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const addVM = async (vm) => {
  return axios.post(API_URL, vm, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const deleteVM = async (name) => {
  return axios.delete(`${API_URL}/${name}`, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const connectVM = async (vm) => {
  return axios.post(`${API_URL}/connect`, vm, {
    headers: {
      Authorization: getToken(),
    },
  });
};
