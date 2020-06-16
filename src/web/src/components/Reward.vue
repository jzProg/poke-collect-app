<template>
 <div>
    <h3>You obtained new Reward!</h3>
    <Poke-list v-if="type === prizes.PACK" :poke-list="list"></Poke-list> <!-- todo add cases prize.COINS, prize.ITEM -->
    <br>
    <button @click.prevent="goToHome()" class="btn btn-primary">Get Started!</button>
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
