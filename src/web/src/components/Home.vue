<template>
  <div>
  <div class="startersDiv">
    <h1>Your Starters</h1>
    <Poke-list :poke-list="starters" :simple-mode="true"></Poke-list>
  </div>
  <div class="collectionDiv">
    <h1>Your Collection</h1>
    <Poke-list :poke-list="collection" :simple-mode="true"></Poke-list>
  </div>
  <button type="button" class="btn btn-primary" @click.prevent="startGame()">Play</button>
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
        });
        this.getStarters();
        this.getCollection();
      }
    },
    methods: {
      ...mapActions([
          'storeUsername',
      ]),
      getStarters() {
        this.getPokemonInfoFromList(this.getUserPokemon, this.starters);

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
      ])
    }
  }
</script>
