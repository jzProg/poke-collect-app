<template>
  <div id = 'container'>
    <form>
        <div class = 'form-group'>
          <label for = "email">Email: </label>
          <input id = 'email'
                 type = 'text'
                 class = 'form-control'
                 placeholder = 'enter email here'
                 @focus = 'removeErrorMessage()'
                 v-model = "enteredMail">
        </div>
        <div class = 'form-group'>
          <label for = "pass">Password: </label>
          <input id = 'pass'
                 type = 'password'
                 class = 'form-control'
                 placeholder = 'enter password here'
                 @focus = 'removeErrorMessage()'
                 v-model = "enteredPass">
        </div>
        <span id = 'errorMessageSpan' v-if = "getErrorLoginMessage">{{ getErrorLoginMessage }}</span>
        <div id = 'buttonDiv'>
         <button id = 'submitBtn'
                 type = 'submit'
                 class = 'btn btn-primary'
                 @click.prevent = "login">
           Sign In
         </button>
         <router-link :to = "{ path:'register' }"> Not registered? Sign up here</router-link>
       </div>
    </form>
  </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import { mapActions, mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Login',
    mixins: [uniqueIdGeneratorMixin],
    data () {
      return {
        enteredMail: '',
        enteredPass: '',
      }
    },
    mounted() {
      this.removeErrorMessage();
    },
    methods: {
      ...mapMutations([
         'setLoginErrorMessage',
      ]),
      ...mapActions([
        'userLogin',
      ]),
      login() {
       this.userLogin({ email: this.enteredMail, password: this.enteredPass });
      },
      removeErrorMessage() {
        this.setLoginErrorMessage({ value: '' });
      },
    },
    computed: {
      ...mapGetters([
          'getErrorLoginMessage',
      ]),
    },
  }
</script>

<style scoped>
#errorMessageSpan {
  color: red;
}

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
</style>
