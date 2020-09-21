<template>
  <div class="container">
    <h1 style="margin-bottom:5%"><img src="../assets/bag.png" height="70px" width="70px"><b>Inventory</b></h1>
   <div class="row" style="width: 100%;margin-top:4%" v-if="stones.length">
     <h3><b>Evolution Stones</b></h3>
     <div v-for="(stone, index) in stones" :key="index" :class="['col-md-' + Math.ceil(12/stones.length)]" style="margin-top:4%">
       <img :src="stone.image" height="70" width="70">
       <h4>{{ stone.name }}</h4>
     </div>
   </div>
   <div class="row" style="width: 100%;margin-top:4%" v-if="items.length">
     <h3><b>Items</b></h3>
     <div v-for="(item, index) in items" :key="index" :class="['col-md-' + Math.ceil(12/items.length)]" style="margin-top:4%">
       <img :src="item.image" height="70" width="70">
       <h4>{{ item.name }}</h4>
     </div>
   </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
    name: 'Inventory',
    mixins: [pokemonMixin],
    computed: {
      ...mapGetters([
        'getItems'
      ]),
      items() {
        if (!this.getItems) return [];
        return this.getItems.filter(item => item.type === this.gameRewards[0].type);
      },
      stones() {
        if (!this.getItems) return [];
        return this.getItems.filter(item => item.type === this.prizes.STONE.type);
      }
    }
  }
</script>
