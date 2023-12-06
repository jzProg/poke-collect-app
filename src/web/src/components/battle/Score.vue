<template>
  <div class="scoreDiv row">
    <div class="profileDiv col-md-6 col-xs-6" v-if="gameState">
      <h4>
        <b>Your Score: {{ parseInt(gameState.homeScore) }}</b>
      </h4>
      <img :src="gameState.homeImage"
           alt="profile image"
           class="profile" />
    </div>
    <div class="enemyDiv col-md-6 col-xs-6">
      <h4>
        <b>{{ gameState.enemyName }} Score: {{ parseInt(gameState.enemyScore) }}</b>
      </h4>
      <img :src="gameState.enemyImage"
           v-if="gameState.enemyImage"
           class="profile"
           alt="profile image" />
    </div>
  </div>
</template>

<script>
  export default {
    props: ['gameState']
  }
</script>

<style scoped>
  .profile {
    width: 50px;
    height: 50px;
    border-radius: 50px
  }

  #profileDiv {
    padding: 1%;
  }

  #enemyDiv {
    padding: 1%;
  }
</style>
