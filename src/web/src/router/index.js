import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Register from '@/components/Register';
import Home from '@/components/Home';
import GetStarted from '@/components/GetStarted';
import Reward from '@/components/Reward';
import Battle from '@/components/Battle';
import Game from '@/components/Game';
import Store from '@/components/Store';
import Inventory from '@/components/Inventory';
import Evolution from '@/components/Evolution';

Vue.use(Router);

const router =  new Router({
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
      meta: { hasProfileHeader: true },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      meta: { hasProfileHeader: false },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/getStarted',
      name: 'GetStarted',
      component: GetStarted,
      meta: { hasProfileHeader: false },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/reward',
      name: 'Reward',
      meta: { hasProfileHeader: false },
      component: Reward,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/battle',
      name: 'Battle',
      component: Battle,
      meta: { hasProfileHeader: false },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/store',
      name: 'Store',
      component: Store,
      meta: { hasProfileHeader: false },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: Inventory,
      meta: { hasProfileHeader: false },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
    {
      path: '/evolution',
      name: 'Evolution',
      component: Evolution,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) next();
        else next('/');
      }
    },
  ]
});

export default router;
