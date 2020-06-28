<template>
 <div>
   <h1 class = 'text-center'>{{ title }} </h1>
   <Login></Login>
 </div>
</template>

<script>
  import  Login  from './Login.vue';
  import { mapActions, mapGetters } from 'vuex';
  import bus from "@/common/eventBus";

  export default {
    name: 'Welcome',
    data () {
      return {
        title: 'Welcome to Poke Collect App!',
      }
    },
    components:{
      Login
    },
    created(){
      bus.$on('login', (username) => {
        console.log('welcome --> on Login');
        this.storeUsername(username).then(() => {
          this.$router.push('getStarted');
        });
      });
    },
    methods: {
      ...mapActions([
          'storeUsername',
      ]),
    },
    computed: {
      ...mapGetters([
        'getUserBasicInfo',
      ]),
    }
  }
</script>

<style scoped>
</style>
