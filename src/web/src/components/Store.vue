<template>
  <div class="container">
    <h1 style="margin-bottom:5%"><img src="../assets/shopping_bag.png" height="70px" width="70px"><b>Pokemon Store</b></h1>
    <h4 style="margin-bottom:10%"><i>Available coins:</i> <span style="color:yellow">{{ getUserCoins }}</span></h4>
   <div class="row">
     <div id="pack" class="col-md-4" style="cursor:pointer">
       <h3><b>Pokemon Packs</b></h3><br>
       <img src="../assets/pokemon_pack.png" @click.prevent="buyPacks()" height="200px" width="200px">
       <h4>Buy Pokemon packs</h4>
     </div>
     <div id="stone" class="col-md-4" style="cursor:pointer">
       <h3><b>Evolution Stones</b></h3><br>
       <img src="../assets/stone2.png" @click.prevent="buyStones()" height="200px" width="200px">
       <h4>Buy Stones and evolve your pokemon!</h4>
     </div>
     <div id="item" class="col-md-4" style="cursor:pointer">
       <h3><b>Rare Candies</b></h3><br>
       <img src="../assets/candy.png" @click.prevent="buyCandies()" height="200px" width="200px">
       <h4>Buy candies to level up your pokemon!</h4>
     </div>
   </div>
   <BuyModal v-if="showBuyModal" :items="availableItems" :buyAction="onBuyAction" :error="error" @close="showBuyModal = false"></BuyModal>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import bus from "@/common/eventBus";
  import BuyModal from "@/components/modals/BuyModal";
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';

  export default {
    name: 'Store',
    components: {BuyModal},
    mixins: [pokemonMixin, uniqueIdGeneratorMixin],
    data() {
      return {
        availableItems: [],
        stoneInfo: [],
        candyInfo: {},
        showBuyModal: false,
        error: '',
      }
    },
    created() {
      for(var i = 0; i < this.prizes.STONE.items.length; i++) {
        this.getItem(this.prizes.STONE.items[i].title).then(item => {
         this.stoneInfo.push({ image: item.sprites.default, text: item.effect_entries[0].short_effect });
        });
      };
      this.getItem(this.prizes.CANDY.items[0].title).then(candy => {
        this.candyInfo = { image: candy.sprites.default, text: candy.effect_entries[0].short_effect };
      });
    },
    methods: {
      ...mapMutations([
        'setCurrentReward',
        'setLoad'
      ]),
      ...mapActions([
        'purchase',
      ]),
      buyPacks() {
        this.availableItems = this.prizes.PACK;
        this.showBuyModal = true;
      },
      buyStones() {
        this.availableItems = this.prizes.STONE;
        for(var i = 0; i < this.stoneInfo.length; i++) {
          this.availableItems.items[i].image = this.stoneInfo[i].image;
          this.availableItems.items[i].text = this.stoneInfo[i].text;
        }
        this.showBuyModal = true;
      },
      buyCandies() {
        this.availableItems = this.prizes.CANDY;
        this.availableItems.items[0].image = this.candyInfo.image;
        this.availableItems.items[0].text = this.candyInfo.text;
        this.showBuyModal = true;
      },
      onBuyAction(itemBudle, rewardType, coins) {
        this.setLoad({ value: true });
        var itemList = [];
        if (rewardType === this.prizes.PACK.type) {
          var newItems = [];
          var quantity = itemBudle[0].quantity;
          try {
            for(var i = 0; i < quantity*this.packInfo.NUM_OF_CARDS; i++) {
              newItems.push(this.chooseRandomPokemon(1, this.totalPokemon));
            };
          } catch(error) {
            this.error = error;
            return;
          }
          this.getPokemonInfoFromList(newItems, itemList).then(() => {
              itemBudle[0].items = itemList;
              this.purchase({ items: itemBudle, type: rewardType, cost: coins }).then(() => {
                this.setCurrentReward({ value: itemList, type: rewardType });
                this.setLoad({ value: false });
                this.$router.push('reward');
              });
          });
        } else { // stone or candy
          itemList = itemBudle.map(item => item.image);
          this.purchase({ items: itemBudle, type: rewardType, cost: coins }).then(() => {
            this.setCurrentReward({ value: itemList, type: rewardType });
            this.setLoad({ value: false });
            this.$router.push('reward');
          });
        }
      }
    },
    computed: {
      ...mapGetters([
        'getUserCoins',
      ]),
    }
  }
</script>
