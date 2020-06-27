<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Battle</h3>
    <div slot = "body" v-if="image">
      <img :src = "image"
           alt = "profile image"
           style = "width:50%;height:50%;border-radius:50px;margin: 2%;"><br>
      <span> Your opponent is {{ avatars[getCurrentOpponentId].name }}!</span><br>
    </div>
    <div slot = "footer" class = "text-center">
      <button type = "button" class = "btn btn-primary" @click.prevent = "goToBattle()">Play</button>
    </div>
  </Modal>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Modal from './GenericModalStructure.vue';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';

  export default {
    name: 'AvatarModal',
    mixins: [pokemonMixin, uniqueIdGeneratorMixin],
    components: { Modal },
    created() {
      this.calculateOpponentData();
    },
    data() {
      return {
        image: '',
      }
    },
    methods: {
      ...mapMutations([
        'setCurrentOpponentId',
        'setEnemyBattlePokemon'
      ]),
      calculateOpponentData() {
       const opponentId = this.getRandomInt(1, Object.keys(this.avatars).length);
       this.setCurrentOpponentId({ value: opponentId });
       this.getImage();
       var allEnemyPokemon = this.avatars[opponentId].pokemon[0].slice();// TODO: based on level
       const enemyBattlePokemon = [];
       for (var i=0; i< this.startersInfo.NUM_OF_STARTERS; i++) {
          var randomIndex = this.getRandomInt(0, allEnemyPokemon.length - 1);
          enemyBattlePokemon.push(allEnemyPokemon[randomIndex]);
          allEnemyPokemon.splice(randomIndex, 1);
       }
       this.setEnemyBattlePokemon({ value: enemyBattlePokemon });
      },
      getImage() {
        this.image = require(`@/assets/${this.avatars[this.getCurrentOpponentId].image}`);
      },
      goToBattle() {
        this.$router.push('battle');
      },
      close() {
        this.$emit('close');
      }
    },
    computed: {
      ...mapGetters([
        'getCurrentOpponentId',
      ]),
    },
  }
</script>
