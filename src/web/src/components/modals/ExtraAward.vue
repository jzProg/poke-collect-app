<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Extra Award</h3>
    <div slot = "body">
    <h3>You received an item from your new Pokemon!</h3>
      <div><b>{{ poke }}</b> held a <b>{{ item.name }}!</b></div>
      <img :src="item.image" height="70" width="70">
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';
  import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
      name: 'ExtraAward',
      mixins: [pokemonMixin],
      props: ['poke', 'item'],
      components: { Modal },
      methods: {
        close() {
          this.$emit('close');
        },
      },
  }
</script>
