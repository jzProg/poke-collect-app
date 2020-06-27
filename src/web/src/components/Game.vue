<template>
 <div>
	<!--svg-map id= "map" :map="Japan" /-->
  <!--div id='mapContainer' style="width: 55%;float:right;">
    <checkbox-svg-map v-model="selectedLocations" :map="Japan" />
  </div-->
  <h2 class="text-center"><b>Choose what you want to do!</b></h2>
  <div class="container" style="margin-top:5%">
   <div class="row">
    <div id="store" class="col-md-4" style="opacity:0.5">
      <h3><b>Store</b></h3><br>
      <img src="../assets/store.png" height="200px" width="200px">
      <h4>Buy Pokemon and items</h4>
    </div>
    <div id="store" class="col-md-4" style="cursor:pointer">
      <h3><b>Battle Avatar</b></h3><br>
      <img src="../assets/pokemon-avatar.png" @click.prevent="goToBattle()" height="200px" width="200px">
      <h4>Battle popular Pokemon trainers</h4>
    </div>
    <div id="store" class="col-md-4" style="opacity:0.5">
      <h3><b>Online Battle</b></h3><br>
      <img src="../assets/battle-online.png" height="200px" width="200px">
      <h4>Battle other users</h4>
    </div>
   </div>
   <div class="row" style="margin-top:5%">
     <div id="store" class="col-md-4" style="opacity:0.5">
       <h3><b>Find Pokemon</b></h3><br>
       <img src="../assets/pokemon-location.png" height="200px" width="200px">
       <h4>Battle random pokemon</h4>
     </div>
     <div id="store" class="col-md-4" style="opacity:0.5">
       <h3><b>Gym Battle</b></h3><br>
       <img src="../assets/gym-battle.png" height="200px" width="200px">
       <h4>Battle gym leaders and gain your badges</h4>
     </div>
   </div>
  </div>
  <AvatarModal v-if = "showModal"
               @close = "onModalClose">
 </AvatarModal>
 </div>
</template>

<script>
//import { SvgMap, CheckboxSvgMap } from "vue-svg-map";
//import Japan from "@svg-maps/japan";
import AvatarModal from '@/components/modals/AvatarModal';

export default {
  name: 'Game',
  components: {
      AvatarModal
  		//SvgMap, CheckboxSvgMap
  	},
  	data() {
  		return {
        showModal: false,
  			//Japan,
        //selectedLocations: []
  		};
  	},
    methods: {
      onModalClose() {
        this.showModal = false;
      },
      goToBattle() {
        this.showModal = true;
      }
    }
}
</script>

<style>
.svg-map {
  width: 100%;

  stroke: #666;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round; }
  .svg-map__location {
    fill: #a1d99b;
    cursor: pointer; }
    .svg-map__location:focus, .svg-map__location:hover {
      fill: #b8e2b3;
      outline: 0; }
    .svg-map__location[aria-checked="true"] {
      fill: #f4bc44; }
</style>
