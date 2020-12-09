import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import VueSweetAlert from 'vue-sweetalert';

import App from './App';
import router from './router';
import store from './store';

Vue.use(BootstrapVue);
Vue.use(VueSweetAlert);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
