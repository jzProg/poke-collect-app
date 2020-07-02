<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Which Pokemon to replace?</h3>
    <div slot = "body">
      <img v-for="(poke, index) in pokeList"
           :src="poke.pokeImage"
           style="cursor:pointer"
           :class="['pokemonImg', chosenPokemon === poke.id ? 'highlighted' : '']"
           @click.prevent="choose(poke.id)">
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button"
              class = "btn btn-primary"
              :disabled= "!chosenPokemon"
              @click.prevent = "change">
              Switch
     </button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Modal from './GenericModalStructure.vue';

  export default {
    name: 'AddToStartersModal',
    props: ['pokeList'],
    components: { Modal },
    data() {
      return {
        chosenPokemon: 0,
      }
    },
    methods: {
      ...mapActions([
        'replaceStarter',
      ]),
      choose(pokeId) {
        this.chosenPokemon = pokeId;
      },
      change() {
        this.replaceStarter({pokeId: this.chosenPokemon}).then(() => {
          this.$emit('close');
        });
      },
      close() {
        this.$emit('close');
      }
    },
  }
</script>

<style scoped>
.highlighted {
  border: 7px solid yellow;
}
.pokemonImg {
  width:100px;
  height:100px;
}
</style>
