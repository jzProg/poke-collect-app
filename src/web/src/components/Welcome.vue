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
        this.storeUsername(username).then(() => {
          this.fetchUserPokemon(this.getLoginUsername).then(() => {
            if (!this.getUserBasicInfo) {
              this.$router.push('getStarted');
            } else {
              this.$router.push('home');
            }
          });
        });
      });
    },
    methods: {
      ...mapActions([
          'storeUsername',
          'fetchUserPokemon',
      ]),
    },
    computed: {
      ...mapGetters([
        'getLoginUsername',
        'getUserBasicInfo',
      ]),
    }
  }
</script>

<style scoped>
</style>
