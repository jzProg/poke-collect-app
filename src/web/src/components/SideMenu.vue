<template>
  <div class="optionsDiv container" style="float: left;">
    <div class="row" style="width: 100%">
      <div class="coinsDiv col-md-12">
        <h2><b>{{ coins }} </b></h2>
        <i class="fas fa-coins fa-5x" style="color:yellow"></i>
      </div>
    </div><br>
    <div class="row" style="width: 100%">
      <div class="startersDiv col-md-12" style="cursor:pointer" @click.prevent="toggleCollection(false)">
        <h3><b>Your Starters</b></h3>
        <img src="..\assets\pikatsu.png" style="width:100px;height:100px">
      </div>
    </div><br>
    <div class="row" style="width: 100%">
      <div class="collectionDiv col-md-12" style="cursor:pointer" @click.prevent="toggleCollection(true)">
        <h3><b>Your Collection</b></h3>
        <img src="..\assets\collection.jpg" style="width:100px;height:100px">
      </div>
    </div>
    <div class="row" style="width: 100%">
      <div class="collectionDiv col-md-12">
        <button type="button" style="margin-top: 20%" class="btn btn-primary" @click.prevent="startGame()">Start Game</button>
      </div>
    </div>
    <div class="row" style="width: 100%">
      <div class="collectionDiv col-md-12" style="cursor:pointer" @click.prevent="toggleCollection(true)">
        <h3><b>Your Inventory</b></h3>
        <img src="..\assets\backpack.png" style="width:100px;height:100px">
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
    props:['coins','startGame','toggleCollection']
  }
</script>

<style scoped>

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
