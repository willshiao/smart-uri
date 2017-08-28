import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import RedirectForm from '@/components/RedirectForm';
import Login from '@/components/Login';
import Register from '@/components/Register';

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
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
  ],
});
