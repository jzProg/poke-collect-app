<template>
  <div>
  <Sidemenu :coins="getUserCoins" :doAction="actionFor" :startGame="startGame" ></Sidemenu>
  <div class="pokemonDiv container">
    <div class="row" style="width: 100%">
      <div class="col-md-12">
        <div class="pagination" v-if="showCollection && getCollectionUpdated.length > 20">
          <button class="prev btn btn-primary" @click.prevent="prevPage()" :disabled="!hasPrev()">prev</button>
          <button class="next btn btn-primary" @click.prevent="nextPage()" :disabled="!hasNext()">next</button>
         </div>
        <Poke-list :poke-list="showCollection? getCollectionUpdated : getStartersUpdated"
                   :action-on-click="showCollection ? onClickAction : onInfo"
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
  <PokemonDetails v-if="seeDetails"
                 @close="seeDetails=false"
                 :info="selectedPokemon"/>
  <Loading v-if="toLoad"></Loading>
  </div>
</template>

<script>
  import Sidemenu from '@/components/SideMenu';
  import Loading from '@/components/modals/Loading';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';
  import PokeList from '@/components/PokemonList';
  import Options from '@/components/modals/Options';
  import imagesLoaded from 'vue-images-loaded';
  import PokemonDetails from '@/components/modals/PokemonDetails';
  import urlAuth from '@/common/helpers/urlAuth';

  export default {
    name: 'Home',
    mixins: [uniqueIdGeneratorMixin, pokemonMixin, urlAuth],
    components: {PokeList, PokemonDetails, Loading, Sidemenu, Options},
    directives: {
      imageloader: imagesLoaded,
    },
    data() {
      return {
        starters: [],
        collection: [],
        showCollection: false,
        showOptions: false,
        seeDetails: false,
        page: 0,
        imageLoadedStarters: false,
        selectedPokemon:{},
        imageLoadedCollection: false,
      }
    },
    created() {
      if (!this.getLoginUsername) {
        bus.$on('login', (username) => {
          if (this.isPath('/home')) {
            console.log('Home --> on Login')
            this.storeUsername(username);
            this.initData();
          }
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
      hasPrev() {
        return this.page > 0;
      },
      hasNext() {
        return (this.page + 1)*20 < this.getCollectionUpdated.length;
      },
      onInfo(name) {
        this.seeDetails = true;
        this.selectedPokemon = this.collection.filter(item => item.name === name )[0];
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
        case 'ITEMS': this.goToInventory();
                      break;
        default: this.startGame();
        }
      },
      startGame() {
        this.$router.push('Game');
      },
      goToInventory() {
        this.$router.push('inventory');
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
