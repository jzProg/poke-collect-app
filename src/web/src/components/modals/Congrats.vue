<template>
  <Modal>
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header" class="text-center">All caught</h3>
    <div slot="body">
      <h2>Congratulations! You caught 'em all!</h2><br>
      <div class="text-center">
        <img src="../../assets/crown.png" width="100px" height="100px">
      </div>
      <h4>You managed to collect all <b>{{ total }}</b> Pokemon!</h4>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
    name: 'Congrats',
    props: ['total'],
    components: { Modal },
    methods: {
      close() {
        this.$emit('close');
      },
    },
  }
</script>
