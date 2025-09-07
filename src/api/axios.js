import axios from "axios";

// ممكن تاخد الرابط من .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor لمعالجة الأخطاء تلقائياً
API.interceptors.response.use(
  (response) => response,
  (error) => {
    let msg = "⚠️ Unexpected error, please try again";

    if (error.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error.message?.includes("Network")) {
      msg = "🚫 Server connection failed";
    }

    return Promise.reject({ ...error, customMessage: msg });
  }
);

export default API;