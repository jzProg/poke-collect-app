<template>
  <div id="containerDiv" class="container" style="width:100%">
    <div class="row">
      <!--button type="button" @click.prevent="toggle()">full</button-->
       <div class="battleDiv col-md-12">
         <div class="row" style="background-color:black">
           <fullscreen ref="fullscreen" @change="fullscreenChange" class="col-md-12 col-xs-12">
             <div class="scoreDiv row" style="background-color:darkgray">
               <div class="profileDiv col-md-6 col-xs-6" style="padding:1%">
                 <h4><b>Your Scope: {{ parseInt(gameState.homeScore) }}</b></h4>
                 <img src = "../assets/profile_default.png"
                      alt = "profile image"
                      style = "width:50px; height:50px; border-radius:50px;"/>
               </div>
               <div class="enemyDiv col-md-6 col-xs-6" style="padding:1%">
                 <h4><b>{{ enemyName }} Scope: {{ parseInt(gameState.enemyScore) }}</b></h4>
                 <img :src = "image"
                      v-if="image"
                      alt = "profile image"
                      style = "width:50px; height:50px; border-radius:50px"/>
               </div>
             </div>
             <div class="gameDiv row" id="game">
               <div class="opponent" v-if="enemybattlePokemon && Object.keys(enemybattlePokemon).length">
                 <div class="col-md-6 col-xs-6" style="float:left; width:30%;">
                   <div class="statBox">
                     <div class="progress">
                       <span class="hpSpan"><b>HP</b></span>
                       <div class="hpDiv"></div>
                     </div>
                     <span class="name">
                       <b>{{ enemybattlePokemon.name }} </b>
                     </span>
                     <span class="level">
                        Lv{{ enemybattlePokemon.base_experience }}
                     </span>
                   </div>
                 </div>
                 <img class="pokemonEnemy col-md-6 col-xs-6" :src="enemybattlePokemon.sprites.front_default" />
               </div>
               <div class="player row" v-if="homebattlePokemon && Object.keys(homebattlePokemon).length">
                 <div class="col-md-6 col-xs-6" style="float:right;width: 30%;">
                   <div class="statBox">
                     <div class="progress">
                       <span class="hpSpan"><b>HP</b></span>
                       <div class="hpDiv"></div>
                     </div>
                     <span class="name">
                       <b>{{ homebattlePokemon.name }} </b>
                     </span>
                     <span class="level">
                       Lv{{ homebattlePokemon.base_experience }}
                     </span>
                   </div>
                 </div>
                 <img class="pokemonHome col-md-6 col-xs-6" :src="homebattlePokemon.sprites.back_default" />
               </div>
             </div>
             <div class="messageDiv row">
                 <div id="battleMessage" class="col-md-6 col-xs-6">
                     {{ message }}
                 </div>
                 <div id="options" class="col-md-6 col-xs-6" style="width: 50%;float:right">
                     <div v-for="(move,index) in homebattlePokemon.moves"
                           class="move"
                           :key="index"
                           @click.prevent="attack(move.move)"
                           v-if="Object.keys(homebattlePokemon).length && index < 4">
                            {{ move.move.name }}
                     </div>
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
           </fullscreen>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import Pokemon from './Pokemon.vue';
  import fullscreen from 'vue-fullscreen';
  import Vue from 'vue';
  Vue.use(fullscreen);

  export default {
     name: 'Battle',
     mixins: [pokemonMixin, uniqueIdGeneratorMixin],
     components: {Pokemon},
     data() {
       return {
          image: '',
          fullscreen: false,
          enemyName: '',
          message: '',
          homebattlePokemon: {},
          homePokemon: [],
          enemyPokemon: [],
          disabled: [],
          gameState: {
            homeScore: 0,
            enemyScore: 0,
            homePokemonHP: 100,
            enemyPokemonHP: 100,
            currentState: 'HOME_CHOOSE',
            currentDamage: 0,
            currentAttack: '',
            statesInfo: {
              'HOME_CHOOSE': { message: 'Choose your battle pokemon!' },
              'HOME_OPTION': { message: 'What should * do?' },
              'HOME_BATTLE': { message: ' used ' },
              'ENEMY_CHOOSE': { message: ' Chosed ' },
              'ENEMY_BATTLE': { message: ' used ' },
              'HOME_DAMAGE_DONE': { message: ['It did nothing...', 'Very Effective!'] },
              'ENEMY_DAMAGE_DONE': { message: ['It did nothing...', 'Very Effective!'] },
              'HOME_WINNER': { message: ' fainted!' },
              'ENEMY_WINNER': { message: ' fainted!' },
              'FINISH': { message: 'Game Finished!'}
            }
          },
       }
     },
     watch: {
        getUserStarters(newValue, oldValue) {
          if(this.getUserStarters) this.getStarters();
          if(this.getUserStarters) this.getEnemyPokemon();
        }
     },
     created() {
       this.getAvatarImage();
       this.enemyName = this.avatars[this.getCurrentOpponentId].name;
       this.gameState.currentState = this.getNextState();
     },
     mounted() {
       this.getStarters();
       this.getEnemyPokemon();
     },
     methods: {
       getAvatarImage() {
         this.image = require(`@/assets/${this.avatars[this.getCurrentOpponentId].image}`);
       },
       fullscreenChange() {
         this.fullscreen = !this.fullscreen;
         if (this.fullscreen) document.getElementById('game').style.height = "850px";
         else document.getElementById('game').style.height = "480px";
       },
       toggle () {
        this.$refs['fullscreen'].toggle();
       },
       getNextState() {
         const currentState = this.gameState.currentState;
         const stateMessage = this.gameState.statesInfo[currentState].message;
         switch(currentState) {
         case 'HOME_CHOOSE': this.message = stateMessage;
                             return 'HOME_OPTION';
         case 'HOME_OPTION': this.message = stateMessage.replace('*', this.homebattlePokemon.name);
                             return 'HOME_BATTLE';
         case 'HOME_BATTLE': this.message = this.homebattlePokemon.name + stateMessage + this.gameState.currentAttack;
                             return 'HOME_DAMAGE_DONE';
         case 'HOME_DAMAGE_DONE': this.message = this.gameState.currentDamage > 10 ? stateMessage[1] : stateMessage[0];
                             return  this.gameState.enemyPokemonHP > 0 ? 'ENEMY_BATTLE' : 'HOME_WINNER';
         case 'ENEMY_CHOOSE': this.message = this.enemyName + stateMessage + this.enemybattlePokemon;
                             return 'HOME_OPTION'; // or ENEMY_BATTLE (?)
         case 'ENEMY_BATTLE': this.message = this.enemybattlePokemon.name + stateMessage + this.gameState.currentAttack;
                             return 'ENEMY_DAMAGE_DONE';
         case 'ENEMY_DAMAGE_DONE': this.message = this.gameState.currentDamage > 10 ? stateMessage[1] : stateMessage[0];
                             return  this.gameState.homePokemonHP > 0 ? 'HOME_OPTION' : 'ENEMY_WINNER';
         case 'HOME_WINNER': this.message = this.enemybattlePokemon.name + stateMessage;
                             return this.gameState.homeScore === 3 ? 'FINISH' : 'ENEMY_CHOOSE';
         case 'ENEMY_WINNER': this.message = this.homebattlePokemon.name + stateMessage;
                             return this.gameState.enemyScore === 3 ? 'FINISH' : 'HOME_CHOOSE';
         default: this.message = this.homebattlePokemon.name + stateMessage;
                  return ''; //end state
         }
       },
       getStarters() {
        this.getPokemonInfoFromList(this.getUserStarters, this.homePokemon);
       },
       getEnemyPokemon() {
         this.getPokemonInfoFromList(this.getEnemyBattlePokemon, this.enemyPokemon);
       },
       attack(ability) {
         if (this.gameState.currentState === 'HOME_BATTLE') {
           this.gameState.currentAttack = ability.name;
           this.gameState.currentState = this.getNextState(); // attacks with ability -> HOME_DAMAGE_DONE
           const attackerObj = {
              name: this.homebattlePokemon.species.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
           };
           const defenderObj = {
               name: this.enemybattlePokemon.species.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
           };
           this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0]; // TODO: get random or basedon on logic from damage list
          console.log(this.gameState.currentDamage)
           setTimeout(() => {
             // TODO: animate enemy pokemon's damage
             console.log('animating damage...');
             this.updateScore();
             /* if (this.gameState.currentState === 'ENEMY_BATTLE') this.opponentMoves();
             else this.announceRoundWinner(); // TODO: for home */
           }, 1000);
         }
       },
       enemyChoose() {
         // TODO: implement --> computer chooses next pokemon
         this.gameState.currentState = this.getNextState(); // chooses next pokemon -> HOME_OPTION
       },
       opponentMoves() {
          // TODO: computer move --> computer chooses next random attack
          this.gameState.currentState = this.getNextState(); // attacks with ability -> ENEMY_DAMAGE_DONE
          this.gameState.currentDamage = 10; // TODO: compute damage using API
          // TODO: animate home pokemon's damage
          this.updateScore();
          if (this.gameState.currentState === 'ENEMY_WINNER')
                this.announceRoundWinner(); // TODO: for enemy
       },
       updateScore() {
         console.log('updating round score...');
         if (this.gameState.currentState === 'ENEMY_DAMAGE_DONE') {
           this.gameState.homePokemonHP -= this.gameState.currentDamage;
         } else {
           this.gameState.enemyPokemonHP -= this.gameState.currentDamage;
         }
         this.gameState.currentState = this.getNextState(); // effective -> ENEMY_BATTLE or HOME_WINNER
       },
       announceRoundWinner() {
          // TODO: implement
          this.gameState.currentState = this.getNextState(); // fainted -> FINISH or ENEMY_CHOOSE
          if (this.gameState.currentState === 'FINISH') this.endGame();
          else this.enemyChoose();
       },
       endGame() {
         console.log('game ended...');
         // TODO: implement
         if (this.gameState.homeScore > this.gameState.enemyScore) this.awarding();
         this.gameState.currentState = this.getNextState(); // game finished -> end
       },
       awarding() {
         console.log('about to award...');
         // TODO: implement
       },
       onPokemonChoosed(poke) {
         if (this.gameState.currentState === 'HOME_OPTION') {
           this.disabled[poke] = true;
           this.getPokemon(poke).then((response) => {
             this.homebattlePokemon = response;
             this.gameState.currentState = this.getNextState();
           });
         } else console.log('You cannot choose another pokemon right now!');
       }
    },
    computed: {
      ...mapGetters([
        'getUserStarters',
        'getCurrentOpponentId',
        'getEnemyBattlePokemon'
      ]),
      getHomePokemon()  {
        return this.homePokemon;
      },
      enemybattlePokemon() {
        return this.enemyPokemon[0];
      }
    },
   }
</script>

<style scoped>
.gameDiv {
  background-image: url('../../src/assets/battle_field.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 3px solid black;
  border-radius: 8px 8px 0 0;
  height: 480px;
  width: 70%;
  margin-top: 1%;
  margin-right: 15%;
  margin-left:15%
}

.opponent {
  height: 60%;
}

.player {
  height: 60%;
}

.pokemonEnemy {
  height:150px;
  width:150px;
  float:right;
  margin-top:12%;
  margin-right:15%;
}

.pokemonHome {
  height:180px;
  width:180px;
  float:left;
  margin-left:7%;
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
  margin-right: 15%;
  margin-left:15%
}

.battleDiv {
  width:100%;
  min-height:920px;
  background-color:black;
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
  background-color: green;
}

 .opponent .statBox .progress .hpDiv {
   float:right;
   width: 90%;
   height:100%;
   background-color: green;
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

#battleMessage {
  font-size: 24px;
  width: 50%;
  float:left;
}

@media only screen and (max-width: 992px) {

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
 }

 .opponent .statBox {
   width: 100% !important;
 }

 .player .statBox {
   width: 100% !important;
   margin-top: 30%;
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

 .player {
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
