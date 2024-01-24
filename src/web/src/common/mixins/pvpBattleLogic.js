import { mapMutations, mapActions } from 'vuex';
import { delayCall } from '../helpers/utils';

const battleMixin = {
  data() {
    return {
      homebattlePokemon: {},
      defaultHP: 300,
      enemy: {
        name: '',
        avatarImg: ''
      },
      gameState: {
        faintedInfo: { totalPokemonFainted: 0, xp: 0, level: 0  },
        homeScore: 0,
        enemyScore: 0,
        homePokemonHP: 300,
        enemyPokemonHP: 300,
        homeHPHistory: {},
        enemyHPHistory: {},
        enemyPokemonIndex: -1,
        enemyFaint: false,
        homeUsedAbilitiesCount: {},
        currentState: 'STARTED',
        currentDamage: 0,
        currentAttack: '',
        winnerAwarded: false,
        statesInfo: {
          'HOME_STARTED': { message: 'Choose your battle pokemon!' },
          'ENEMY_STARTED': { message: '* choosing battle pokemon...' },
          'HOME_POKEMON_CHOSED': { message: 'What should * do?' },
          'ATTACK': { message: ' used ' },
          'WALK_AWAY': { message: '* walked away!' },
          'HOME_POKEMON_CHANGE': { message: 'Choose your battle pokemon!' },
          'ENEMY_POKEMON_CHANGE': { message: '* choosing battle pokemon...' },
          'ENEMY_POKEMON_CHOSED': { message: ' Chosed ' },
          'DAMAGE_DONE': { message: ['It did nothing...', 'Not very effective...', 'It is super effective!'] },
          'POKEMON_FAINT': { message: ' fainted!' },
          'ENDED': { message: 'Game Finished!'}
        }
      },
    }
  },
  created() {
    this.setLoad({ value: true });
    this.registerToGame({ gameId: this.$route.params.gameId, eventHandler: (gameObj) => {
      const gameState = gameObj.val();
      if (gameState) {
        console.log(gameState)
        const myId = localStorage.getItem('userId');
        const currentState = gameState.status;
        const currentPlayer = gameState.currentPlayer;
        const previousPlayer = gameState.previousPlayer;
        const isHome = previousPlayer === myId;
        const awayPlayer = myId === gameState.player1.id ? gameState.player2 : gameState.player1;

        this.gameState.currentState = currentState;
        this.gameState.currentPlayer = currentPlayer;
        this.gameState.awayPlayer = awayPlayer.id;
        this.gameState.previousPlayer = previousPlayer;

        switch(currentState) {
         case 'STARTED': {
          this.enemy = {
            name: awayPlayer.name,
            avatarImg: awayPlayer.img
          }
          this.getAvatarImage();
          this.enemyName = this.determineEnemyName();
          this.message = this.message = this.gameState.statesInfo[`${isHome?'HOME':'ENEMY'}_STARTED`].message.replace('*', this.enemyName);
          this.enemyPokemon = awayPlayer.pokemon;
          this.setLoad({ value: false });
          break;
         }
         case 'POKEMON_CHOSED': {
          if (isHome) {
            this.homebattlePokemon = this.getHomePokemon.find(starter => starter.name === gameState.targetPokemon);
            this.gameState.homePokemonHP = this.getHPFromHistory(gameState.targetPokemon, true) || this.defaultHP;
          } else {
            this.gameState.enemyPokemonIndex = this.enemyPokemon.findIndex(poke => poke.name === gameState.targetPokemon);
            this.gameState.enemyPokemonHP = this.getHPFromHistory(gameState.targetPokemon, false) || this.defaultHP;
            this.gameState.enemyFaint = false;
          }

          if ((isHome && this.gameState.enemyPokemonIndex === -1) || (!isHome && !Object.keys(this.homebattlePokemon).length)) { // if only 1 player has battle pokemon
            this.message = this.message = this.gameState.statesInfo[`${!isHome?'HOME':'ENEMY'}_STARTED`].message.replace('*', this.enemyName);
          } else {
            if (isHome) {
              this.message = this.gameState.statesInfo[`HOME_POKEMON_CHOSED`].message.replace('*', gameState.targetPokemon);
            } else {
              this.message = this.enemyName + this.gameState.statesInfo[`ENEMY_POKEMON_CHOSED`].message + gameState.targetPokemon;
            }
          }
          
          break;
         }
         case 'POKEMON_CHANGE': {
          this.message = this.gameState.statesInfo[`${isHome?'HOME':'ENEMY'}_POKEMON_CHANGE`].message.replace('*', this.enemyName);

          if (!isHome) {
            this.storeHPState(false);
          }

          break;
         }
         case 'WALK_AWAY': {
          if (!isHome) this.message = this.gameState.statesInfo[currentState].message.replace('*', this.enemyName);
          this.updateStats({ value: { result: isHome ? 'loses' : 'wins' }}).then(() => {
            if (!isHome) this.showWalkAway = true
            else this.goToIndex();
          });
          break;
         }
         case 'ATTACK': {
          this.gameState.currentAttack = gameState.ability;
          this.gameState.currentDamage = gameState.damage;
          let attacker;
          if (isHome) {
            attacker = this.homebattlePokemon.name;
            this.keepTrackOfMoveUsage(gameState.ability);
            this.animateAttack(true);
            if (gameState.damage) this.animateDamage(false);
          } else {
            attacker = this.enemybattlePokemon.name;
            this.animateAttack(false);
            if (gameState.damage) this.animateDamage(true);
          }
          this.message = attacker + this.gameState.statesInfo[currentState].message + gameState.ability;

          delayCall(() => {
            this.updateScore(isHome);
          });
          
          break;
         }
         case 'DAMAGE_DONE': {
          const stateMessage = this.gameState.statesInfo[currentState].message;
          this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];

          if (!isHome) {
            delayCall(() => {
              this.message = this.gameState.statesInfo[`HOME_POKEMON_CHOSED`].message.replace('*', this.homebattlePokemon.name);
            });
          }

          break;
         }
         case 'POKEMON_FAINT': {
          this.message = gameState.targetPokemon + this.gameState.statesInfo[currentState].message;
          this.gameState.faintedInfo.totalPokemonFainted++;
          this.gameState.faintedInfo.xp += isHome ? this.enemybattlePokemon.base_experience : this.homebattlePokemon.base_experience;
          this.gameState.faintedInfo.level += isHome ? this.enemybattlePokemon.level : this.homebattlePokemon.level;

          if (isHome) { 
            this.gameState.homeScore++;
            this.gameState.enemyFaint = true;
            this.checkForFinish();
           }
          else {
            this.gameState.enemyScore++;
            this.disabled[this.homebattlePokemon.name] = true;
            this.homebattlePokemon = {}; //faint

            delayCall(() => {
              this.message = this.gameState.statesInfo[`HOME_STARTED`].message;
            });
          }
          
          break;
         }
         case 'ENDED': {
          this.message = this.gameState.statesInfo[currentState].message;
          this.endGame();
         }
         default: {
          this.message = this.gameState.statesInfo[currentState].message;
         }
        }
      }
    }});
  },
  methods: {
    ...mapMutations([
      'setLoad'
    ]),
    ...mapActions([
      'updateStats',
      'registerToGame',
      'updateGameState',
      'playGameMove'
    ]),
    checkForFinish() {
      if (this.gameState.homeScore === 3) {
        this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
          status: 'ENDED',
          currentPlayer:  null,
          previousPlayer: localStorage.getItem('userId')
       }});
      }
    },
    determineEnemyName () {
      return this.enemy.name;
    },
    attack(ability) {
      if (this.isHomePlayerBattlePhase()) {
        const attackerObj = this.prepareBattleObject(this.homebattlePokemon);
        const defenderObj = this.prepareBattleObject(this.enemybattlePokemon);
        const currentDamage = this.calcDamage(attackerObj, defenderObj, ability.name).damage[0] || 0;

        this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
          status: 'ATTACK',
          previousPlayer: localStorage.getItem('userId'),
          currentPlayer: this.gameState.awayPlayer,
          ability: ability.name,
          damage: currentDamage        
       }});
      }
    },
    updateScore(isHomeAttack) {
      console.log('updating round score...');
      if (!isHomeAttack) {
        if (this.gameState.currentDamage > this.gameState.homePokemonHP) this.gameState.homePokemonHP = 0;
        else this.gameState.homePokemonHP -= this.gameState.currentDamage;
      } else {
        if (this.gameState.currentDamage > this.gameState.enemyPokemonHP) this.gameState.enemyPokemonHP = 0;
        else this.gameState.enemyPokemonHP -= this.gameState.currentDamage;
      }
      if (isHomeAttack) {
        if (this.gameState.enemyPokemonHP <= 0) { // faint
          this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
            status: 'POKEMON_FAINT',
            currentPlayer:  this.gameState.awayPlayer,
            previousPlayer: localStorage.getItem('userId'),
            targetPokemon: this.enemybattlePokemon.name
         }});
        } else {
          this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
            status: 'DAMAGE_DONE',
            currentPlayer:  this.gameState.awayPlayer,
            previousPlayer: localStorage.getItem('userId'),
            targetPokemon: this.enemybattlePokemon.name
         }});
        }
      }
    },
    endGame() {
      console.log('game ended...');
      if (this.gameState.homeScore > this.gameState.enemyScore) {
        this.awarding(() => this.winnerAwarded = true);
      } else {
        this.updateStats({ value: { result: 'loses' }}).then(() => this.winnerAwarded = true);
      }
    },
    isGameFinished() {
      return this.gameState.currentState === 'ENDED' && this.winnerAwarded;
    },
    isHomePlayerBattlePhase() {
      return (this.gameState.currentState === 'POKEMON_CHOSED' || this.gameState.currentState === 'DAMAGE_DONE')
       && Object.keys(this.homebattlePokemon).length
       && this.gameState.currentPlayer === localStorage.getItem('userId');
    },
    changePokemon() {
      if (this.isHomePlayerBattlePhase()) {
        this.storeHPState(true);
        const pokemonToBeReplaced = this.homebattlePokemon.name;
        this.homebattlePokemon = {};
        this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
          status: 'POKEMON_CHANGE',
          currentPlayer:  localStorage.getItem('userId'),
          previousPlayer: localStorage.getItem('userId'),
          targetPokemon: pokemonToBeReplaced
       }});
      }
    },
    walkAway() {
      if (this.gameState.currentPlayer === localStorage.getItem('userId')) {
            this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
              status: 'WALK_AWAY',
              currentPlayer:  null,
              previousPlayer: localStorage.getItem('userId')
           }});
      }
    },
    onPokemonChoosed(poke) {
      if ((this.gameState.currentState === 'STARTED' || this.gameState.currentState === 'POKEMON_CHOSED' || this.gameState.currentState === 'POKEMON_CHANGE' || this.gameState.currentState === 'POKEMON_FAINT') 
           && this.gameState.currentPlayer === localStorage.getItem('userId')) {
        this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
           status: 'POKEMON_CHOSED',
           currentPlayer:  this.gameState.enemyPokemonIndex !== -1 ? localStorage.getItem('userId') : this.gameState.awayPlayer,
           previousPlayer: localStorage.getItem('userId'),
           targetPokemon: poke
        }});
      } else console.log('You cannot choose another pokemon right now!');
    },
    getAvatarImage() {
      this.image = require(`@/assets/profileAvatar/${this.enemy.avatarImg}`);
    }
  }
};

export default battleMixin;
