<template>
  <div id = "pokeImageContainer" @click.prevent="onChoose(info.name)" class = "col-md-3">
    <div id = 'pokeContent'>
      <img :class = "'poke' + info.id"
           id = "pokeImg"
           :src = "info.sprites.front_default"
           alt = "Pokemon cover">
    </div>
  </div>
</template>

<script>
import bus from "@/common/eventBus";

  export default {
    name: 'Pokemon',
    props: ['info'],
    methods: {
      onChoose(name) {
        bus.$emit('chosed', name);
      },
    },
  }
</script>

<style scoped>
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
  #pokeImg {
    width: 100%;
    height: 100%;
    margin-bottom: 2%;
  }
</style>
