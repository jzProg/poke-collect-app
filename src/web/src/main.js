// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { BSidebar, BImg, BButton, BNavbar, BNavbarNav, BNavbarBrand, BNavbarToggle, BNavItem, BCollapse  } from 'bootstrap-vue';

Vue.component('b-sidebar', BSidebar);
Vue.component('b-img', BImg);
Vue.component('b-button', BButton);
Vue.component('b-navbar', BNavbar);
Vue.component('b-navbar-nav', BNavbarNav);
Vue.component('b-navbar-toggle', BNavbarToggle);
Vue.component('b-nav-item', BNavItem);
Vue.component('b-navbar-brand', BNavbarBrand);
Vue.component('b-collapse', BCollapse);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
