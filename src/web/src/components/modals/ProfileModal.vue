<template>
  <Modal :width="'400px'">
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header">{{ username }}</h3>
    <div slot="body">
      <img :src="getImage()"
           alt="profile image"
           class="profileImg">
      <br>
      <Confirm v-if="showConfirm"
               @confirm="onConfirm"
               @close="showConfirm = false"/>
      <ChangeAvatar v-if="showChangeAvatar"
                    :choose-action="onChangeAvatar"
                    @confirm="onChangeAvatar"
                    @close="showChangeAvatar = false"/>
      <h3>Lvl <b>{{ getUserLevel }}</b></h3>
      <h4># Pokemon: <b>{{ getUserPokemon.length }}</b>/{{ totalPokemon }}</h4>
      <h4>{{ getUserCoins }} <i class="fas fa-coins" style="color:yellow"></i></h4>
    </div>
    <div slot="footer" class="text-center row">
      <div class="col-md-12" style="padding: 1%">
        <button type="button" class="btn btn-primary" @click.prevent="startNewGame">New Game</button>
        <button type="button" class="btn btn-primary" @click.prevent="changePic">New Avatar</button>
      </div>
      <div class="col-md-12" style="padding: 1%">
        <button type="button" class="btn btn-danger" @click.prevent="unsub">Unsubscribe</button>
        <button type="button" class="btn btn-danger" @click.prevent="logout">Logout</button>
      </div>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Modal from '@/components/modals/GenericModalStructure';
  import Confirm from '@/components/modals/Confirm';
  import ChangeAvatar from '@/components/modals/ChangeAvatar';
  import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
    name: 'ProfileModal',
    mixins: [pokemonMixin],
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
      startNewGame() {
        this.$router.push('Game');
      },
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
        'getUserLevel',
      ]),
    },
  }
</script>

<style scoped>
  .profileImg {
    width: 50%;
    height: 50%;
    border-radius: 50%;
    margin: 2%;
  }
</style>
