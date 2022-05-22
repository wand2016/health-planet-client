import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.healthplanet.jp/",
});

export default axiosInstance;
