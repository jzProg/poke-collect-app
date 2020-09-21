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
                 <img :src = "getImage()"
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
                       <div class="hpDiv">
                         <div class="progDiv":style="getScoreStyle(this.gameState.enemyPokemonHP)"></div>
                       </div>
                     </div>
                     <span class="name">
                       <b>{{ enemybattlePokemon.name }} </b>
                     </span>
                     <span class="level">
                        Lv{{ enemybattlePokemon.base_experience }}
                     </span>
                   </div>
                 </div>
                 <img class="pokemonEnemy col-md-6 col-xs-6" :src="gameState.enemyFaint ? '' : enemybattlePokemon.sprites.front_default" />
               </div>
               <div class="player row" v-if="homebattlePokemon && Object.keys(homebattlePokemon).length">
                 <div class="col-md-6 col-xs-6" style="float:right;width: 30%;">
                   <div class="statBox">
                     <div class="progress">
                       <span class="hpSpan"><b>HP</b></span>
                       <div class="hpDiv">
                         <div class="progDiv" :style="getScoreStyle(this.gameState.homePokemonHP)"></div>
                       </div>
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
                           :class="[gameState.currentState !== 'HOME_BATTLE' || (gameState.homeUsedAbilitiesCount[move.move.name] && gameState.homeUsedAbilitiesCount[move.move.name] >= 4) ? 'disabledbutton' : '']"
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
     <PostGame v-if="gameState.currentState === ''"  @close="goToIndex()"></PostGame>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import pokemonMixin from '@/common/mixins/pokemonMixin';
  import battleMixin from '@/common/mixins/battleLogic';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import PostGame from '@/components/modals/PostGame';
  import Pokemon from './Pokemon.vue';
  import fullscreen from 'vue-fullscreen';
  import Vue from 'vue';

  window.$ = window.jQuery = require('jquery');
  Vue.use(fullscreen);

  export default {
     name: 'Battle',
     mixins: [pokemonMixin, battleMixin, uniqueIdGeneratorMixin],
     components: { Pokemon, PostGame },
     data() {
       return {
          image: '',
          fullscreen: false,
          enemyName: '',
          message: '',
          homePokemon: [],
          enemyPokemon: [],
          disabled: [],
       }
     },
     beforeRouteEnter(to, from, next) {
        next(vm => {
          if (vm.getCurrentOpponentId) next();
          else next('/Game');
        });
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
       goToIndex() {
         this.$router.push('getStarted');
       },
       getScoreStyle(hp) {
         const score = hp;
         const full = this.defaultHP;
         const half = full/2;
         return { 'width': (score*100)/full + '%', 'height': '100%', 'background-color': score < half ?  'orange' : 'green' };
       },
       getImage() {
         return require(`@/assets/profileAvatar/${this.getUserImage}`);
       },
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
       getStarters() {
        this.getPokemonInfoFromList(this.getUserStarters, this.homePokemon);
       },
       getEnemyPokemon() {
         this.getPokemonInfoFromList(this.getEnemyBattlePokemon, this.enemyPokemon);
       },
       animateDamage(isHome) {
         const targetElement = isHome? $('.pokemonHome') : $('.pokemonEnemy');
         targetElement.fadeOut();
         targetElement.fadeIn(1000);
       },
       onPokemonChoosed(poke) {
         if (this.gameState.currentState === 'HOME_OPTION') {
           this.disabled[poke] = true;
           this.getPokemon(poke).then((response) => {
             this.homebattlePokemon = response;
             this.gameState.homeUsedAbilitiesCount = {};
             this.gameState.homePokemonHP = this.defaultHP;
             this.gameState.currentState = this.getNextState();
           });
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
        return this.homePokemon;
      },
      enemybattlePokemon() {
        if (this.gameState.enemyPokemonIndex === -1) return {};
        return this.enemyPokemon[this.gameState.enemyPokemonIndex];
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

#battleMessage {
  font-size: 24px;
  width: 50%;
  float:left;
}

.disabledbutton {
    pointer-events: none;
    opacity: 0.4;
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
