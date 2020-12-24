<template>
  <Modal :width="'400px'">
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Item Details</h3>
    <div slot = "body">
      <b>{{ info.name }}</b><br>
      <img :src="info.image" class="itemImg row" style="margin-top: 10%"><br>
      <i style="font-size: 90%">{{ info.text }}</i>
      <br>
      <button v-if="isStone" type="button" class="btn btn-primary" :disabled="!evolveCandidates.length" @click.prevent="evolve">Use it!</button>
      <EvolutionOption :pokeList="evolveCandidates"
                 v-if="showEvolve"
                 @evolution="onEvolution"
                 @close="showEvolve = false;"/>
    </div>
    <div slot = "footer" class="text-center">
     <div>
         You have <b>{{ info.quantity }} </b> of this item!
     </div>
    </div>
  </Modal>
</template>

<script>
 import { mapGetters, mapMutations, mapActions } from 'vuex';
 import Modal from './GenericModalStructure.vue';
 import pokemonMixin from '@/common/mixins/pokemonMixin';
 import EvolutionOption from '@/components/modals/EvolutionOption';

 export default {
      name: 'ItemDetails',
      props: ['info', 'isStone'],
      mixins: [ pokemonMixin ],
      components: { Modal, EvolutionOption },
      data() {
        return {
          showEvolve: false,
        };
      },
      created() {
        this.getPokemonToEvolve();
      },
      methods: {
        ...mapActions([
          'evolvePokemon'
        ]),
        ...mapMutations([
          'storeEvolutionData',
          'setCurrentReward',
        ]),
        evolve() {
          this.showEvolve = true;
        },
        onEvolution(pokeId) {
          const poke = this.evolveCandidates.filter(candidate => candidate.id === pokeId)[0];
          this.getNextEvolution(poke).then(res => {
            const evolveTo = this.getNextForm(res.chain, poke.name, this.info.name);
            console.log(`${poke.name} evolves to ${evolveTo}`);
            let pokeObj = [];
            this.getPokemonInfoFromList([ evolveTo ], pokeObj).then(() => {
              this.evolvePokemon({ from: poke, to: pokeObj[0] });
              this.storeEvolutionData({ from: poke.pokeImage, to: pokeObj[0].pokeImage });
              this.setCurrentReward({ type: this.prizes.PACK.type, value:  pokeObj });
              this.$router.push('evolution');
            });
          });
        },
        getPokemonToEvolve() {
          const validEvolutions = this.prizes.STONE.items.filter(item => item.title === this.info.name)[0].evolution;
          this.evolveCandidates = this.getUserPokemon.filter(pokemon => validEvolutions.indexOf(pokemon.name) !== -1);
        },
        close() {
          this.$emit('close');
        },
      },
      computed: {
        ...mapGetters([
          'getUserPokemon',
        ]),
      }
  }
</script>

<style scoped>
  .itemImg{
    width: 70px;
    height: 70px;
  }
</style>
