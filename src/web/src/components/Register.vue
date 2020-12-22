<template>
 <div id = 'container'>
  <h1 class = 'text-center'>Be A Member!</h1>
  <InputForm :fields="formItems" :error-message="getErrorRegisterMessage" :on-focus="removeErrorMessage" :on-submit="register" />
  <div class="linkSpan">
    <router-link :to = "{ path:'/' }"> Already an account? Sign in here</router-link>
  </div>
 </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import urlAuth from '@/common/helpers/urlAuth';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import InputForm from '@/components/InputForm';

  export default {
    name: 'Register',
    components: { InputForm },
    mixins: [uniqueIdGeneratorMixin, urlAuth],
    data () {
      return {
        formItems: [
          { type: 'text', id: 'username', text: 'Username', placeholder: 'enter username here' },
          { type: 'text', id: 'email', text: 'Email', placeholder: 'enter email here' },
          { type: 'password', id: 'pass', text: 'Password', placeholder: 'enter password here' }
        ],
        showModal: false,
      }
    },
    created() {
      bus.$on('login', () => {
        if (this.isPath('/register')) {
          console.log('Register --> on Login');
          this.$router.push('getStarted');
        }
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
        'findUserByUsername',
      ]),
      register(values) {
        const [username, email, password] = values;
        if (!username || !email || !password) {
          this.setRegisterErrorMessage({ value: 'All fields are required...' });
          return;
        }
         this.findUserByUsername({ username });
         var errorInRegister = this.getErrorRegisterMessage;
         if (!errorInRegister) {
           const newUserEntry = {
             email,
             password
           };
           this.userAuth(newUserEntry).then(() => {
             errorInRegister = this.getErrorRegisterMessage;
             if (!errorInRegister) {
               this.storeUsername(username);
               this.userLogin(newUserEntry).then(() => {
                 this.createUserProfile({ userId: this.guid(), username, mail: email });
               });
             }
           });
         }
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
  #container {
    margin-top:5%;
    width: 100%;
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

  .linkSpan {
    margin-top: 1%;
  }
</style>
