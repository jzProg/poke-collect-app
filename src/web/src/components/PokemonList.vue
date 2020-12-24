<template>
  <div>
    <div id = 'pokeListContent' :class="['container', pokeList.length === 1 ? 'centered' : '']">
      <div style = "margin: 0 auto; width:100%">
        <component :is="getMode"
              v-for = '(poke,index) in sortedPokeList'
              v-if = "index >= page*20 && index < 20*(page + 1)"
              :key = "index"
              :styleClass="getStyle()"
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
  props: ['pokeList', 'actionOnClick', 'simpleMode', 'page'],
  methods: {
    onPokemonClick(pokeName) {
      if (this.actionOnClick) this.actionOnClick(pokeName);
    },
    getStyle() {
      const size = Math.floor(12/this.pokeList.length);
      return [`col-md-${size - 1}`, `col-sm-${size}`];
    }
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

<style scoped>
  .centered {
    width: 20%;
    margin: 0 auto;
  }
</style>
