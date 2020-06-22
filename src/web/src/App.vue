<template>
  <div id = "app">
    <div class="header container">
      <div class="row">
        <h3 style="color:white;float:left;" class="col-md-2 col-xs-4"><b>PokeCollectApp</b></h3>
        <div class="col-md-8 col-xs-4">
          <img v-if = "(!isLoggedIn() || notAuthPage()) &&  !isExcludedPage()"
               src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
               style="width: 100px; height:100px">
        </div>
          <div class="col-md-2 col-xs-4">
          <div v-if="username"
               style = "margin-right:2%">
            <div v-if="$route.meta.hasProfileHeader">
                <a @click.prevent = "showOptions">
                  <img src = "./assets/profile_default.png"
                       alt = "profile image"
                       style = "width:80px; height:80px; border-radius:50px; float:right;cursor:pointer">
                </a>
            </div>
          </div>
          <OptionsModal v-if = "showOptionsModal"
                       :username = "username"
                       :logout = "logout"
                       @close = "onOptionsClose">
         </OptionsModal>
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
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import firebase from 'firebase';
  import OptionsModal from '@/components/modals/OptionsModal';

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
          'setUserPokemon',
          'setUserBasicInfo',
          'setUserStarters',
          'setUserCoins'
      ]),
      ...mapActions([
        'userLogout',
        'clearUserData',
      ]),
      showOptions() {
       this.showOptionsModal = true;
     },
     onOptionsClose() {
       this.showOptionsModal = false;
     },
      fetchInitialUserInfo(username)  {
        firebase.database().ref('users/').on("value", (userObject) => {
          if (userObject.val()) {
            Object.values(userObject.val()).forEach((user) => {
              if (user.username === username) {
                localStorage.setItem('userId', user.userId);
                this.setUserPokemon({ value: user.pokemon });
                this.setUserStarters({ value: user.starters });
                this.setUserBasicInfo({ value: user.initialized });
                this.setUserCoins({ value: user.coins });
                bus.$emit('login', username);
              }
            });
          }});
      },
      logout() {
        this.onOptionsClose();
        this.userLogout().then(() => {
          this.clearUserData();
          this.$router.push('/');
        });
      },
    },
    created() {
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
          user.getIdToken().then((token) => {
            localStorage.setItem('token', token);
            vm.fetchInitialUserInfo(user.displayName);
          });
        } else {
          console.log('loggedOut!');
          vm.username = '';
          localStorage.setItem('token', '');
        }
      });
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
  }

 .header {
  width: 100%;
  overflow: hidden;
  background-color: black;
 }

.header .row img {
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px;
  line-height: 25px;
  border-radius: 4px;
}
</style>
