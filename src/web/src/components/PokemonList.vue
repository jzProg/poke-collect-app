<template>
  <div>
    <div id = 'pokeListContent' class = "container">
      <div class = "row">
        <Pokemon v-for = '(poke,index) in sortedPokeList'
              class = "col-md-4"
              :key = "index"
              :info="poke"
              :copies = "1">
        </Pokemon>
      </div>
    </div>
  </div>
</template>

<script>
import Pokemon from './Pokemon.vue';
import bus from "@/common/eventBus";

export default {
  name: 'PokemonList',
  props: ['pokeList', 'actionOnClick'],
  components: {
    Pokemon,
  },
  created() {
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
