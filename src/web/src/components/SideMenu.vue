<template>
  <div class="optionsDiv container"
       style="float: left;">
    <div class="row"
         style="width: 100%">
      <div class="coinsDiv col-md-12">
        <h2><b>{{ coins }} </b></h2>
        <i class="fas fa-coins fa-5x" style="color:yellow"></i>
      </div>
    </div><br>
    <div class="row"
         style="width: 100%"
         v-for="(category, index) in categories"
         :key="index">
      <div :class="['col-md-12', checkedCategory === index? 'checked' : '']"
           style="cursor:pointer; margin-left:5%; padding: 5%;"
           @click.prevent="setChecked(index);doAction(categories[index].type)">
        <h3><b>{{ categories[index].title }}</b></h3>
        <img :src="categories[index].image"
              style="width:100px;height:100px">
      </div>
    </div><br>
    <div class="row" style="width: 100%">
      <div class="col-md-12">
        <button type="button"
                style="margin-top: 20%"
                class="btn btn-primary"
                @click.prevent="startGame()">
              Start Game
        </button>
      </div>
    </div>
  </div>
</template>
<script>

  import Loading from '@/components/modals/Loading';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'Sidemenu',
    props:['coins','startGame','doAction'],
    data() {
      return {
         checkedCategory: 0,
         categories: [{
                        image: require('../assets/pikatsu.png'),
                        title: 'Your Starters',
                        type: 'STARTERS',
                      },
                      {
                        image: require('../assets/collection.jpg'),
                        title: 'Your Collection',
                        type: 'COLLECTION',
                      },
                      {
                        image: require('../assets/backpack.png'),
                        title: 'Your Inventory',
                        type: 'ITEMS',
                    }],
      }
    },
    methods: {
      setChecked(index) {
        this.checkedCategory = index;
      }
    }
  }
</script>

<style scoped>

  .optionsDiv {
    width: 10%;
  }
  .pokemonDiv {
    width: 90%;
  }

  .checked {
    border: 3px solid gray;
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
