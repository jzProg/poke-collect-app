<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Confirm</h3>
    <div slot = "body">
      <h4>Are you sure?</h4><br>
      <button type = "button" class="btn btn-primary" @click.prevent = "confirmed">Yes</button>
      <button type = "button" class="btn btn-danger" @click.prevent = "cancel">Cancel</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
      name: 'ConfirmModal',
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
