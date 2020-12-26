<template>
  <div id="app">
    <div class="NavHeader">
        <h3 id="logoDiv"
            @click.prevent="goToHome">
            <b>PokeCollectApp</b>
        </h3>
        <div :class="['appLogo', !username ? 'appLogoCenter' : '']">
          <img :src="require('./assets/pokeball.png')" height="100px" width="100px">
        </div>
          <div id="profileDiv" v-if="username">
            <b-button class="profileItem" v-b-toggle.sidebar-variant><i class="fas fa-bars"></i></b-button>
            <i class="fab fa-rocketchat fa-5x profileItem" @click.prevent="loadChat()"></i>
            <div v-if="$route.meta.hasProfileHeader">
                <a @click.prevent="showOptions">
                  <img :src="getImage()"
                       alt="profile image"
                       class="profileItem"
                       id="profileImg">
                </a>
            </div>
          </div>
          <ProfileModal v-if="showOptionsModal"
                       :username="username"
                       :logout="logout"
                       class="fragment"
                       @close="onOptionsClose">
         </ProfileModal>
         <Chat v-if="showChat"
               class="fragment"
               @close="showChat=false" />
    </div>
    <div class="fragment">
      <router-view/>
    </div>
    <Loading v-if="getLoad" />
  </div>
</template>

<script>
  import Vue from 'vue';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import firebase from "firebase/app";
  import 'firebase/database';
  import 'firebase/auth';
  import { VBToggle } from 'bootstrap-vue';
  import 'bootstrap-vue/dist/bootstrap-vue.css';
  import bus from "@/common/eventBus";
  import firebaseConfigProperties from "@/common/firebaseConfigProperties";
  import urlAuthMixin from "@/common/helpers/urlAuth";
  import ProfileModal from '@/components/modals/ProfileModal';
  import Chat from '@/components/modals/Chat';
  import Loading from '@/components/modals/Loading';

  export default {
    name: 'app',
    directives: {
      'b-toggle': VBToggle
    },
    mixins: [firebaseConfigProperties, urlAuthMixin],
    components: { ProfileModal, Chat, Loading },
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
      }
      const vm = this;
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('loggedIn!');
          // User is signed in.
          user = firebase.auth().currentUser;
          user.getIdToken().then((token) => {
            localStorage.setItem('token', token);
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
          'setUserLevel',
          'setUserStats'
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
              if (user.mail.toLowerCase() === mail.toLowerCase()) {
                console.log('user found!');
                localStorage.setItem('userId', user.userId);
                this.setUserPokemon({ value: user.pokemon });
                this.setUserStarters({ value: user.starters });
                this.setUserBasicInfo({ value: user.initialized });
                this.setUserLevel({ value: user.level });
                this.setUserCoins({ value: user.coins });
                this.setUserImage({ value: user.image });
                this.setUserStats({ value: user.stats });
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
        'getUserImage',
        'getLoad'
      ]),
    }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    background-color: lightblue;
  }

  .NavHeader {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: black;
    align-content: space-between;
  }

  .profileItem {
    margin: 2%;
    cursor: pointer;
  }

  #logoDiv {
   color: white;
   cursor: pointer;
   margin-left: 2%;
   flex: 3;
  }

  #profileDiv {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  #profileImg {
    width: 80px;
    height: 80px;
    border-radius: 50px;
  }

  .appLogo {
    flex: 3;
  }

  .appLogoCenter {
     flex: 4;
  }

  .fragment {
    text-align: center;
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
