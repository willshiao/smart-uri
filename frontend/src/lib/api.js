import axios from 'axios';
import store from '@/store';

const API_URL = 'https://wls.ai';

export default {
  baseUrl: API_URL,

  login({ email, password }) {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
  },

  register({ email, password }) {
    return axios.post(`${API_URL}/auth/register`, {
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
