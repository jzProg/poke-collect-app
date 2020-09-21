<template>
  <Modal :width="'400px'">
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Post Game</h3>
    <div slot = "body">
    </div>
    <div slot = "footer" class="text-center">

    </div>
  </Modal>
</template>

<script>

import Modal from './GenericModalStructure.vue';

  export default {
      name: 'PostGame',
      components: { Modal },
      data() {
        return {
        }
      },
      created() {
      },
      methods: {
        close() {
          this.$emit('close');
        },
      },
  }
</script>

<style scoped>

</style>
