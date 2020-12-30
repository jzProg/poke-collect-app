<template>
  <div id="containerDiv" class="container" style="width: 100%">
    <Score :game-state="getState()"/>
    <fullscreen class="row" ref="fullscreen" @change="fullscreenChange">
      <div class="battleDiv col-md-12">
        <div class="row" style="padding: 1%">
          <button id="fullscreenBtn"
                  class="btn btn-primary"
                  type="button"
                  @click.prevent="toggle">
            <i class="fas fa-expand"/>
          </button>
        </div>
        <div class="row" style="background-color:black; height: 100%">
          <div :class="['gameDiv', 'row', (fullscreen) ? 'fullscreen': '']" id="game">
            <BattlePokemon :battlePokemon="enemybattlePokemon"
                           :styleClass="'opponent'"
                           :defaultHP="defaultHP"
                           :hp="gameState.enemyPokemonHP"
                           :faint="gameState.enemyFaint"
                           :isHome="false" />
            <BattlePokemon :battlePokemon="homebattlePokemon"
                           :styleClass="'player'"
                           :hp="gameState.homePokemonHP"
                           :defaultHP="defaultHP"
                           :isHome="true" />
          </div>
          <div :class="['messageDiv', 'row', (fullscreen)? 'fullscreen': '']">
              <div id="battleMessage" class="col-md-6 col-xs-6">
                  {{ message }}
              </div>
              <div id="options" class="col-md-6 col-xs-6" style="width: 50%;float:right">
                  <div v-for="(move,index) in homebattlePokemon.moves"
                        class="move"
                        :key="index"
                        :class="[isAbilityUsedTooMuch(move) ? 'disabledbutton' : '']"
                        @click.prevent="attack(move.move)"
                        v-show="isHomePlayerBattlePhase()"
                        v-if="Object.keys(homebattlePokemon).length && index < 4">
                         {{ move.move.name }}
                  </div>
                  <span style="cursor: pointer; margin: 2%"
                        @click.prevent="onWalkAway()"
                        v-show="isHomePlayerBattlePhase()">
                         walk away <i class="fas fa-walking fa-2x"></i>
                  </span>
                  <span style="cursor: pointer; margin: 2%"
                        @click.prevent="changePokemon()"
                        v-show="isHomePlayerBattlePhase()">
                         pokemon <i class="fas fa-exchange-alt fa-2x"></i>
                  </span>
                  <div class="row">
                    <div v-if="getHomePokemon && !Object.keys(homebattlePokemon).length"
                        v-for="(poke, index) in getHomePokemon":key="index">
                      <div class="startersDiv">
                        <Pokemon :info="poke"
                                 class="col-md-4 col-xs-4"
                                 :classFlag="true"
                                 :action-on-click="onPokemonChoosed"
                                 :disabled="disabled[poke.name]"
                                 id="starter">
                       </Pokemon>
                     </div>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </fullscreen>
    <PostGame v-if="isGameFinished()"
            :has-winner="gameState.homeScore > gameState.enemyScore"
            :stat-update="prepareStatsObject"
            @close="showStats = true"/>
    <Stats v-if="showStats"
           :battle-pokemon="pokeStats"
           @close="hasExtra ? showExtra = true : goToIndex()"/>
    <ExtraAward v-if="showExtra"
             :poke="getCurrentReward.rewardId[0].name"
             :item="extraItem"
             @close="goToIndex()"/>
    <Confirm v-if="showConfirm"
           @confirm="walkAway()"
           @close="showConfirm = false"/>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import battleMixin from '@/common/mixins/battleLogic';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import PostGame from '@/components/modals/PostGame';
  import ExtraAward from '@/components/modals/ExtraAward';
  import Stats from '@/components/modals/Stats';
  import Confirm from '@/components/modals/Confirm';
  import Pokemon from '@/components/Pokemon';
  import BattlePokemon from '@/components/battle/BattlePokemon';
  import Score from '@/components/battle/Score';
  import fullscreen from 'vue-fullscreen';
  import Vue from 'vue';

  Vue.use(fullscreen);

  window.$ = window.jQuery = require('jquery');

  export default {
     name: 'Battle',
     mixins: [pokemonMixin, battleMixin, uniqueIdGeneratorMixin],
     components: { Pokemon, PostGame, ExtraAward, Stats, Confirm, Score, BattlePokemon },
     data() {
       return {
          fullscreen: false,
          image: '',
          hasExtra: false,
          showExtra: false,
          showStats: false,
          showConfirm: false,
          extraItem: {},
          enemyName: '',
          message: '',
          enemyPokemon: [],
          disabled: [],
          pokeStats: []
       }
     },
     beforeRouteEnter(to, from, next) {
        next(vm => {
          if (vm.getCurrentOpponentId) next();
          else next('/game');
        });
     },
     watch: {
        getUserStarters(newValue, oldValue) {
          this.getEnemyPokemon();
        }
     },
     created() {
       this.setLoad({ value: true });
       this.getAvatarImage();
       this.enemyName = this.avatars[this.getCurrentOpponentId].name;
       this.gameState.currentState = this.getNextState();
     },
     mounted() {
       this.getEnemyPokemon();
     },
     methods: {
       getBattlePokemon(isHome) {
         if (isHome) {
           return { ...this.homebattlePokemon, HP: this.gameState.homePokemonHP };
         }
         return { ...this.enemybattlePokemon, HP: this.gameState.enemyPokemonHP };
       },
       getState() {
         return { ...this.gameState, homeImage: this.getImage(), enemyImage: this.image };
       },
       toggle() {
        this.fullscreen = !this.fullscreen;
        this.$refs['fullscreen'].toggle();
      },
      fullscreenChange(fullscreen) {
        this.fullscreen = fullscreen
      },
       ...mapMutations([
         'setLoad'
       ]),
       onWalkAway() {
         this.showConfirm = true;
       },
       getImage() {
         return require(`@/assets/profileAvatar/${this.getUserImage}`);
       },
       getAvatarImage() {
         this.image = require(`@/assets/${this.avatars[this.getCurrentOpponentId].image}`);
       },
       getEnemyPokemon() {
         this.getPokemonInfoFromList(this.getEnemyBattlePokemon, this.enemyPokemon).then(() => {
           this.setLoad({ value: false });
         });
       },
       animateDamage(isHome) {
         const targetElement = isHome ? $('.pokemonHome') : $('.pokemonEnemy');
         targetElement.fadeOut();
         targetElement.fadeIn(1000);
       },
       animateAttack(isHome) {
         let targetElement;
         if(isHome) {
           targetElement = $('.pokemonHome');
           targetElement.css('margin-left', '10%');
           setTimeout(() => {
             targetElement.css('margin-left', '7%');
           }, 1000);
         } else {
           targetElement = $('.pokemonEnemy');
           targetElement.css('margin-right', '4%');
           setTimeout(() => {
             targetElement.css('margin-right', '0%');
           }, 1000);
         }
       },
       onPokemonChoosed(poke) {
         if (this.gameState.currentState === 'HOME_OPTION') {
           this.homebattlePokemon = this.getHomePokemon.filter(starter => starter.name === poke)[0];
           this.gameState.homePokemonHP = this.getHPFromHistory(poke) || this.defaultHP;
           this.gameState.currentState = this.getNextState();
         } else console.log('You cannot choose another pokemon right now!');
       }
    },
    computed: {
      ...mapGetters([
        'getUserStarters',
        'getCurrentOpponentId',
        'getEnemyBattlePokemon',
        'getUserImage',
      ]),
      getHomePokemon()  {
        return this.getUserStarters;
      },
      enemybattlePokemon() {
        if (this.gameState.enemyPokemonIndex === -1) return {};
        return this.enemyPokemon[this.gameState.enemyPokemonIndex];
      }
    },
   }
</script>

<style>
.gameDiv {
  background-image: url('../../../src/assets/battle_field.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 3px solid black;
  border-radius: 8px 8px 0 0;
  height: 480px;
  width: 70%;
  margin: 0 auto;
  margin-top: 1%;
}

.gameDiv.fullscreen {
  margin-top: 3%;
  height: 70% !important;
  width: 100% !important;
}

.messageDiv.fullscreen {
  height: 10% !important;
  width: 100% !important;
}

.opponent {
  height:60%
}

.pokemonEnemy {
  height: 150px;
  width: 150px;
  float: right;
  margin-top: 20%;
}

.statContainer {
  width: 30%;
}

.pokemonHome {
  height: 180px;
  width: 180px;
  float: left;
  margin-left: 7%;
}

.messageDiv {
  padding: 8px;
  background: #333;
  border: 3px solid black;
  border-top: none;
  border-radius: 0 0 8px 8px;
  color: #fff;
  height: 120px;
  width: 70%;
  margin: 0 auto;
}

.battleDiv {
  width:100%;
  height:100%;
  background-color:black;
  padding-bottom: 5%;
}

.player .statBox {
  margin-top:10%;
  width: 70%;
  background-color: darkgray;
  border: 3px solid black;
  border-radius: 8px 8px 8px 8px;
  padding: 1%;
}

.player .statBox .progress {
  width: 100%;
  background-color: black;
  border: 1px solid black;
}

.opponent .statBox {
  margin-left:15%;
  margin-top:5%;
  width: 70%;
  background-color: darkgray;
  border: 3px solid black;
  border-radius: 8px 8px 8px 8px;
  padding: 1%;
}

.opponent .statBox .progress {
  width: 100%;
  background-color: black;
  border: 1px solid black;
}

.player .statBox .progress .hpSpan {
  background-color: darkslategray;
  color: orange;
  width: 10%;
  float:left;
}

.opponent .statBox .progress .hpSpan {
   background-color: darkslategray;
   color: orange;
   width: 10%;
   float:left;
}

.player .statBox .progress .hpDiv {
  float:right;
  width: 90%;
  height:100%;
}

 .opponent .statBox .progress .hpDiv {
   float:right;
   width: 90%;
   height:100%;
}

.move {
  font-size: 24px;
  width: 50%;
  display: inline-block;
  border: 1px solid black;
  cursor:pointer;
}

.move:hover {
  background-color: gray;
}

#starter {
  width:100px;
  height:100px;
  border-radius:50px;
  background-color:white;
  margin-left:2%;
  padding:2%;
  border: 7px solid black;
}

#fullscreenBtn {
  background-color: gray;
  color: black;
}

#battleMessage {
  font-size: 24px;
  width: 50%;
  float:left;
}

.disabledbutton {
    pointer-events: none;
    opacity: 0.4;
}

@media only screen and (max-width: 1200px) {
  .statContainer {
    width: 40% !important;
  }

  .move {
    font-size: 12px !important;
  }

  #battleMessage {
    font-size: 18px !important;
  }

  .statBox .progress .hpSpan {
     width: 25% !important;
  }

  .statBox .progress .hpDiv {
     width: 75% !important;
  }
}

@media only screen and (max-width: 980px) {
 .gameDiv {
   height: 300px;
   margin-top: 20;
   margin-right: 0;
   width: 100%;
 }

 .messageDiv {
   width: 100%;
 }

 .gameDiv.fullscreen {
   height: 300px !important;
   width: 100% !important;
 }

 .messageDiv.fullscreen {
   height: 120px !important;
   width: 100% !important;
 }

 .opponent .statBox {
   width: 100% !important;
 }

 .player .statBox {
   width: 100% !important;
 }

 .statContainer {
   width: 40% !important;
 }

 .statBox .progress .hpSpan {
    width: 25% !important;
 }

 .statBox .progress .hpDiv {
    width: 75% !important;
 }

 .opponent {
   height: 50% !important;
 }

 .pokemonHome {
   height:120px;
   width:120px;
 }

 .pokemonEnemy {
   height:100px;
   width:100px;
 }

 .move {
   font-size: 12px !important;
 }

 #battleMessage {
   font-size: 18px !important;
   width: 100%;
 }

 #starter {
   width:70px !important;
   height:70px !important;
   margin-left: 10%;
 }

 #options {
   width: 100% !important;
 }
}
</style>
