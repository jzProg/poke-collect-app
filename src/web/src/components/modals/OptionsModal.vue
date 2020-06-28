<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{ username }}</h3>
    <div slot = "body">
      <img src = "../../assets/profile_default.png"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin: 2%;"><br>
      <Confirm v-if="showConfirm"
                 @confirm="onConfirm"
                 @close="showConfirm = false">
      </Confirm>
      <span># of Pokemon: {{ getUserPokemon.length }} </span><br>
      <span>{{ getUserCoins }} <i class="fas fa-coins" style="color:yellow"></i></span>
    </div>
    <div slot = "footer" class = "text-center">
      <div style="margin-bottom:2%">Start A new Game <router-link :to="{ name: 'Game', params: {} }">here</router-link></div>
      <button type = "button" class = "btn btn-danger" @click.prevent = "unsub">Unsubscribe</button>
      <button type = "button" class = "btn btn-danger" @click.prevent = "logout">Logout</button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import Confirm from './Confirm.vue';

  export default {
    name: 'OptionsModal',
    components: { Modal, Confirm },
    props: ['logout', 'username'],
    data() {
      return {
        showConfirm: false,
      }
    },
    methods: {
      ...mapActions([
        'deleteUser',
      ]),
      goToPage(page) {
        this.$router.push(`\${page}`);
      },
      unsub() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.deleteUser().then(() => {
          this.logout();
        });
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
        'getUserCoins',
      ]),
    },
  }
</script>
