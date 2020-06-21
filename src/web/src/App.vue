<template>
  <div id = "app">
    <img v-if = "(!isLoggedIn() || notAuthPage()) &&  !isExcludedPage()" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" style="width: 100px; height:100px">
    <button v-if="isLoggedIn() && $route.meta.hasProfileHeader" @click="logout" class="btn btn-danger"Logout</button>
    <div v-if = "username" class = "container" style = "margin-right:2%">
      <div class = "row" v-if="$route.meta.hasProfileHeader">
        <div class = "col-md-12" style = "position: relative;">
          <a @click.prevent = "showOptions">
            <h3 id = 'notificationText' v-if = "numOfUnreadNotifications">{{ numOfUnreadNotifications }}</h3>
            <img src = "./assets/profile_default.png"
                 alt = "profile image"
                 style = "width:80px; height:80px; border-radius:50px; float:right; margin-right:5%">
          </a>
          <OptionsModal v-if = "showOptionsModal"
                        :username = "username"
                        :logout = "logout"
                        :notifications = "getNotifications"
                        :messages = "getMessages"
                        @close = "onOptionsClose">
          </OptionsModal>
        </div>
      </div>
      <div class = "row" v-if="$route.meta.hasProfileHeader">
        <div class = "col-md-12">
          <h4 style = "float:right">Welcome, {{ username }}! </h4>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import bus from "@/common/eventBus";
  import firebaseConfigProperties from "@/common/firebaseConfigProperties";
  import urlAuthMixin from "@/common/helpers/urlAuth";
  import OptionsModal from '@/components/modals/OptionsModal';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import firebase from 'firebase';

  export default {
    name: 'app',
    mixins: [firebaseConfigProperties, urlAuthMixin],
    components: { OptionsModal },
    data() {
      return {
        username: '',
        showOptionsModal: false,
      };
    },
    methods: {
      ...mapMutations([
          'setLoginUsername',
      ]),
      ...mapActions([
        'userLogout',
        'clearUserData',
        'fetchNotifications',
        'fetchUserPokemon',
      ]),
      showOptions() {
        this.showOptionsModal = true;
      },
      onOptionsClose() {
        this.showOptionsModal = false;
      },
      logout() {
        this.userLogout().then(() => {
          this.clearUserData();
          this.showOptionsModal = false;
          this.router.push('/');
        });
      },
    },
    created() {
      console.log(this.$route);
      // Initialize Firebase
      if (!firebase.apps.length) {
        console.log('firebase created!');
        firebase.initializeApp(this.config);
        firebase.analytics();
      }
      const vm = this;
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('loggedIn!');
          // User is signed in.
          user = firebase.auth().currentUser;
          vm.username = user.displayName;
          vm.setLoginUsername({ value: user.displayName });
        //  this.fetchNotifications(user.displayName); // todo change
          vm.fetchUserPokemon(user.displayName).then(() => {
            user.getIdToken().then((token) => {
              localStorage.setItem('token', token);
              bus.$emit('login', user.displayName);
            });
          });
        } else {
          console.log('loggedOut!');
          this.username = '';
          localStorage.setItem('token', '');
        }
      });
    },
    computed: {
      ...mapGetters([
        'getNotifications',
        'getMessages',
      ]),
      numOfUnreadNotifications() {
          return this.getNotifications ? this.getNotifications.length : 0;
      }
    }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
