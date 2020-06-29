<template>
  <div>
    <div id = 'pokeListContent' class = "container">
      <div class = "row">
        <component :is="getMode"
              v-for = '(poke,index) in sortedPokeList'
              :key = "index"
              :action-on-click="onPokemonClick"
              :info="poke"
              :copies = "1">
        </component>
      </div>
    </div>
  </div>
</template>

<script>
import Pokemon from './Pokemon.vue';
import PokemonCard from './PokemonCard.vue';

export default {
  name: 'PokemonList',
  props: ['pokeList', 'actionOnClick', 'simpleMode'],
  methods: {
    onPokemonClick(pokeName) {
      if (this.actionOnClick) this.actionOnClick(pokeName);
    },
  },
  computed: {
   sortedPokeList() {
     return this.pokeList.sort((poke1, poke2) => {
       return poke1.order > poke2.order;
     });
   },
   getMode() {
     return this.simpleMode ? Pokemon : PokemonCard;
   }
  }
}
</script>
