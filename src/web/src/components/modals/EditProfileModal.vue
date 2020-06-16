<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Edit Profile Info</h3>
    <div slot = "body">
      <button type = "button" @click.prevent = "changeImage">Change Image</button><br>
      <button type = "button" @click.prevent = "otherAction">Other Action</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
      name: 'EditProfileModal',
      components: { Modal },
      methods: {
        changeImage() {
          // todo implement
        },
        otherAction() {
          console.log('do nothing!');
        },
        close() {
          this.$emit('close');
        },
        sendInfo() {
          this.$emit('close', this.choosenBook);
        },
      },
  }
</script>
