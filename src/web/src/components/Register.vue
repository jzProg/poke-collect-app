<template>
 <div id = 'container'>
  <h1 class = 'text-center'>Be A Member!</h1>
    <form style = "margin-top: 4%">
        <div class = 'form-group'>
          <label for = "username">Username: </label>
          <input id = 'username'
                 type = 'text'
                 class = 'form-control'
                 @focus = 'removeErrorMessage()'
                 placeholder = 'enter username here'
                 v-model = "enteredName">
        </div>
        <div class = 'form-group'>
          <label for = "mail">Email: </label>
          <input id = 'mail'
                 type = 'email'
                 class = 'form-control'
                 @focus = 'removeErrorMessage()'
                 placeholder = 'enter mail here'
                 v-model = "enteredMail">
        </div>
        <div class = 'form-group'>
          <label for = "pass">Password: </label>
          <input id = 'pass'
                 type = 'password'
                 class = 'form-control'
                 @focus = 'removeErrorMessage()'
                 placeholder = 'enter password here'
                 v-model = "enteredPass">
        </div>
        <span v-if = "getErrorRegisterMessage" id = "errorRegisterSpan"> {{ getErrorRegisterMessage }}</span>
        <div id = 'buttonDiv'>
         <button id = 'submitBtn'
                 type = 'submit'
                 class = 'btn btn-primary'
                 @click.prevent = "register">Sign Up</button>
         <router-link :to = "{ path:'/' }"> Already an account? Sign in here</router-link>
       </div>
    </form>
 </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Register',
    mixins: [uniqueIdGeneratorMixin],
    data () {
      return {
        enteredName: '',
        enteredMail: '',
        enteredPass: '',
        showModal: false,
      }
    },
    created() {
      bus.$on('login', () => {
        this.$router.push('getStarted');
      });
    },
    mounted() {
      this.removeErrorMessage();
    },
    methods: {
      ...mapMutations([
          'setRegisterErrorMessage',
      ]),
      ...mapActions([
        'userAuth',
        'userLogin',
        'createUserProfile',
        'getUserLoginInfo',
        'storeUsername',
      ]),
      register() {
        const newUserEntry = {
          email: this.enteredMail,
          password: this.enteredPass
        };
        this.userAuth(newUserEntry).then(() => {
          this.storeUsername(this.enteredName);
          this.userLogin(newUserEntry).then(() => {
            this.createUserProfile({ userId: this.guid(), username: this.enteredName });
          });
        });
      },
      removeErrorMessage() {
        this.setRegisterErrorMessage({ value: '' });
      },
    },
    computed: {
      ...mapGetters([
          'getErrorRegisterMessage',
      ])
    }
  }
</script>

<style scoped>
  #container{
    padding-left:30%;
    padding-right:30%;
    margin-top:5%;
  }

  #submitBtn{
    margin-right:2%;
  }

  #buttonDiv{
    margin-top:4%;
  }

  #errorRegisterSpan {
    color: red;
  }
</style>
