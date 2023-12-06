<template>
  <div id='container' class="container">
    <div class="row">
      <div id="video_container">
        <video id="video" class="showP">
        <source src="../../src/assets/loginGif.mp4" type="video/mp4"></video>
        <img id="Logo" class='hideP' src="../../src/assets/PokeZagg.png">
      </div>
      <InputForm :fields="formItems" :error-message="getErrorLoginMessage" :on-focus="removeErrorMessage" :on-submit="login" />
      <div class="linkSpan">
        <router-link :to = "{ path:'register' }"> Not registered? Sign up here </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import InputForm from '@/components/InputForm';

  export default {
    name: 'Login',
    components: { InputForm },
    mixins: [uniqueIdGeneratorMixin],
    data () {
      return {
        formItems: [
          { type: 'text', id: 'email', text: 'Email', placeholder: 'enter email here' },
          { type: 'password', id: 'pass', text: 'Password', placeholder: 'enter password here' }
        ],
      }
    },
    mounted() {
      this.removeErrorMessage();
      const video = document.querySelector('video');
      video.muted = false;
      video.play()
           .catch(error => {
        console.log(`video error: ${error}. Showing logo instead...`);
        this.onAnimationEnd();
      });
      video.addEventListener('ended', this.onAnimationEnd);
    },
    methods: {
      onAnimationEnd() {
        const elementVideo = document.getElementById('video');
        const Logo = document.getElementById('Logo');
        this.fadeOutInEffect(elementVideo, Logo);
      },
      fadeOutInEffect(element,Logo) {
        element.classList.add('hideP');
        element.classList.remove('showP');
        Logo.classList.remove('hideP');
        Logo.classList.add('showP');
      },
      ...mapMutations([
         'setLoginErrorMessage',
      ]),
      ...mapActions([
        'userLogin',
      ]),
      login(values) {
        if (!values[0] || !values[1]) {
          this.setLoginErrorMessage({ value: 'All fields are required...' });
          return;
        }
        this.userLogin({ email: values[0], password: values[1] });
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
  #container{
    width: 100%;
    margin-top: 5%;
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

  .linkSpan {
    margin-top: 1%;
  }

  @media only screen and (max-width: 750px) {
    #Logo {
      width: 90%;
    }
  }
</style>
