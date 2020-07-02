<template>
  <div>
  <Sidemenu :coins="getUserCoins" :toggleCollection="toggleCollection" :startGame="startGame" ></Sidemenu>
  <div class="pokemonDiv container" style="float: right; min-height:2000px;background-color:lightblue">
    <div class="row" style="width: 100%">
      <div class="col-md-12">
        <Poke-list :poke-list="showCollection? getCollectionUpdated : getStartersUpdated"
                   :action-on-click="onClickAction"
                   :simple-mode="showCollection">
       </Poke-list >
      </div>
    </div>
  </div>
  <PokemonDetails v-if="showDetails" @close="showDetails=false" :info="getSelectedPokemon"/>
<!--  <Loading></Loading> -->
  </div>
</template>

<script>
  import Sidemenu from './Sidemenu.vue'
  import Loading from '@/components/modals/Loading';
  import PokemonDetails from '@/components/modals/PokemonDetails';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';
  import PokeList from './PokemonList.vue';

  export default {
    name: 'Home',
    mixins: [uniqueIdGeneratorMixin, pokemonMixin],
    components: {PokeList,PokemonDetails,Loading,Sidemenu},
    data() {
      return {
        starters: [],
        collection: [],
        showCollection: false,
        showDetails: false,
        selectedPokemon:{}
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
      onClickAction(name){
        if(this.showCollection) {
          this.showDetails = true;
          this.selectedPokemon = this.collection.filter(item => item.name === name )[0];
        }
      },
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
      getSelectedPokemon() {
        return this.selectedPokemon;
      },
      getStartersUpdated() {
        return this.starters;
      },
      getCollectionUpdated() {
        return this.collection;
      },
    },
  }
</script>

<style scoped>

  .optionsDiv {
    width: 10%;
  }
  .pokemonDiv {
    width: 90%;
  }

 @media only screen and (max-width: 600px) {
   .optionsDiv {
     width: 30%;
   }
   .pokemonDiv {
     width: 70%;
   }
}
</style>
