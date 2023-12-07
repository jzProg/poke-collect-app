<template>
<Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">You have a battle invitation!</h3>
    <div slot = "body">
      Player {{ getGameInvitationSender }} wants to battle you
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button"
              class = "btn btn-primary"
              @click.prevent = "acceptInvitation">
              Accept
     </button>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Modal from './GenericModalStructure.vue';

export default {
    name: 'game-invitation',
    components: { Modal },
    data() {
      return {
      }
    },
    methods: {
      ...mapActions([
        'acceptGameInvitation',
      ]),
      acceptInvitation() {
        this.acceptGameInvitation()
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
        ...mapGetters(['getGameInvitationSender'])
    }
  }
</script>