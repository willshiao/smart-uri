import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import RedirectForm from '@/components/RedirectForm';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/redirect',
      name: 'RedirectForm',
      component: RedirectForm,
    },
  ],
});
