<template>
  <div>
  <div class="container" style="width: 10%;float: left;">
    <div class="row" style="width: 100%">
      <div class="coinsDiv col-md-12">
        <h2><b>{{ getUserCoins }} </b></h2>
        <i class="fas fa-coins fa-5x" style="color:yellow"></i>
      </div>
    </div><br>
    <div class="row" style="width: 100%">
      <div class="startersDiv col-md-12" style="cursor:pointer" @click.prevent="toggleCollection(false)">
        <h3><b>Your Starters</b></h3>
        <img src="..\assets\pikatsu.png" style="width:100px;height:100px">
      </div>
    </div><br>
    <div class="row" style="width: 100%">
      <div class="collectionDiv col-md-12" style="cursor:pointer" @click.prevent="toggleCollection(true)">
        <h3><b>Your Collection</b></h3>
        <img src="..\assets\collection.jpg" style="width:100px;height:100px">
      </div>
    </div>
    <div class="row" style="width: 100%">
      <div class="collectionDiv col-md-12">
        <button type="button" style="margin-top: 20%" class="btn btn-primary" @click.prevent="startGame()">Start Game</button>
      </div>
    </div>
  </div>
  <div class="container" style="width: 90%; float: right; min-height:2000px;background-color:lightblue">
    <div class="row" style="width: 100%">
      <div class="col-md-12">
        <Poke-list :poke-list="showCollection? getCollectionUpdated : getStartersUpdated"
                   :simple-mode="true">
       </Poke-list>
      </div>
    </div>
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
        showCollection: false
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
      toggleCollection(showCollection) {
        this.showCollection = showCollection;
      },
      startGame() {
        this.$router.push('Game');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
        'getUserStarters',
        'getLoginUsername',
        'getUserCoins'
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
