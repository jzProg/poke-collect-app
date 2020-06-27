<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Battle</h3>
    <div slot = "body">
      <img src = "../../assets/avatar-1.png"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin: 2%;"><br> <!--TODO: dynamic image -->
      <span> Your opponent is {{ 'Ash' }}!</span><br> <!--TODO: dynamic opponent -->
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button" class = "btn btn-primary" @click.prevent = "goToBattle()">Play</button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Modal from './GenericModalStructure.vue';

  export default {
    name: 'AvatarModal',
    components: { Modal },
    methods: {
      goToBattle() {
        this.$router.push('battle');
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
      ]),
    },
  }
</script>
