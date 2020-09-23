<template>
 <div>
   <Login></Login>
 </div>
</template>

<script>
  import  Login  from './Login.vue';
  import { mapActions, mapGetters } from 'vuex';
  import bus from "@/common/eventBus";
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';

  export default {
    name: 'Welcome',
    mixins: [uniqueIdGeneratorMixin],
    components:{
      Login
    },
    created(){
      bus.$on('login', (username) => {
        if (this.isPath('/')) {
          console.log('welcome --> on Login');
          this.storeUsername(username).then(() => {
            this.$router.push('getStarted');
          });
        }
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
