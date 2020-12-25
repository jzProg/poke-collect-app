<template>
  <div>
   <b-sidebar id="sidebar-variant"
              bg-variant="dark"
              width="170px"
              noHeader
              text-variant="light"
              shadow>
              <div class="px-3 py-2 optionsDiv">
                 <div class="item">
                   <h2><b>{{ coins }} </b></h2>
                   <i class="fas fa-coins fa-5x" style="color:yellow"></i>
                 </div>
                 <div class="item"
                      v-for="(category, index) in categories"
                      :key="index">
                   <div :class="['item', checkedCategory === index? 'checked' : '']"
                        style="cursor:pointer;"
                        @click.prevent="setChecked(index);doAction(categories[index].type)">
                     <h3><b>{{ categories[index].title }}</b></h3>
                     <b-img :src="categories[index].image" class="categoryImage"/>
                   </div>
                 </div>
              </div>
      </b-sidebar>
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
       show: true,
       checkedCategory: 0,
       categories: [{
                      image: require('../assets/pikatsu.png'),
                      title: 'Your Starters',
                      type: 'STARTERS',
                    },
                    {
                      image: require('../assets/collectionpokeballs.png'),
                      title: 'Your Collection',
                      type: 'COLLECTION',
                    },
                    {
                      image: require('../assets/backpack.png'),
                      title: 'Your Inventory',
                      type: 'ITEMS',

                  },
                  {image: require('../assets/battle.png'),
                  title: 'Battle',
                  type: 'MODES'
                  }
            ]}
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
    background-color:#4a3f35 !important;
    color:#ff4301;
    padding: 2%;
    height: 100%;
  }

  .item {
    margin: 1%;
    padding: 2%;
  }

  .checked {
    background-color:#ff4301;
    box-shadow: 5px 5px #2f2519;
    transform: translateY(4px);
    color:white;
  }

  .icon:active {
    box-shadow: 0 5px #666;
    transform: translateY(4px);
    color:#e9ec08;
  }

  .categoryImage {
     width: 100px;
     height: 100px;
  }

 @media only screen and (max-width: 900px) {
   .categoryImage {
      width: 50px;
      height: 50px;
   }
}

</style>
