<template>
  <Modal :width="'400px'">
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Post Game</h3>
    <div slot = "body">
      <h2>{{ hasWinner ? 'You won!' : 'You Lost...'}}</h2><br>
      <img :src="hasWinner ? require('../../assets/happy.png') : require('../../assets/sad.png')">
      <PokemonDetails v-if="seeInfo"
                     @close="seeInfo=false"
                     :info="list[0]"/>
    </div>
    <div slot = "footer" v-if="hasWinner" class="text-center">
      <h3><b>Your Rewards:</b></h3><br>
      <div style="float:left">
        <h3><b>{{ coinsInfo.REWARD_COINS }} </b></h3>
        <i class="fas fa-coins fa-5x" style="color:yellow"></i><br>
      </div>
      <Pokemon :info="list[0]"
               style="float:right"
               id="starter"
               :action-on-click="onPokemonChoice"
               v-if="type === gameRewards[1].type"
               :classFlag="true">
      </Pokemon>
      <div v-if="type === gameRewards[0].type">
        <img :src="list[0].image" height="70" width="70">
        <h3>{{ list[0].name }}</h3>
      </div>
      </div>
  </Modal>
</template>

<script>

import Modal from './GenericModalStructure.vue';
import { mapGetters } from 'vuex';
import pokemonMixin from '@/common/mixins/pokemonMixin';
import Pokemon from '@/components/Pokemon';
import PokemonDetails from '@/components/modals/PokemonDetails';

  export default {
      name: 'PostGame',
      props: ['hasWinner'],
      mixins: [pokemonMixin],
      components: { Modal, Pokemon, PokemonDetails },
      data() {
        return {
          seeInfo: false,
        }
      },
      created(){
        this.type = this.getCurrentReward.rewardType;
        this.list = this.getCurrentReward.rewardId;
      },
      methods: {
        onPokemonChoice() {
          this.seeInfo = true;
        },
        close() {
          this.$emit('close');
        },
      },
      computed: {
        ...mapGetters([
          'getCurrentReward',
        ]),
      },
  }
</script>

<style scoped>
#starter {
  width:100px;
  height:100px;
  border-radius:50px;
  background-color:white;
  margin-left:2%;
  padding:2%;
  border: 7px solid black;
}
</style>
