import { calculate, Generations, Pokemon, Move } from '@smogon/calc';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const battleMixin = {
  data() {
    return {
      isPvp: false,
      homebattlePokemon: {},
      defaultHP: 300,
      gameState: {
        faintedInfo: { totalPokemonFainted: 0, xp: 0, level: 0  },
        homeScore: 0,
        enemyScore: 0,
        homePokemonHP: 300,
        enemyPokemonHP: 300,
        homeHPHistory: {},
        enemyPokemonIndex: 0,
        enemyFaint: false,
        availableEnemyPokemon: [1, 2],
        homeUsedAbilitiesCount: {},
        currentState: 'HOME_CHOOSE',
        currentDamage: 0,
        currentAttack: '',
        statesInfo: {
          'HOME_CHOOSE': { message: 'Choose your battle pokemon!' },
          'HOME_OPTION': { message: 'What should * do?' },
          'HOME_BATTLE': { message: ' used ' },
          'ENEMY_CHOOSE': { message: ' Chosed ' },
          'ENEMY_BATTLE': { message: ' used ' },
          'HOME_DAMAGE_DONE': { message: ['It did nothing...', 'Not very effective...', 'It is super effective!'] },
          'ENEMY_DAMAGE_DONE': { message: ['It did nothing...', 'Not very effective...', 'It is super effective!'] },
          'HOME_WINNER': { message: ' fainted!' },
          'ENEMY_WINNER': { message: ' fainted!' },
          'FINISH': { message: 'Game Finished!'}
        }
      },
    }
  },
  watch: {
    getUserStarters(newValue, oldValue) {
      this.getEnemyPokemon();
    }
 },
  mounted() {
    this.getEnemyPokemon();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.getCurrentOpponentId) next(); 
      else next('/game');
    });
 },
  created() {
    this.setLoad({ value: true });
    this.getAvatarImage();
    this.enemyName = this.determineEnemyName();
    this.gameState.currentState = this.getNextState();
  },
  methods: {
    ...mapMutations([
      'setUserCoins',
      'setCurrentReward',
    ]),
    ...mapActions([
      'awardPokemon',
      'awardItems',
      'updateStats',
      'updateXPs'
    ]),
    determineEnemyName () {
      return this.avatars[this.getCurrentOpponentId].name;
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
      case 'HOME_DAMAGE_DONE': this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];
                          if (this.gameState.enemyPokemonHP <= 0) this.gameState.homeScore++;
                          return  this.gameState.enemyPokemonHP > 0 ? 'ENEMY_BATTLE' : 'HOME_WINNER';
      case 'ENEMY_CHOOSE': this.message = this.enemyName + stateMessage + this.enemybattlePokemon.name;
                          return 'HOME_OPTION';
      case 'ENEMY_BATTLE': this.message = this.enemybattlePokemon.name + stateMessage + this.gameState.currentAttack;
                          return 'ENEMY_DAMAGE_DONE';
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
      if (this.gameState.currentState === 'HOME_BATTLE') {
        this.gameState.currentAttack = ability.name;
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
        });
      }
    },
    enemyChoose() {
      const randomIndex = this.getRandomInt(0, this.gameState.availableEnemyPokemon.length - 1);
      this.gameState.enemyPokemonIndex = this.gameState.availableEnemyPokemon[randomIndex]; // choose next pokemon
      this.gameState.availableEnemyPokemon.splice(randomIndex, 1); // remove from available pokemon
      this.gameState.enemyPokemonHP = this.defaultHP;
      this.gameState.enemyFaint = false;
      this.gameState.currentState = this.getNextState(); // chooses next pokemon -> HOME_OPTION
      if (this.gameState.currentState === 'HOME_OPTION') {
        this.delayCall(() => {
          this.gameState.currentState = this.getNextState(); // HOME_OPTION -> HOME_BATTLE
        });
      }
    },
    opponentMoves() {
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
    },
    choosePCAttack() {
      const randomMoveIndex = this.getRandomInt(0, 3);
      return this.enemybattlePokemon.moves[randomMoveIndex].move.name;
    },
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
      return this.gameState.currentState === 'END';
    },
    isHomePlayerBattlePhase() {
      return this.gameState.currentState === 'HOME_BATTLE';
    },
    isAbilityUsedTooMuch(ability) {
      const pokemonAbilitiesEntries = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (!pokemonAbilitiesEntries) return false;
      const abilityUsageCount = pokemonAbilitiesEntries[ability.move.name];
      return abilityUsageCount && abilityUsageCount >= 4;
    },
    changePokemon() {
      this.storeHPState();
      this.homebattlePokemon = {};
      this.gameState.currentState = 'HOME_CHOOSE';
      this.gameState.currentState = this.getNextState();
    },
    delayCall(callback, duration) {
      setTimeout(() => {
        callback();
      }, duration || 1000);
    },
    awarding() {
      console.log('about to award...');
      this.updateStats({ value: { result: 'wins' }});
      const coinsToBeAdded = this.coinsInfo.REWARD_COINS;
      const rewardTypeIndex = this.getUserPokemon.length ===  this.totalPokemon ? 0 : this.getRandomInt(0, 1); // choose extra reward category (item or pokemon)
      const rewardType = this.gameRewards[rewardTypeIndex].type;
      if (rewardType === this.gameRewards[0].type) {
        console.log('type ITEM reward');
        const itemId = this.getRandomInt(1, 100);
        this.getItem(itemId).then(res => {
          this.awardItem(res, res.name.includes('stone') ? this.prizes.STONE.type : res.name.includes('candy') ? this.prizes.CANDY.type : rewardType, false, coinsToBeAdded);
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
          this.awardPokemon({ list: pokeObj, coinsToBeAdded });
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
          level: statObj.level
      };
    },
    awardItem(item, type, isExtra, coinsToBeAdded = null) {
      const itemObj = {};
      itemObj.name = item.name;
      itemObj.image = item.sprites.default;
      itemObj.text = item.effect_entries[0].short_effect;
      itemObj.quantity = 1;
      itemObj.type = type;
      this.awardItems({ list: [itemObj], coinsToBeAdded });
      if (isExtra) {
        this.hasExtra = true;
        this.extraItem = itemObj;
        return;
      }
      this.setCurrentReward({ type: this.gameRewards[0].type, value:  [itemObj]});
    },
    walkAway() {
      this.updateStats({ value: { result: 'loses' }});
      this.goToIndex();
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
        }, level: attacker.level
        }),
        new Pokemon(gen, defender.name, { evs: {
          hp: defender.hp,
          atk: defender.atk,
          def: defender.def,
          spa: defender.spa,
          spd: defender.spd,
          spe: defender.spe,
        }, level: defender.level
        }),
        new Move(gen, move)
      );
    },
    keepTrackOfMoveUsage(ability) {
      let abilityEntry = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (abilityEntry && abilityEntry[ability.name])
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name][ability.name]++;
      else {
        const abilityName = ability.name;
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] = Object.assign(this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] || {}, { [abilityName]: 1 });
      }
    },
    storeHPState() {
      this.gameState.homeHPHistory[this.homebattlePokemon.name] = this.gameState.homePokemonHP;
    },
    getHPFromHistory(poke) {
      return this.gameState.homeHPHistory[poke];
    },
    onPokemonChoosed(poke) {
      if (this.gameState.currentState === 'HOME_OPTION') {
        this.homebattlePokemon = this.getHomePokemon.filter(starter => starter.name === poke)[0];
        this.gameState.homePokemonHP = this.getHPFromHistory(poke) || this.defaultHP;
        this.gameState.currentState = this.getNextState();
      } else console.log('You cannot choose another pokemon right now!');
    },
    getAvatarImage() {
      this.image = require(`@/assets/${this.avatars[this.getCurrentOpponentId].image}`);
    },
  },
  computed: {
    ...mapGetters([
      'getUserCoins',
      'getCurrentReward',
    ]),
  }
};

export default battleMixin;
