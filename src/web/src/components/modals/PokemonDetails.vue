<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Pokemon Details</h3>
    <div slot = "body">
<div class="container-sm">
      <img :src="image" >
      {{info.forms[0].name.charAt(0).toUpperCase()+info.forms[0].name.slice(1)}}
  </div>
      <img :src="image" class="pokeImg">
      {{info.color}}

    </div>
  </Modal>
</template>

<script>

import Modal from './GenericModalStructure.vue';
import PokemonCard from '@/components/PokemonCard.vue';
import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
      name: 'PokemonDetails',
      props: ['info'],
      mixins: [pokemonMixin],
      components: { Modal, PokemonCard },
      data() {
        return {
          image: '',
        }
      },
      created() {
        this.image = this.getPokemonImage(this.info.id);
      },
      methods: {

        close() {
          this.$emit('close');
        },

      },
  }
</script>
<style scoped>
.pokeImg{
  width:200px;
  height:200px;
}
</style>
