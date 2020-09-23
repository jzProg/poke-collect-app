<template>
  <div id = "app">
    <div class="header container">
      <div class="row">
        <h3 style="color:white;float:left;cursor:pointer" class="col-md-2 col-xs-4" @click.prevent="goToHome"><b>PokeCollectApp</b></h3>
        <div class="col-md-8 col-xs-4">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
               style="width: 100px; height:100px">
        </div>
          <div class="col-md-2 col-xs-4">
          <div v-if="username" style = "margin-right:2%">
            <i class="fab fa-rocketchat fa-5x" style="float:left;cursor:pointer" @click.prevent="loadChat()"></i>
            <div v-if="$route.meta.hasProfileHeader">
                <a @click.prevent = "showOptions">
                  <img :src = "getImage()"
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
         <Chat v-if="showChat"
                   @close="showChat=false" />
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
  import Chat from '@/components/modals/Chat';

  export default {
    name: 'app',
    mixins: [firebaseConfigProperties, urlAuthMixin],
    components: { OptionsModal, Chat },
    data() {
      return {
        username: '',
        showOptionsModal: false,
        showChat: false,
      };
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
          user.getIdToken().then((token) => {
            localStorage.setItem('token', token);
            console.log(user.email);
            vm.fetchInitialUserInfo(user.email);
          });
        } else {
          console.log('loggedOut!');
          vm.username = '';
          localStorage.setItem('token', '');
        }
      });
    },
    methods: {
      loadChat() {
        console.log('chatting...');
        this.showChat = true;
      },
      getImage() {
        return require(`./assets/profileAvatar/${this.getUserImage}`);
      },
      goToHome(){
        this.$router.push('getStarted');
      },
      ...mapMutations([
          'setLoginUsername',
          'setUserPokemon',
          'setUserBasicInfo',
          'setUserStarters',
          'setUserCoins',
          'setUserImage',
          'setItems',
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
      fetchInitialUserInfo(mail)  {
        console.log('fetching user info...');
        firebase.database().ref('users/').on("value", (userObject) => {
          if (userObject.val()) {
            Object.values(userObject.val()).forEach((user) => {
              if (user.mail === mail) {
                console.log('user found!');
                localStorage.setItem('userId', user.userId);
                this.setUserPokemon({ value: user.pokemon });
                this.setUserStarters({ value: user.starters });
                this.setUserBasicInfo({ value: user.initialized });
                this.setUserCoins({ value: user.coins });
                this.setUserImage({ value: user.image });
                this.setItems({ value: user.items });
                this.username = user.username;
                this.setLoginUsername({ value: user.username });
                bus.$emit('login', user.username);
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
    computed: {
      ...mapGetters([
        'getUserImage'
      ]),
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
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 1 0 5px grey;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
