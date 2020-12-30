<template>
  <Modal :width="'400px'">
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header">Pokemon Details</h3>
    <div slot="body" class="scrollable">
      <b>{{info.name.charAt(0).toUpperCase() + info.name.slice(1)}}</b>
      <div :style="getTypeStyle()">
       {{ info.types[0].type.name }}
      </div>
      <div>lvl<b>{{ info.level }}</b></div>
      <i>{{ info.weight }} kg</i><br>
      <img :src="image" class="pokeImg row" style="margin-top: 10%"><br>
      <i style="font-size: 90%">{{ info.description }}</i>
      <div style="margin-top: 5%">
        <div class="row"
             v-for="(row,ind) in Object.keys(info.stats).length/2"
             :key="ind">
          <div class="col-md-6" v-if="info.stats[ind*2]">
             {{ normalizeStat(info.stats[ind*2].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2].base_stat}}</span>
          </div>
          <div class="col-md-6" v-if="info.stats[ind*2 + 1]">
             {{ normalizeStat(info.stats[ind*2 + 1].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2 + 1].base_stat}}</span>
          </div>
        </div>
      </div>
      <LevelUp v-if="showLevelUp"
              @close="showLevelUp = false"
              @levelUp="onLevelUp"
              :candies="candy"
              :poke="info"/>
    </div>
    <div slot="footer" class="text-center">
      <div class="row"
          style="margin: 0 auto;"
          v-for="(move,index) in Object.keys(info.moves).length/2"
          :key="index"
          v-if="index < 4">
          <div class="col-md-6" :style="getStyle()" v-if="info.moves[index*2]">
              {{ info.moves[index*2].move.name }}
          </div>
          <div class="col-md-6" :style="getStyle()" v-if="info.moves[index*2 + 1]">
              {{ info.moves[index*2 + 1].move.name }}
          </div>
      </div>
      <div class="row" style="margin: 0 auto; margin-top: 1%">
        <button type="button"
                class="btn btn-primary"
                :disabled="!hasCandies()"
                @click.prevent="levelUp()">
                Level Up <i class="fas fa-level-up-alt"></i>
        </button>
        <button type="button"
                class="btn btn-success"
                @click.prevent="evolve()">
                Evolve <i class="fas fa-street-view"></i>
        </button>
      </div>
      <span style="color: red" v-if="evolutionErrorMessage">
        {{ evolutionErrorMessage }}
      </span>
    </div>
  </Modal>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import PokemonCard from '@/components/pokemon/PokemonCard.vue';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import LevelUp from '@/components/modals/LevelUp';

  export default {
      name: 'PokemonDetails',
      props: ['info'],
      mixins: [pokemonMixin],
      components: { Modal, PokemonCard, LevelUp },
      data() {
        return {
          image: '',
          showLevelUp: false,
          evolutionErrorMessage: '',
          candy: {},
        }
      },
      created() {
        this.image = this.getPokemonImage(this.info.id);
      },
      methods: {
        ...mapActions([
          'levelUpPokemon',
          'evolvePokemon',
          'removeItem',
        ]),
        ...mapMutations([
          'setLoad',
          'storeEvolutionData',
          'setCurrentReward',
        ]),
        onLevelUp(quantity) {
          this.levelUpPokemon({ name: this.info.name, quantity }).then(() => {
            this.removeItem({ item: this.prizes.CANDY.items[0].title, quantity }).then(() => {
              this.showLevelUp = false;
            });
          });
        },
        hasCandies() {
          return this.getItems.filter(item => item.type === this.prizes.CANDY.type).length;
        },
        levelUp() {
          this.candy = this.getItems.filter(item => item.type === this.prizes.CANDY.type).slice();
          this.showLevelUp = true;
        },
        evolve() {
          this.setLoad({ value: true });
          this.getNextEvolution(this.info).then(res => {
            const evolveTo = this.getNextFormByLevelUp(res.chain, this.info.name, this.info.level);
            if (!evolveTo) {
              this.setLoad({ value: false });
              return;
            }
            let pokeObj = [];
            this.getPokemonInfoFromList([ evolveTo ], pokeObj).then(() => {
              this.setLoad({ value: false });
              this.evolvePokemon({ from: this.info, to: pokeObj[0] });
              this.storeEvolutionData({ from: this.info.pokeImage, to: pokeObj[0].pokeImage });
              this.setCurrentReward({ type: this.prizes.PACK.type, value:  pokeObj });
              this.$router.push('evolution');
            });
          });
        },
        normalizeStat(stat) {
          return stat.includes('-') ? stat.substring(0, 2).toUpperCase() + stat.substring(stat.indexOf('-')) : stat;
        },
        getTypeStyle() {
          return { 'color' : this.info.color };
        },
        getStyle() {
          return { 'background-color' : 'lightgray',
                   'color' : this.info.color,
                   'border-style' : 'solid',
                   'border-color' : 'white'
                  };
        },
        close() {
          this.$emit('close');
        },
      },
      computed: {
        ...mapGetters([
          'getItems',
        ]),
      }
  }
</script>
<style scoped>
.pokeImg {
  width: 200px;
  height: 200px;
}

@media only screen and (max-width: 980px) {

.scrollable {
  height: 300px;
  overflow-y: auto;
  max-width: 100%;
  overflow-x: hidden;
  word-wrap: break-word;
}
}
</style>
