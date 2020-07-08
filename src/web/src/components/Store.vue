<template>
  <div class="container">
    <h1 style="margin-bottom:10%"><img src="../assets/shopping_bag.png" height="70px" width="70px"><b>Pokemon Store</b></h1>
   <row>
     <div id="pack" class="col-md-4" style="cursor:pointer">
       <h3><b>Pokemon Packs</b></h3><br>
       <img src="../assets/pokemon_pack.png" @click.prevent="buyPacks()" height="200px" width="200px">
       <h4>Buy Pokemon and items</h4>
     </div>
     <div id="stone" class="col-md-4" style="cursor:pointer">
       <h3><b>Evolution Stones</b></h3><br>
       <img src="../assets/stone2.png" @click.prevent="buyStones()" height="200px" width="200px">
       <h4>Buy Stones and evolve your pokemon!</h4>
     </div>
     <div id="item" class="col-md-4" style="opacity:0.5">
       <h3><b>Items</b></h3><br>
       <img src="../assets/berry.png" @click.prevent="buyItems()" height="200px" width="200px">
       <h4>Buy items</h4>
     </div>
   </row>
  </div>
</template>

<script>
import bus from "@/common/eventBus";

  export default {
    name: 'Store',
    methods: {
      buyPacks() {

      },
      buyStones() {

      },
      buyItems() {
        console.log("buying items...");
      }
    },
  }
</script>
