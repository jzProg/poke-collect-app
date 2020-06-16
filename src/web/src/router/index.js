import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Register from '@/components/Register';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import GetStarted from '@/components/GetStarted';
import Reward from '@/components/Reward';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next('/home');
        else next();
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/getStarted',
      name: 'GetStarted',
      component: GetStarted,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/reward',
      name: 'Reward',
      component: Reward,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
  ]
})
