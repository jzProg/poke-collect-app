<template>
  <Modal :width="'400px'">
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header">Level Up</h3>
    <div slot="body">
      <h3>How many candies you want to use to level up <b>{{ poke.name }}</b>?</h3>
      <input type="number" min="1" :max="candies[0].quantity" v-model="candy.quantity" size="1" style="margin-bottom:2%"> x
      <img src="../../assets/candy.png" width="50px" height="50px">
    </div>
    <div slot="footer" class="text-center">
     <button type="button" class="btn btn-success" @click.prevent="levelUp">level up</button>
    </div>
  </Modal>
</template>

<script>
 import Modal from './GenericModalStructure.vue';

 export default {
      name: 'LevelUp',
      props: ['candies', 'poke'],
      components: { Modal },
      data() {
        return {
          candy: { quantity: 1 }
        }
      },
      methods: {
        levelUp() {
          this.$emit('levelUp', this.candy.quantity);
        },
        close() {
          this.$emit('close');
        },
      },
  }
</script>
