<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Confirm</h3>
    <div slot = "body">
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
