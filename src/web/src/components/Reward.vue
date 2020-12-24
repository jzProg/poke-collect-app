<template>
 <div>
    <h3>You obtained new Reward!</h3>
    <Poke-list v-if="type === this.prizes.PACK.type" :poke-list="list" :simpleMode="false" :page="page"/>
    <img v-else v-for="(item, index) in list" :src="item" :key="index" height="200px" width="200px">
    <br>
    <button @click.prevent="goToHome()" class="btn btn-primary">Continue</button>
 </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import PokeList from './PokemonList.vue';

  export default {
    name: 'Reward',
    mixins: [pokemonMixin],
    components: {PokeList},
    data () {
      return {
        list:[],
        type: '',
        page: 0,
      }
    },
    created(){
      this.type = this.getCurrentReward.rewardType;
      this.list = this.getCurrentReward.rewardId;
    },
    methods: {
      goToHome() {
        this.$router.push("home");
      },
    },
    computed: {
      ...mapGetters([
        'getCurrentReward',
      ]),
    },
  }
</script>

<style scoped>
</style>
