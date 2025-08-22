<template>
    <Modal :is-important="true">
      <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
      <h3 slot="header">Game Paused</h3>
      <div slot="body">
        <h4>Your opponent isn't playing right now! Please wait...</h4><br>
        <button type="button" class="btn btn-primary" @click.prevent="confirmed">Yes</button>
        <button type="button" class="btn btn-danger" @click.prevent="cancel">Cancel</button>
      </div>
    </Modal>
  </template>
  
  <script>
    import Modal from './GenericModalStructure.vue';
  
    export default {
      name: 'pause-modal',
      components: { Modal },
      methods: {
        confirmed() {
            this.$emit('confirm');
        },
        cancel() {
          this.$emit('close');
        },
        close() {
          this.$emit('close');
        },
      },
    }
  </script>