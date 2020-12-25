<template>
  <div id='pokeListContent' :class="['container', pokeList.length === 1 ? 'centered' : '']">
    <div class="pokeListItem">
      <component
            :is="getMode"
            v-for="(poke, index) in sortedPokeList"
            v-if="index >= page*20 && index < 20*(page + 1)"
            :key="index"
            :styleClass="getStyle()"
            :action-on-click="(actionOnClick) ? onPokemonClick : false"
            :info="poke">
      </component>
    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Pokemon';
import PokemonCard from '@/components/PokemonCard';

export default {
  name: 'PokemonList',
  props: [ 'pokeList', 'actionOnClick', 'simpleMode', 'page' ],
  methods: {
    onPokemonClick(pokeName) {
      this.actionOnClick(pokeName);
    },
    getStyle() {
      let size = 4;
      if (this.pokeList.length === 1) size = 12;
      return [`col-md-${size - 1}`, `col-sm-${size}`];
    }
  },
  computed: {
   sortedPokeList() {
     return this.pokeList.sort((poke1, poke2) => {
       return poke1.id - poke2.id;
     });
   },
   getMode() {
     return this.simpleMode ? Pokemon : PokemonCard;
   }
  }
}
</script>

<style scoped>
  .centered {
    width: 20%;
    margin: 0 auto;
  }

  .pokeListItem {
    margin: 0 auto;
    width: 100%;
  }
</style>
