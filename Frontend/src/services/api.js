//import axios from "axios";

// const API = axios.create({
//   baseURL: "",
// });

// export default API;


// const BASE_URL = "http://localhost:5000/api/usage";

// export async function saveUsage(data) {
//   return fetch(`${BASE_URL}/save`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   }).then(res => res.json());
// }

// export async function extendUsage(appName, extraTime) {
//   return fetch(`${BASE_URL}/extend`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ appName, extraTime }),
//   }).then(res => res.json());
// }

// export async function getUsage() {
//   return fetch(BASE_URL).then(res => res.json());
// }



// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export const saveUsage = (data) =>
//   API.post("/usage/save", data);

// export const getUsage = () =>
//   API.get("/usage").then((res) => res.data);






// src/services/api.js
const API_URL = "http://localhost:5000/api"; // Adjust based on your backend

export const saveUsage = async (data) => {
  const response = await fetch(`${API_URL}/usage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const extendUsage = async (appName, extraTime) => {
  const response = await fetch(`${API_URL}/usage/extend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appName, extraTime }),
  });
  return response.json();
};

export const getUsage = async () => {
  const response = await fetch(`${API_URL}/usage`);
  return response.json();
};