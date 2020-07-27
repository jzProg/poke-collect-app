<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">New Conversation</h3>
    <div slot = "body">
      <h4>Add a name for the conversation</h4><br>
      <input type="text" v-model="title">
    </div>
    <div slot = "footer" class="text-center">
      <button type = "button" class="btn btn-primary" @click.prevent = "confirmed" :disabled= "!title">Done</button>
      <button type = "button" class="btn btn-danger" @click.prevent = "cancel">Cancel</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
      name: 'NewConversation',
      components: { Modal },
      data() {
        return {
          title: '',
        }
      },
      methods: {
        confirmed() {
            this.$emit('confirm', this.title);
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
