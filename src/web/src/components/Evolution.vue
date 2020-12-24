<template>
  <div>
   <transition name="evolutionAnimation">
    <img :src="pokeImage" alt="poke" v-show="show" class="pokeImg">
   </transition>
   <br>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';

  export default {
    name: 'Evolution',
    mixins: [ pokemonMixin ],
    data() {
      return {
         pokeImage: '',
         show: true,
      }
    },
    created() {
      this.pokeImage = this.getEvolutionData.from;
      this.$nextTick(() => {
        this.show = false;
        this.delay(this.hideAndChangeImage, 500);
      });
    },
    methods: {
      hideAndChangeImage() {
        this.pokeImage = this.getEvolutionData.to;
        this.delay(this.showAndGoNextPage, 700);
      },
      showAndGoNextPage() {
        this.show = true;
        this.delay(this.toHome, 1000);
      },
      toHome() {
        this.$router.push('reward');
      },
      delay(callback, duration) {
        setTimeout(() => {
          callback();
        }, duration);
      },
    },
    computed: {
      ...mapGetters([
        'getEvolutionData'
      ]),
    },
  }
</script>

<style scoped>
 .pokeImg {
  margin-top: 2%;
  width: 20%;
  height: 20%;
 }

.evolutionAnimation-enter-active {
  animation: bounce-in .5s;
}

.evolutionAnimation-leave-active {
  animation: bounce-in .5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
