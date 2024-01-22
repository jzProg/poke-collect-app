<template>
  <div :class="[styleClass, 'col-md-12']" v-if="!isHome || (battlePokemon && Object.keys(battlePokemon).length)">
    <div class="statContainer col-md-6 col-xs-6"
         :style="isHome ? 'float: right' : 'float: left'">
      <StatBox :battlePokemon="battlePokemon"
               :hp="hp"
               :defaultHP="defaultHP" />
    </div>
    <div class="col-md-6 col-xs-6"
         v-if="isHome && battlePokemon && Object.keys(battlePokemon).length">
      <img class="pokemonHome"
           :src="battlePokemon.sprites.back_default" />
    </div>
    <div class="col-md-6 col-xs-6"
         v-if="!isHome && battlePokemon && Object.keys(battlePokemon).length"
         v-show="battlePokemon && Object.keys(battlePokemon).length">
       <img class="pokemonEnemy"
            :src="faint ? require('../../assets/faint.png') : battlePokemon && battlePokemon.sprites.front_default" />
    </div>
  </div>
</template>

<script>
  import StatBox from '@/components/battle/StatBox';

  export default {
    props: ['battlePokemon', 'styleClass', 'isHome', 'defaultHP', 'faint', 'hp'],
    components: { StatBox }
  }
</script>
