import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  baseUrl: API_URL,

  login({ email, password }) {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
  },
};
