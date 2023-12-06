<template>
 <div>
  <h2 class="text-center"><b>Choose what you want to do!</b></h2>
  <div class="container" style="margin-top:5%">
   <div class="row">
    <div id="store" class="col-md-4" style="cursor:pointer">
      <h3><b>Store</b></h3><br>
      <img src="../assets/store.png" @click.prevent="goToStore()" height="200px" width="200px">
      <h4>Buy Pokemon and items</h4>
    </div>
    <div id="battle" class="col-md-4" style="cursor:pointer">
      <h3><b>Battle Avatar</b></h3><br>
      <img src="../assets/pokemon-avatar.png" @click.prevent="goToBattle()" height="200px" width="200px">
      <h4>Battle popular Pokemon trainers</h4>
    </div>
    <div id="online" class="col-md-4" style="cursor:pointer">
      <h3><b>Online Battle</b></h3><br>
      <img src="../assets/battle-online.png" @click.prevent="goToPvp()" height="200px" width="200px">
      <h4>Battle other users</h4>
    </div>
   </div>
   <div class="row" style="margin-top:5%">
     <div id="find" class="col-md-4" style="opacity:0.5">
       <h3><b>Find Pokemon</b></h3><br>
       <img src="../assets/pokemon-location.png" height="200px" width="200px">
       <h4>Battle random pokemon</h4>
     </div>
     <div id="gym" class="col-md-4" style="opacity:0.5">
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
import AvatarModal from '@/components/modals/AvatarModal';

export default {
  name: 'Game',
  components: {
      AvatarModal
  	},
  	data() {
  		return {
        showModal: false,
  		};
  	},
    methods: {
      onModalClose() {
        this.showModal = false;
      },
      goToBattle() {
        this.showModal = true;
      },
      goToStore() {
        this.$router.push('store');
      },
      goToPvp () {
        this.$router.push('lobby');
      }
    }
}
</script>
