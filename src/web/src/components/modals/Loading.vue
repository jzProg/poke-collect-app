<template>
  <div id="loading-container">
    <img src="https://cdn2.iconfinder.com/data/icons/pokemon-flaticons/64/pokeball-people-pokemon-nintendo-video-game-gaming-gartoon-ball-512.png" class="rotate mask" >
  </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style scoped>

img{
  width:150px;
  height:150px;
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  margin:auto;
}

#loading-container{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
.rotate {
  animation: rotation 1s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);

  }
  to {
    transform: rotate(359deg);
  }
}
</style>
