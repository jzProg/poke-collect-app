<template>
  <div>
  <Sidemenu :coins="getUserCoins" :doAction="actionFor" :startGame="startGame" ></Sidemenu>
  <div class="pokemonDiv container">
    <div class="row" style="width: 100%">
      <div class="col-md-12">
        <div class="pagination" v-if="showCollection && getCollectionUpdated.length > 20">
          <button class="prev" @click.prevent="prevPage()">prev</button>
          <button class="next" @click.prevent="nextPage()">next</button>
         </div>
        <Poke-list :poke-list="showCollection? getCollectionUpdated : getStartersUpdated"
                   :action-on-click="showCollection ? onClickAction : null"
                   v-imageloader="loaded"
                   :page="page"
                   :simple-mode="showCollection">
       </Poke-list >
      </div>
    </div>
  </div>
  <Options v-if="showOptions"
            :poke-list="getStartersUpdated"
            :selected-pokemon="selectedPokemon"
            @close="showOptions=false" />
  <Loading v-if="toLoad"></Loading>
  </div>
</template>

<script>
  import Sidemenu from './Sidemenu.vue'
  import Loading from '@/components/modals/Loading';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';
  import PokeList from './PokemonList.vue';
  import Options from '@/components/modals/Options';
  import imagesLoaded from 'vue-images-loaded';

  export default {
    name: 'Home',
    mixins: [uniqueIdGeneratorMixin, pokemonMixin],
    components: {PokeList,Loading,Sidemenu,Options},
    directives: {
      imageloader: imagesLoaded,
    },
    data() {
      return {
        starters: [],
        collection: [],
        showCollection: false,
        showOptions: false,
        page: 0,
        imageLoadedStarters: false,
        selectedPokemon:{},
        imageLoadedCollection: false,
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
      loaded() {
        console.log('loaded.....');
        if (this.showCollection) {
          this.imageLoadedCollection = true;
        } else {
          this.imageLoadedStarters = true;
        }
      },
      nextPage() {
        this.page += 1;
      },
      prevPage() {
        this.page -= 1;
      },
      onClickAction(name){
          this.showOptions = true;
          this.selectedPokemon = this.collection.filter(item => item.name === name )[0];
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
      actionFor(category) {
        switch (category) {
        case 'STARTERS': this.toggleCollection(false);
                      break;
        case 'COLLECTION': this.toggleCollection(true);
                      break;
        case 'ITEMS': this.toggleCollection(true);// TODO change
                      break;
        default: this.startGame();
        }
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
      toLoad() {
        if(this.showCollection) {
          return !this.imageLoadedCollection;
        }
        return !this.imageLoadedStarters;
      },
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
.pokemonDiv.container{
  float: right;
  background-color:lightblue
}

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
