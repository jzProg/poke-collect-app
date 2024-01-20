import { calculate, Generations, Pokemon, Move } from '@smogon/calc';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const battleMixin = {
  data() {
    return {
      isPvp: true,
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
          // todo pre choose if faint
          break;
         }
         // todo other events
         default: {
          this.message = this.gameState.statesInfo[currentState].message;
         }
        }
      }
    }});
  },
  methods: {
    ...mapMutations([
      'setUserCoins',
      'setCurrentReward',
      'setLoad'
    ]),
    ...mapActions([
      'awardPokemon',
      'awardItems',
      'updateStats',
      'updateXPs',
      'registerToGame',
      'updateGameState',
      'playGameMove'
    ]),
    determineEnemyName () {
      return this.enemy.name;
    },
    getNextState() {
      const currentState = this.gameState.currentState;
      const stateMessage = this.gameState.statesInfo[currentState].message;
      switch(currentState) {
      case 'HOME_DAMAGE_DONE': this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];
                          if (this.gameState.enemyPokemonHP <= 0) this.gameState.homeScore++;
                          return  this.gameState.enemyPokemonHP > 0 ? 'ENEMY_BATTLE' : 'HOME_WINNER';
      case 'ENEMY_DAMAGE_DONE': this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];
                                if (this.gameState.homePokemonHP <= 0) this.gameState.enemyScore++;
                                return  this.gameState.homePokemonHP > 0 ? 'HOME_OPTION' : 'ENEMY_WINNER';
      case 'HOME_WINNER': this.message = this.enemybattlePokemon.name + stateMessage;
                          this.gameState.enemyFaint = true;
                          this.gameState.faintedInfo.totalPokemonFainted++;
                          this.gameState.faintedInfo.xp += this.enemybattlePokemon.base_experience;
                          this.gameState.faintedInfo.level += this.enemybattlePokemon.level;
                          return this.gameState.homeScore === 3 ? 'FINISH' : 'ENEMY_CHOOSE';
      case 'ENEMY_WINNER': this.message = this.homebattlePokemon.name + stateMessage;
                           this.gameState.faintedInfo.totalPokemonFainted++;
                           this.gameState.faintedInfo.xp += this.homebattlePokemon.base_experience;
                           this.gameState.faintedInfo.level += this.homebattlePokemon.level;
                           this.disabled[this.homebattlePokemon.name] = true;
                           this.homebattlePokemon = {}; //faint
                           return this.gameState.enemyScore === 3 ? 'FINISH' : 'HOME_CHOOSE';
      default: this.message = stateMessage;
               return 'END'; //end state
      }
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
      /*  this.gameState.currentAttack = ability.name;
        this.keepTrackOfMoveUsage(ability);
        this.animateAttack(true);
        this.gameState.currentState = this.getNextState(); // attacks with ability -> HOME_DAMAGE_DONE
        const attackerObj = this.prepareBattleObject(this.homebattlePokemon);
        const defenderObj = this.prepareBattleObject(this.enemybattlePokemon);
        this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
        if (this.gameState.currentDamage) this.animateDamage(false);
        this.delayCall(() => {
          this.updateScore();
          if (this.gameState.currentState === 'ENEMY_BATTLE') this.delayCall(this.opponentMoves, 2000);
          else this.announceRoundWinner();
        }); */
      }
    },
   /* opponentMoves() {
       this.gameState.currentAttack = this.choosePCAttack();
       this.animateAttack(false);
       this.gameState.currentState = this.getNextState(); // attacks with ability -> ENEMY_DAMAGE_DONE
       const defenderObj = this.prepareBattleObject(this.homebattlePokemon);
       const attackerObj = this.prepareBattleObject(this.enemybattlePokemon);
       this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
       if (this.gameState.currentDamage) this.animateDamage(true);
       this.delayCall(() => {
         this.updateScore();
         if (this.gameState.currentState === 'ENEMY_WINNER')
               this.announceRoundWinner();
         else {
           this.delayCall(() => {
              this.gameState.currentState = this.getNextState(); // HOME_OPTION -> HOME_BATTLE
           });
         }
       });
    },*/
   /* choosePCAttack() {
      const randomMoveIndex = this.getRandomInt(0, 3);
      return this.enemybattlePokemon.moves[randomMoveIndex].move.name;
    },*/
    updateScore() {
      console.log('updating round score...');
      if (this.gameState.currentState === 'ENEMY_DAMAGE_DONE') {
        if (this.gameState.currentDamage > this.gameState.homePokemonHP) this.gameState.homePokemonHP = 0;
        else this.gameState.homePokemonHP -= this.gameState.currentDamage;
      } else {
        if (this.gameState.currentDamage > this.gameState.enemyPokemonHP) this.gameState.enemyPokemonHP = 0;
        else this.gameState.enemyPokemonHP -= this.gameState.currentDamage;
      }
      this.gameState.currentState = this.getNextState(); // effective -> ENEMY_BATTLE or HOME_WINNER
    },
    announceRoundWinner() {
       this.gameState.currentState = this.getNextState(); // fainted -> FINISH or ENEMY_CHOOSE
       if (this.gameState.currentState === 'FINISH') this.endGame();
       else if (this.gameState.currentState === 'ENEMY_CHOOSE') this.delayCall(this.enemyChoose, 2000);
       else this.delayCall(() => { this.gameState.currentState = this.getNextState(); }); // HOME_CHOOSE -> HOME_BATTLE
    },
    endGame() {
      console.log('game ended...');
      if (this.gameState.homeScore > this.gameState.enemyScore) {
        this.awarding();
      } else {
        this.delayCall(() => {
          this.updateStats({ value: { result: 'loses' }});
          this.gameState.currentState = this.getNextState();
        }); // game finished -> end
      }
    },
    isGameFinished() {
      return this.gameState.currentState === 'ENDED';
    },
    isHomePlayerBattlePhase() {
      return (this.gameState.currentState === 'POKEMON_CHOSED' || this.gameState.currentState === 'ATTACK')
       && Object.keys(this.homebattlePokemon).length
       && this.gameState.currentPlayer === localStorage.getItem('userId');
    },
    isAbilityUsedTooMuch(ability) {
      const pokemonAbilitiesEntries = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (!pokemonAbilitiesEntries) return false;
      const abilityUsageCount = pokemonAbilitiesEntries[ability.move.name];
      return abilityUsageCount && abilityUsageCount >= 4;
    },
    changePokemon() {
      if (this.isHomePlayerBattlePhase()) {
        this.storeHPState();
        this.homebattlePokemon = {};
        this.playGameMove({ gameId: this.$route.params.gameId, gameObject: {
          status: 'POKEMON_CHANGE',
          currentPlayer:  localStorage.getItem('userId'),
          previousPlayer: localStorage.getItem('userId')
       }});
      }
    },
    delayCall(callback, duration) {
      setTimeout(() => {
        callback();
      }, duration || 1000);
    },
    awarding() {
      console.log('about to award...');
      this.updateStats({ value: { result: 'wins' }});
      const existingCoins = this.getUserCoins;
      this.setUserCoins({ value: existingCoins + this.coinsInfo.REWARD_COINS }); // assign reward coins to user
      const rewardTypeIndex = this.getUserPokemon.length ===  this.totalPokemon ? 0 : this.getRandomInt(0, 1); // choose extra reward category (item or pokemon)
      const rewardType = this.gameRewards[rewardTypeIndex].type;
      if (rewardType === this.gameRewards[0].type) {
        console.log('type ITEM reward');
        const itemId = this.getRandomInt(1, 100);
        this.getItem(itemId).then(res => {
          this.awardItem(res, res.name.includes('stone') ? this.prizes.STONE.type : res.name.includes('candy') ? this.prizes.CANDY.type : rewardType, false);
          this.gameState.currentState = this.getNextState(); // game finished -> end
        });
      } else {
        console.log('type POKEMON reward');
        let pokeObj= [];
        let pokeId;
        try {
          pokeId = this.chooseRandomPokemon(1, this.totalPokemon);
        } catch(error) {
          console.log(error);
          this.gameState.currentState = this.getNextState(); // game finished -> end
          return;
        }
        this.getPokemonInfoFromList([ pokeId ], pokeObj).then(() => {
          this.awardPokemon({ list: pokeObj });
          this.setCurrentReward({ type: this.gameRewards[1].type, value: pokeObj });
          if (pokeObj[0].held_items.length) {
             console.log(`has extra item: ${pokeObj[0].held_items[0].item.name}`);
             this.getItem(pokeObj[0].held_items[0].item.name).then(res => {
               this.awardItem(res, res.name.includes('stone') ? this.prizes.STONE.type : res.name.includes('candy') ? this.prizes.CANDY.type : this.gameRewards[0].type, true);
               this.gameState.currentState = this.getNextState(); // game finished -> end
             });
          } else this.gameState.currentState = this.getNextState(); // game finished -> end
        });
      }
    },
    prepareStatsObject() {
      const battleInfo = {
        pokemonNotFainted: 6 - this.gameState.faintedInfo.totalPokemonFainted,
        isWild: 1.5,
        baseXPofFainted: this.gameState.faintedInfo.xp,
        holdingEgg: 1,
        affection: 1,
        LvLofFainted: this.gameState.faintedInfo.level,
        pointPower: 1,
        // LvLofVictorious: 0,
        originalTrainer: 1,
        pastLevel: 1
      };
      const battleXP = this.getBattleExperience(battleInfo);
      for (const poke of this.getHomePokemon) {
        if (!this.gameState.homeUsedAbilitiesCount.hasOwnProperty(poke.name)) { // if not participate
          continue;
        }
        const newXP = (poke.XP || poke.base_experience) + battleXP;
        const stats = {
          image: poke.pokeImage,
          oldXP: poke.XP || poke.base_experience,
          newXP,
          name: poke.name,
        };
        const newLevel = this.getLevelBasedOnXP(poke.growth_rate, newXP);
        let hasLevelUp = false;
        if (newLevel !== poke.level) {
          console.log('level Up!');
          hasLevelUp = true;
          stats.oldLvl = poke.level,
          stats.newLvl = poke.level + 1
        }
        stats.hasLevelUp = hasLevelUp;
        this.pokeStats.push(stats);
      }
      this.updateXPs({ value: this.pokeStats });
    },
    prepareBattleObject(statObj) {
      return  {
          name: statObj.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
          hp: statObj.stats[0].base_stat,
          atk: statObj.stats[1].base_stat,
          def: statObj.stats[2].base_stat,
          spa: statObj.stats[3].base_stat,
          spd: statObj.stats[4].base_stat,
          spe: statObj.stats[5].base_stat,
      };
    },
    awardItem(item, type, isExtra) {
      const itemObj = {};
      itemObj.name = item.name;
      itemObj.image = item.sprites.default;
      itemObj.text = item.effect_entries[0].short_effect;
      itemObj.quantity = 1;
      itemObj.type = type;
      this.awardItems({ list: [itemObj]});
      if (isExtra) {
        this.hasExtra = true;
        this.extraItem = itemObj;
        return;
      }
      this.setCurrentReward({ type: this.gameRewards[0].type, value:  [itemObj]});
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
    calcDamage(attacker, defender, move) {
      const gen = Generations.get(5);
      return calculate(
        gen,
        new Pokemon(gen, attacker.name, { evs: {
          hp: attacker.hp,
          atk: attacker.atk,
          def: attacker.def,
          spa: attacker.spa,
          spd: attacker.spd,
          spe: attacker.spe,
        }}),
        new Pokemon(gen, defender.name, { evs: {
          hp: defender.hp,
          atk: defender.atk,
          def: defender.def,
          spa: defender.spa,
          spd: defender.spd,
          spe: defender.spe,
        }}),
        new Move(gen, move)
      );
    },
    keepTrackOfMoveUsage(ability) {
      let abilityEntry = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (abilityEntry && abilityEntry[ability])
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name][ability]++;
      else {
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] = Object.assign(this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] || {}, { [ability]: 1 });
      }
    },
    storeHPState(isHome) {
      if (isHome) this.gameState.homeHPHistory[this.homebattlePokemon.name] = this.gameState.homePokemonHP;
      else this.gameState.enemyHPHistory[this.enemybattlePokemon.name] = this.gameState.enemyPokemonHP;
    },
    getHPFromHistory(poke, isHome) {
      return isHome? this.gameState.homeHPHistory[poke] : this.gameState.enemyHPHistory[poke];
    },
    onPokemonChoosed(poke) {
      if ((this.gameState.currentState === 'STARTED' || this.gameState.currentState === 'POKEMON_CHOSED' || this.gameState.currentState === 'POKEMON_CHANGE') 
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
  },
  computed: {
    ...mapGetters([
      'getUserCoins',
      'getCurrentReward',
    ]),
  }
};

export default battleMixin;