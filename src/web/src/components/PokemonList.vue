<template>
  <div>
    <div id = 'pokeListContent' class = "container">
      <div class = "row">
        <component :is="mode"
              v-for = '(poke,index) in sortedPokeList'
              :key = "index"
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
import bus from "@/common/eventBus";

export default {
  name: 'PokemonList',
  props: ['pokeList', 'actionOnClick', 'simpleMode'],
  components: {
    Pokemon,
  },
  data() {
    return {
      mode: PokemonCard,
    }
  },
  created() {
    this.mode = this.simpleMode ? Pokemon : PokemonCard;
    bus.$on('chosed', (name) => {
      this.onPokemonClick(name);
    });
  },
  methods: {
    onPokemonClick(pokeName) {
      this.actionOnClick(pokeName);
    },
  },
  computed: {
   sortedPokeList() {
     return this.pokeList.sort((poke1, poke2) => {
       return poke1.order > poke2.order;
     });
   },
  }
}
</script>
