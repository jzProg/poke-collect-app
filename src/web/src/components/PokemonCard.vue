<template>
  <div id="pokeContainer" :class="styleClass" @click.prevent="onChoose(info.name)">
    <div id='pokeContent' :class="[(!actionOnClick) ? 'noHover' : '']">
      <div :class="['upperPart', (info.is_legendary || info.is_mythical) ? 'legendaryUpper' : '']">
        <div id='copiesSpan' v-show="info.copies > 1">
          x{{ info.copies }}
        </div>
        <div id='nameDiv'>
          #{{ info.id }} - <b>{{ info.name.toUpperCase() }} </b>
        </div>
        <div id='typeDiv' :style="getTypeStyle()">
          {{ info.types[0].type.name }}
        </div>
        <img class="pokeImage"
             id="pokeImg"
             :src="info.pokeImage"
             alt="Pokemon cover">
      </div>
      <div :class="['lowerPart', info.is_legendary ? 'legendaryLow' : info.is_mythical ? 'mythicalLow' : '' ]">
       <div id="statsDiv" class="container">
         <div class="row"
              v-for="(row, ind) in Object.keys(info.stats).length/2"
              :key="ind">
           <div class="col-md-6" v-if="info.stats[ind*2]">
              {{ normalizeStat(info.stats[ind*2].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2].base_stat}}</span>
           </div>
           <div class="col-md-6" v-if="info.stats[ind*2 + 1]">
              {{ normalizeStat(info.stats[ind*2 + 1].stat.name) }} <span :style="getTypeStyle()">{{ info.stats[ind*2 + 1].base_stat}}</span>
           </div>
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
    props: ['info', 'actionOnClick', 'styleClass'],
    methods: {
      onChoose(name) {
        this.actionOnClick(name);
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
    margin-top: 5%;
    cursor: pointer;
  }

  .noHover {
    pointer-events: none;
  }

  .upperPart:hover {
    background-color: yellow;
  }

  #copiesSpan {
    background-color: orange;
    color: white;
    width: 10%;
    float: left;
    padding: 1%;
    border-radius: 50%;
  }
  #statsDiv {
    width: 100%;
    border-style: double;
    border-color: gray;
    padding: 1%;
    margin-top: 1%;
  }
  #statsDiv .row {
    margin-bottom: 1%;
  }

   .mythicalLow #statsDiv {
    border-color: black;
   }

  #close {
    float: right;
    display: inline-block;
    padding: 2px 5px;
    cursor: pointer;
  }
  #close:hover {
    color: red;
  }
  a:hover {
    text-decoration:none;
    cursor:pointer;
  }
  .pokeImage {
    width: 50%;
  }
  .upperPart {
    background-color: white;
    padding: 2%;
  }
  .lowerPart {
    background-color: #282c34;
    color: white;
    padding: 1%;
  }

  .legendaryLow {
    background-color: #b29600;
  }

  .legendaryUpper {
    background-color: #282c34;
    color: white;
  }

  .mythicalLow {
    background-color: gray;
  }
</style>
