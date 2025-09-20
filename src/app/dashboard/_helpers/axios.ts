import axios from "axios";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(
      "axios.response.error:",
      error?.response?.status,
      error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message,
    );
    if (401 === error?.response?.status) {
      setTimeout(() => (window.location.href = "/dashboard/login"), 1_500);
    }
    return Promise.reject(
      error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message,
    );
  },
);

export default instance;
