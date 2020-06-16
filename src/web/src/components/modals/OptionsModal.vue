<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{ username }}</h3>
    <div slot = "body">
      <img src = "../../assets/profile_default.png"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin-bottom: 10%"><br>
      <h4>Trade Requests: </h4>
      <a style = "float: right"
         v-if = "notifications && notifications.length > 2"
         @click.prevent = "goToPage('notifications')">show more
      </a><br>
      <div  style = "border: 3px solid black; margin: 5%; padding: 5%;"
            :style = "{ color: item.isPositive ? 'green' : 'red' }"
            v-if = "messages && messages.length"
            v-for = "(item, index) in sortedMessages.slice(0, 2)">
        <span style = "color: black"
              id = 'closeMessage'
              @click.prevent = "deleteMessage(item.messageId)">x
        </span><br>
        {{ item.message }}
      </div>
      <a style = "float: right"
         v-if = "messages && messages.length > 2"
         @click.prevent = "goToPage('messages')">show more
      </a><br>
      <EditModal v-if="showEditOptions"
                 @close="showEditOptions = false">
      </EditModal>
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button" class = "btn btn-primary" @click.prevent = "editProfile">Edit Profile</button>
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
    props: ['logout', 'username', 'notifications', 'messages'],
    data() {
      return {
        showEditOptions: false,
      }
    },
    methods: {
      ...mapActions([
          'removeMessage',
      ]),
      deleteMessage(messageId) {
        console.log(messageId);
        this.removeMessage({ messageId: messageId});
      },
      goToPage(page) {
        this.$router.push(`\${page}`);
      },
      editProfile() {
        this.showEditOptions = true;
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      sortedNotifications() {
        return this.notifications ? this.notifications.reverse() : [];
      },
      sortedMessages() {
        return this.messages ? this.messages.reverse() : [];
      }
    }
  }
</script>

<style scoped>
  #closeMessage {
    float:right;
    display:inline-block;
    padding:2px 5px;
    cursor:pointer;
  }
</style>
