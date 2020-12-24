<template>
  <div id = "pokeImageContainer" @click.prevent="onChoose(info.name)" class = "col-md-3" :style="getStyle()">
    <div id = 'pokeContent'>
      <img :id = "'poke' + info.id"
           class = "pokeImg"
           :src = "info.pokeImage"
           :class= "classFlag? 'pokeImgForBattle':'pokeImgForCollection'"
           alt = "Pokemon cover">
    </div>

  </div>
</template>

<script>
import bus from "@/common/eventBus";

  export default {
    name: 'Pokemon',
    props: ['info', 'disabled', 'actionOnClick','classFlag'],
    data(){
      return{
        "pokeCollectionClass":true
      }
    },

    methods: {
      onChoose(name) {
       if (!this.disabled) this.actionOnClick(name);
      },
      getStyle() {
        return this.disabled? {opacity: '0.5'} : '';
      }
    },
  }
</script>

<style scoped>
  #pokeImageContainer{
    background:url("http://www.pngall.com/wp-content/uploads/4/Pokemon-Pokeball-Transparent.png");
    background-size: cover;
    width:200px;
    height:200px;
  }
  #pokeContent {
    margin-top: 10%;
    margin-left: 5%;
    margin-right: 5%;
  }
  #pokeContent:hover {
    cursor:pointer;
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
  .pokeImgForCollection {
    height: 100%;
    margin-bottom: 2%;
    width: 125px;
    padding-top: 20px;
  }
  .pokeImgForBattle{
    width: 100%;
    height: 100%;
  }
</style>
