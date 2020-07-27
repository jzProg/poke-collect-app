<template>
  <div id = 'container'>

    <div id="video_container">

  <video id="video" class="showP">
  <source src="../../src/assets/loginGif.mp4" type="video/mp4"></video>
  <img id="Logo" class='hideP' src="../../src/assets/PokeZagg.png"></img></div>



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

      var video = document.querySelector('video');
      video.muted = true;
      video.play();
      video.addEventListener('ended',()=>{
        var elementVideo=document.getElementById('video')
        var Logo=document.getElementById('Logo')
          this.fadeOutInEffect(elementVideo,Logo)
        });
      },
    methods: {
      fadeOutInEffect(element,Logo){
        element.classList.add('hideP')
        element.classList.remove('showP')
        Logo.classList.remove('hideP')
        Logo.classList.add('showP')
        //var Logo=document.createElement("img")
      //  Logo.src='../../src/assets/PokeZagg.png'
        //element.replaceWith(Logo)

      },
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

.showP{
  opacity: 1;
  transition: opacity 1000ms;
  width:500px;
  height:300px;
}
.hideP{
  opacity: 0;
  transition: opacity 1000ms;
  width:0px;
  height:0px;
}
</style>
