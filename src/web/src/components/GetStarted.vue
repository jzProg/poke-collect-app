<template>
 <div>
   <h1>Choose your starter pokemon!</h1>
   <h3>...and gain <span style="color:red">+3</span> more pokemon</h3>
    <Poke-list :poke-list="list" :action-on-click="awardUser"></Poke-list>
 </div>
</template>

<script>
  import { mapMutations, mapActions, mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import PokeList from './PokemonList.vue';

  export default {
    name: 'GetStarted',
    mixins: [pokemonMixin, uniqueIdGeneratorMixin],
    components: {PokeList},
    data () {
      return {
        list:[],
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
          if (vm.getUserBasicInfo) {
            next('home');
          }
          else next();
      });
    },
    created(){
      this.getPokemonInfoFromList(this.startersInfo.STANDARD_STARTERS, this.list);
    },
    methods: {
      ...mapMutations([
        'setCurrentReward',
      ]),
      ...mapActions([
        'storePokemon',
      ]),
      awardUser(pokeName) {
        console.log('about to be awarded...You chose: ' + pokeName);
        var listOfStarters = [pokeName];
        for(var i=1; i < this.startersInfo.NUM_OF_STARTERS; i++) {
          listOfStarters.push(this.getRandomInt(0, this.totalPokemon));
        };
        var randomPokeList =  [];
        this.getPokemonInfoFromList(listOfStarters, randomPokeList);
        this.setCurrentReward({ type: this.prizes.PACK, value:  randomPokeList});
        this.storePokemon({ list: randomPokeList , ids: listOfStarters, coins: this.coinsInfo.START_COINS });
        this.$router.push('reward');
      }
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
