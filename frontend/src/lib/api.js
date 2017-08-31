import axios from 'axios';
import store from '@/store';

const API_URL = 'http://localhost:3000';

export default {
  baseUrl: API_URL,

  login({ email, password }) {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
  },

  request(endpoint, settings = {}) {
    return axios({
      url: `${API_URL}/${endpoint}`,
      headers: {
        Authorization: `Bearer ${store.state.jwt}`,
      },
      ...settings,
    });
  },
};
