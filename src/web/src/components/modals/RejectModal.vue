<template>
  <Modal>
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header">Invitation Rejected</h3>
    <div slot="body">
      <img src="../../assets/sad.png"><br>
    </div>
    <div slot = "footer" class = "text-center">
      <button type="button" class="btn btn-primary" @click.prevent="close">OK</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
    name: 'reject-modal',
    components: { Modal },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>