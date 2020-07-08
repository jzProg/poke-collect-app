<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{ username }}</h3>
    <div slot = "body">
      <img :src = "getImage()"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin: 2%;"><br>
      <Confirm v-if="showConfirm"
                 @confirm="onConfirm"
                 @close="showConfirm = false">
      </Confirm>
      <ChangeAvatar v-if="showChangeAvatar"
                 :choose-action="onChangeAvatar"
                 @confirm="onChangeAvatar"
                 @close="showChangeAvatar = false">
      </ChangeAvatar>
      <span># of Pokemon: {{ getUserPokemon.length }} </span><br>
      <span>{{ getUserCoins }} <i class="fas fa-coins" style="color:yellow"></i></span>
    </div>
    <div slot = "footer" class = "text-center">
      <div style="margin-bottom:2%">Start A new Game <router-link :to="{ name: 'Game', params: {} }">here</router-link></div>
      <button style="margin-bottom:2%" type = "button" class = "btn btn-primary" @click.prevent = "changePic">Change Avatar</button>
      <button type = "button" class = "btn btn-danger" @click.prevent = "unsub">Unsubscribe</button>
      <button type = "button" class = "btn btn-danger" @click.prevent = "logout">Logout</button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import Confirm from './Confirm.vue';
  import ChangeAvatar from './ChangeAvatar.vue';

  export default {
    name: 'OptionsModal',
    components: { Modal, Confirm, ChangeAvatar },
    props: ['logout', 'username'],
    data() {
      return {
        showConfirm: false,
        showChangeAvatar: false,
      }
    },
    methods: {
      ...mapActions([
        'deleteUser',
        'changeAvatar',
      ]),
      getImage() {
        return require(`@/assets/profileAvatar/${this.getUserImage}`);
      },
      goToPage(page) {
        this.$router.push(`\${page}`);
      },
      changePic() {
        this.showChangeAvatar = true;
      },
      unsub() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.deleteUser().then(() => {
          this.logout();
        });
      },
      onChangeAvatar(index) {
        this.changeAvatar({image: index});
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
        'getUserCoins',
        'getUserImage',
      ]),
    },
  }
</script>
