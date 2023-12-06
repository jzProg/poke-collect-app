<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Which Pokemon to replace?</h3>
    <div slot = "body">
      <img v-for="(poke, index) in pokeList"
           :src="poke.pokeImage"
           :class="['pokemonImg', chosenPokemon_id === poke.id ? 'highlighted' : '']"
           @click.prevent="choose(poke.id, poke.name)">
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button"
              class = "btn btn-primary"
              :disabled= "!chosenPokemon_id"
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
        chosenPokemon_id: 0,
        chosenPokemon_name: '',
      }
    },
    methods: {
      ...mapActions([
        'replaceStarter',
      ]),
      choose(pokeId, name) {
        this.chosenPokemon_id = pokeId;
        this.chosenPokemon_name = name;
      },
      change() {
        this.replaceStarter({pokeId: this.chosenPokemon_id, name: this.chosenPokemon_name }).then(() => {
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
    border-radius: 50%;
  }

  .pokemonImg {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
</style>
