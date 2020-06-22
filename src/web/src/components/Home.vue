<template>
  <div>
  <button type="button" style="margin-top: 2%" class="btn btn-primary" @click.prevent="startGame()">Play</button>
  <div class="startersDiv">
    <h1>Your Starters</h1>
    <Poke-list :poke-list="getStartersUpdated" :simple-mode="true"></Poke-list>
  </div>
  <div class="collectionDiv">
    <h1>Your Collection</h1>
    <Poke-list :poke-list="getCollectionUpdated" :simple-mode="true"></Poke-list>
  </div>
  </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';
  import PokeList from './PokemonList.vue';

  export default {
    name: 'Home',
    mixins: [uniqueIdGeneratorMixin, pokemonMixin],
    components: {PokeList},
    data() {
      return {
        starters: [],
        collection: [],
      }
    },
    created() {
      if (!this.getLoginUsername) {
        bus.$on('login', (username) => {
          console.log('Home --> on Login')
          this.storeUsername(username);
          this.initData();
        });
      } else this.initData();
    },
    methods: {
      ...mapActions([
          'storeUsername',
      ]),
      initData() {
        this.getStarters();
        this.getCollection();
      },
      getStarters() {
       this.getPokemonInfoFromList(this.getUserStarters, this.starters);
      },
      getCollection() {
       this.getPokemonInfoFromList(this.getUserPokemon, this.collection);
      },
      startGame() {
        this.$router.push('Game');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
        'getUserStarters',
        'getLoginUsername'
      ]),
      getStartersUpdated() {
        return this.starters;
      },
      getCollectionUpdated() {
        return this.collection;
      },
    },
  }
</script>
