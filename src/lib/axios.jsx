import axios from "axios";

const useAxios = axios.create({
  baseURL: "http://localhost:5000/api",
});

useAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

useAxios.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Axios Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default useAxios;
