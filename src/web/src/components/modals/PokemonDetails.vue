<template>
  <Modal :width="'400px'">
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Pokemon Details</h3>
    <div slot = "body">
      <b>{{info.forms[0].name.charAt(0).toUpperCase()+info.forms[0].name.slice(1)}}</b>
      <div :style="getTypeStyle()">
       {{ info.types[0].type.name }}
      </div>
      <i>{{ info.weight }} kg</i><br>
      <img :src="image" class="pokeImg row" style="margin-top: 10%"><br>
      <i style="font-size: 90%">{{ info.description }}</i>
      <div style="margin-top: 5%">
        <div class = "row"
             v-for = "(row,ind) in Object.keys(info.stats).length/2"
             :key = "ind">
          <div class = "col-md-6" v-if = "info.stats[ind*2]">
             {{ normalizeStat(info.stats[ind*2].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2].base_stat}}</span>
          </div>
          <div class = "col-md-6" v-if = "info.stats[ind*2 + 1]">
             {{ normalizeStat(info.stats[ind*2 + 1].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2 + 1].base_stat}}</span>
          </div>
        </div>
      </div>
    </div>
    <div slot = "footer" class="text-center">
     <div :style="getStyle()"
         v-for="(move,index) in info.moves"
         v-if="index < 4">
         {{ move.move.name }}
     </div>
    </div>
  </Modal>
</template>

<script>

import Modal from './GenericModalStructure.vue';
import PokemonCard from '@/components/PokemonCard.vue';
import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
      name: 'PokemonDetails',
      props: ['info'],
      mixins: [pokemonMixin],
      components: { Modal, PokemonCard },
      data() {
        return {
          image: '',
        }
      },
      created() {
        this.image = this.getPokemonImage(this.info.id);
      },
      methods: {
        normalizeStat(stat) {
          return stat.includes('-') ? stat.substring(0, 2).toUpperCase() + stat.substring(stat.indexOf('-')) : stat;
        },
        getTypeStyle() {
          return { 'color' : this.info.color };
        },
        getStyle() {
          return { 'background-color' : 'lightgray', 'color' : this.info.color, 'border-radius' : '2px', 'width' : '50%', 'margin' : '0 auto 2%' };
        },
        close() {
          this.$emit('close');
        },
      },
  }
</script>
<style scoped>
.pokeImg {
  width: 200px;
  height: 200px;
}
</style>
