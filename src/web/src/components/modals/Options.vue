<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{selectedPokemon.name}}</h3>
    <div slot = "body">
      <img :src="selectedPokemon.pokeImage" height="100px" width="100px"><br>
      <b>Choose What you want to do!</b>
      <PokemonDetails v-if="seeInfoModal"
                     @close="seeInfoModal=false"
                     :info="selectedPokemon"/>
      <AddToStartersModal v-if="showAddModal"
                         :poke-list="pokeList"
                         @close="showAddModal=false" />
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button"
              class = "btn btn-primary"
              @click.prevent = "showAdd">
              Add to Starters
     </button>
     <button type = "button"
             class = "btn btn-primary"
             @click.prevent = "seeInfo">
             See Info
    </button>
    </div>
  </Modal>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import PokemonDetails from '@/components/modals/PokemonDetails';
  import AddToStartersModal from '@/components/modals/AddToStartersModal';

  export default {
    name: 'Options',
    props: ['pokeList', 'selectedPokemon'],
    components: { Modal, PokemonDetails, AddToStartersModal },
    data() {
      return {
        seeInfoModal: false,
        showAddModal: false,
      }
    },
    methods: {
      ...mapMutations([
        'storePokemonToBeSwitched'
      ]),
      seeInfo() {
        this.seeInfoModal = true;
      },
      showAdd() {
        this.showAddModal = true;
        this.storePokemonToBeSwitched({ value: this.selectedPokemon });
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      ...mapGetters([
        'getUserPokemon',
      ]),
    }
  }
</script>
