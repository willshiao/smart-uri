import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import RedirectForm from '@/components/RedirectForm';
import Login from '@/components/Login';
import Register from '@/components/Register';

import guards from './guards';

Vue.use(Router);

const router = new Router({
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
      meta: { requiresRole: 1 },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { notLoggedIn: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { notLoggedIn: true },
    },
  ],
});

router.beforeEach(guards.beforeEach);

export default router;
