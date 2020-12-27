<template>
  <div class="container">
    <h1 style="margin-bottom:5%">
      <img src="../assets/bag.png" height="70px" width="70px">
      <b>Inventory</b>
    </h1>
    <div class="row"
         v-for="(category, ind) in categories"
         :key="ind"
         style="width: 100%; margin-top: 4%"
         v-if="getItems.filter(item => item.type === category.filter).length">
      <h3><b>{{ category.text }}</b></h3>
      <div v-for="(it, index) in getItems.filter(item => item.type === category.filter)"
           :key="index"
           class="col-md-3"
           style="margin-top: 4%">
        <img :src="it.image"
             height="70"
             width="70"
             @click.prevent="showItem(it)"
             style="cursor:pointer">
        <h4>{{ it.name }}</h4>
      </div>
    </div>
    <ItemDetails v-if="showInfo"
                :info="info"
                :is-stone="info.type === prizes.STONE.type"
                @close="showInfo = false"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import ItemDetails from '@/components/modals/ItemDetails';

  export default {
    name: 'Inventory',
    mixins: [pokemonMixin],
    components: { ItemDetails },
    data() {
      return {
        showInfo: false,
        info: {},
        categories: [{ text: 'Evolution Stones', filter: 'stone' },
                     { text: 'Candies', filter: 'candy' },
                     { text: 'Items', filter: 'item' }]
      };
    },
    methods: {
      showItem(item) {
        this.info = item;
        this.showInfo = true;
      },
    },
    computed: {
      ...mapGetters([
        'getItems',
      ])
    }
  }
</script>
