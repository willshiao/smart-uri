import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import jwtDecode from 'jwt-decode';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jwt: '',
  },
  mutations: {
    logOut(state) {
      state.jwt = '';
    },
    logIn(state, token) {
      state.jwt = token;
    },
  },
  getters: {
    loggedIn(state) {
      try {
        if(!state.jwt.length === 0) return false;

        const expiresAt = new Date(parseInt(jwtDecode(state.jwt).exp, 10) * 1000);
        if(expiresAt > Date.now()) return true;

        state.jwt = '';
        return false;
      } catch(e) {
        return false;
      }
    },
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })],
});
