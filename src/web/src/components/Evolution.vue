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
      // TODO: add animation
      this.pokeImage = this.getEvolutionData.from;
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false;
          setTimeout(() => {
            this.pokeImage = this.getEvolutionData.to;
            this.show = true;
            setTimeout(() => {
              this.toHome();
            }, 1000);
          }, 700);
        }, 500);
      });
    },
    methods: {
      toHome() {
        this.$router.push('reward');
      }
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
