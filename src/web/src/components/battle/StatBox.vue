<template>
  <div class="statBox" v-if="battlePokemon && Object.keys(battlePokemon).length">
    <div class="progress">
      <span class="hpSpan">
        <b>HP</b>
      </span>
      <div class="hpDiv">
        <div class="progDiv" :style="getScoreStyle(hp)"/>
      </div>
    </div>
    <span class="name">
      <b>{{ battlePokemon && battlePokemon.name }} </b>
    </span>
    <span class="level">
      Lv{{ battlePokemon && battlePokemon.level }}
    </span>
  </div>
</template>

<script>
  export default {
    props: ['battlePokemon', 'hp', 'defaultHP'],
    methods: {
      getScoreStyle(hp) {
        const score = hp;
        const full = this.defaultHP;
        const half = full/2;
        return { 'width': (score*100)/full + '%', 'height': '100%', 'background-color': score < half ?  'orange' : 'green' };
      },
    }
  }
</script>
