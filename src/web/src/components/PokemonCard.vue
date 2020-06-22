<template>
  <div id = "pokeContainer" @click.prevent="onChoose(info.name)" class = "col-md-4">
    <div id = 'pokeContent'>
      <div id = 'copiesSpan' v-show = 'copies >= 2'>
        x{{ copies || 1 }}
      </div>
      <div id = 'nameDiv'>
        #{{info.id}} - <b>{{ info.name.toUpperCase() }} </b>
      </div>
      <div id = 'typeDiv' :style="getTypeStyle()">
        {{ info.types[0].type.name }}
      </div>
      <br>
      <img :class = "'poke' + info.id"
           id = "pokeImg"
           :src = "info.pokeImage"
           alt = "Pokemon cover">
      <div id = "statsDiv"
          class = "container">
        <div class = "row"
             v-for = '(row,ind) in Object.keys(info.stats).length/2'
             :key = "ind">
          <div class = "col-md-6" v-if = "info.stats[ind*2]">
             {{ normalizeStat(info.stats[ind*2].stat.name) }}:<span :style="getTypeStyle()">{{ info.stats[ind*2].base_stat}}</span>
          </div>
          <div class = "col-md-6" v-if = "info.stats[ind*2 + 1]">
             {{ normalizeStat(info.stats[ind*2 + 1].stat.name) }}:<span :style="getTypeStyle()">{{ info.stats[ind*2 + 1].base_stat}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/common/eventBus";

  export default {
    name: 'PokemonCard',
    props: ['info', 'copies'],
    methods: {
      onChoose(name) {
        bus.$emit('chosed', name);
      },
      getTypeStyle() {
        return { color: this.info.color };
      },
      normalizeStat(stat) {
        return stat.includes('-') ? stat.substring(0, 2).toUpperCase() + stat.substring(stat.indexOf('-')) : stat;
      },
    },
  }
</script>

<style scoped>
  #pokeContent {
    border-style: solid;
    min-height: 320px;
    padding: 5%;
    margin-top: 10%;
    margin-left: 5%;
    margin-right: 5%;
  }
  #pokeContent:hover {
    border-color: yellow;
    cursor:pointer;
  }
  #copiesSpan {
    background-color: orange;
    color: white;
    width: 10%;
    float: left;
    border-radius: 40%;
  }
  #statsDiv {
    width: 100%;
    border-style: double;
    margin-top: 5%;
  }
  #statsDiv .row {
    margin-bottom:2%;
  }
  #close {
    float:right;
    display:inline-block;
    padding:2px 5px;
    cursor:pointer;
  }
  #close:hover {
    color: red;
  }
  a:hover {
    text-decoration:none;
    cursor:pointer;
  }
  #pokeImg {
    width: 40%;
    height: 40%;
    margin-bottom: 2%;
  }
</style>
