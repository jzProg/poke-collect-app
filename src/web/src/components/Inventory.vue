<template>
  <div class="container">
    <h1>
      <img src="../assets/bag.png" height="70px" width="70px">
      <b>Inventory</b>
    </h1>
    <div class="row nav">
      <div v-for="(category, ind) in categories"
          :key="ind"
          :class="['col-md-4', (ind === selected)? 'selected' : '']"
          @click.prevent="choose(ind)"
          style="cursor: pointer">
         <h3><b>{{ category.text }}</b></h3>
      </div>
    </div>
    <div class="row">
      <div v-for="(it, index) in getItems.filter(item => item && item.type === categories[selected].filter)"
           class="col-md-3 item">
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
        selected: 0,
        showInfo: false,
        info: {},
        categories: [{ text: 'Evolution Stones', filter: 'stone' },
                     { text: 'Candies', filter: 'candy' },
                     { text: 'Items', filter: 'item' }]
      };
    },
    methods: {
      choose(index) {
        this.selected = index;
      },
      showItem(item) {
        this.info = item;
        this.showInfo = true;
      },
    },
    computed: {
      ...mapGetters([
        'getItems',
      ]),
    }
  }
</script>

<style scoped>
  .selected {
    background-color: lightgray;
    border-radius: 5px;
  }

  .nav {
    background-color: #E6E6FA;
    width: 100%;
    margin: 0 auto;
    border-radius: 15px;
  }

  .item {
    margin-top: 4%;
  }
</style>
