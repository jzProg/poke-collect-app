<template>
  <div>
    <Sidemenu :coins="getUserCoins" :doAction="actionFor" :startGame="startGame" />
    <div class="pokemonDiv container">
      <div class="row" style="width: 100%">
        <div class="col-md-12">
          <div class="pagination" v-if="showCollection && getCollectionUpdated.length > 20">
            <span class="navArrow" @click.prevent="prevPage()" :disabled="!hasPrev()">
              <i class="fas fa-caret-left fa-3x" :disabled="!hasPrev()"/>
            </span>
            <span class="navArrow" @click.prevent="nextPage()" :disabled="!hasNext()">
            <i class="fas fa-caret-right fa-3x" />
            </span>
           </div>
           <Poke-list :poke-list="showCollection? getCollectionUpdated : getStartersUpdated"
                     :action-on-click="showCollection ? onClickAction : onInfo"
                     v-imageloader="loaded"
                     :page="page[showCollection]"
                     :simple-mode="!showCollection">
          </Poke-list>
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
  </div>
</template>

<script>
  import Sidemenu from '@/components/SideMenu';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import PokeList from '@/components/PokemonList';
  import Options from '@/components/modals/Options';
  import imagesLoaded from 'vue-images-loaded';
  import PokemonDetails from '@/components/modals/PokemonDetails';
  import urlAuth from '@/common/helpers/urlAuth';

  export default {
    name: 'Home',
    mixins: [ uniqueIdGeneratorMixin, pokemonMixin, urlAuth ],
    components: { PokeList, PokemonDetails, Sidemenu, Options },
    directives: {
      imageloader: imagesLoaded,
    },
    data() {
      return {
        showCollection: false,
        showOptions: false,
        seeDetails: false,
        page: { false: 0, true: 0 }, // page per tab
        imageLoadedStarters: false,
        selectedPokemon: {},
        imageLoadedCollection: false,
      }
    },
    created() {
      this.setLoad({ value: true });
      if (!this.getLoginUsername) {
        bus.$on('login', (username) => {
          if (this.isPath('/home')) {
            console.log('Home --> on Login')
            this.storeUsername(username);
          }
        });
      }
    },
    methods: {
      ...mapMutations([
        'setLoad'
      ]),
      loaded() {
        console.log('loaded.....');
        if (this.showCollection) {
          this.imageLoadedCollection = true;
        } else {
          this.imageLoadedStarters = true;
        }
        this.setLoad({ value: false });
      },
      nextPage() {
        this.page[this.showCollection] += 1;
      },
      prevPage() {
        this.page[this.showCollection] -= 1;
      },
      hasPrev() {
        return this.page[this.showCollection] > 0;
      },
      hasNext() {
        return (this.page[this.showCollection] + 1)*20 < this.getCollectionUpdated.length;
      },
      onInfo(name) {
        this.seeDetails = true;
        this.selectedPokemon = this.getCollectionUpdated.filter(item => item.name === name )[0];
      },
      onClickAction(name){
        this.showOptions = true;
        this.selectedPokemon = this.getCollectionUpdated.filter(item => item.name === name )[0];
      },
      ...mapActions([
          'storeUsername',
      ]),
      toggleCollection(showCollection) {
        this.setLoad({ value: true });
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
      getSelectedPokemon() {
        return this.selectedPokemon;
      },
      getStartersUpdated() {
        return this.getUserStarters;
      },
      getCollectionUpdated() {
        return this.getUserPokemon;
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

  .navArrow {
    cursor: pointer;
    font-weight: bold;
  }

  span[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  @media only screen and (max-width: 1200px) {
    .optionsDiv {
      width: 20%;
    }
    .pokemonDiv {
      width: 80%;
    }
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
