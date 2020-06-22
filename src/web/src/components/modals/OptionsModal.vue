<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{ username }}</h3>
    <div slot = "body">
      <img src = "../../assets/profile_default.png"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin: 2%;"><br>
      <EditModal v-if="showEditOptions"
                 @close="showEditOptions = false">
      </EditModal>
      <span>Number of Pokemon: 6 </span><br>
      <span>Number of Coins: 100 </span>
    </div>
    <div slot = "footer" class = "text-center">
      <!--button type = "button" class = "btn btn-primary" @click.prevent = "editProfile">Edit Profile</button-->
      <div style="margin-bottom:2%">Start A new Game <router-link :to="{ name: 'Game', params: {} }">here</router-link></div>
      <button type = "button" class = "btn btn-danger" @click.prevent = "unsub">Unsubscribe</button>
      <button type = "button" class = "btn btn-danger" @click.prevent = "logout">Logout</button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import EditModal from './EditProfileModal.vue';

  export default {
    name: 'OptionsModal',
    components: { Modal, EditModal },
    props: ['logout', 'username'],
    data() {
      return {
        showEditOptions: false,
      }
    },
    methods: {
      goToPage(page) {
        this.$router.push(`\${page}`);
      },
      editProfile() {
        this.showEditOptions = true;
      },
      unsub() {
        // todo implement
      },
      close() {
        this.$emit('close');
      }
    }
  }
</script>
