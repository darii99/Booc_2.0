import axios from 'axios';
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: "http://9.223.74.78:4000",
    withCredentials: true,
    headers:{
      "Access-Control-Allow-Origin": "http://9.223.74.78:4000",
      "Access-Control-Allow-Credentials":"true",
    }
  })