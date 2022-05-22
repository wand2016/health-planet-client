import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://www.healthplanet.jp/",
  baseURL: "http://localhost:3001/",
});

export default axiosInstance;
