import axios from "axios";

const API_URL = "http://localhost:50000/api/vms";

export const getVMs = async () => {
  return axios.get(API_URL);
};

export const addVM = async (vm) => {
  return axios.post(API_URL, vm);
};

export const deleteVM = async (name) => {
  return axios.delete(`${API_URL}/${name}`);
};

export const connectVM = async (vm) => {
  return axios.post(`${API_URL}/connect`, vm);
};
