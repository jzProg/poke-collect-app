import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

const battleMixin = {
  data() {
    return {
      homebattlePokemon: {},
      defaulHP: 300,
      gameState: {
        homeScore: 0,
        enemyScore: 0,
        homePokemonHP: 300,
        enemyPokemonHP: 300,
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
  methods: {
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
    attack(ability) {
      if (this.gameState.currentState === 'HOME_BATTLE') {
        this.gameState.currentAttack = ability.name;
        this.gameState.currentState = this.getNextState(); // attacks with ability -> HOME_DAMAGE_DONE
        const attackerObj = this.prepareBattleObject(this.homebattlePokemon);
        const defenderObj = this.prepareBattleObject(this.enemybattlePokemon);
        console.log(this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack));
        this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
        console.log(this.gameState.currentDamage);
        setTimeout(() => {
          // TODO: animate enemy pokemon's damage
          console.log('animating damage...');
          this.updateScore();
          if (this.gameState.currentState === 'ENEMY_BATTLE') {
            setTimeout(() => {
              this.opponentMoves();
            }, 1000);
          } else this.announceRoundWinner(); // TODO: for home */
        }, 1000);
      }
    },
    enemyChoose() {
      // TODO: implement --> computer chooses next pokemon
      this.gameState.currentState = this.getNextState(); // chooses next pokemon -> HOME_OPTION
    },
    opponentMoves() {
       this.gameState.currentAttack = this.choosePCAttack();
       console.log('current attack: '+ this.gameState.currentAttack);
       this.gameState.currentState = this.getNextState(); // attacks with ability -> ENEMY_DAMAGE_DONE
       const defenderObj = this.prepareBattleObject(this.homebattlePokemon);
       const attackerObj = this.prepareBattleObject(this.enemybattlePokemon);
       console.log(this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack));
       this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
       console.log(this.gameState.currentDamage)
       setTimeout(() => {
         // TODO: animate home pokemon's damage
         console.log('animating damage...');
         this.updateScore();
         if (this.gameState.currentState === 'ENEMY_WINNER')
               this.announceRoundWinner(); // TODO: for enemy
         else this.gameState.currentState = this.getNextState(); // HOME_OPTION -> HOME_BATTLE
       }, 1000);
    },
    choosePCAttack() {
      const randomMoveIndex = this.getRandomInt(0, 3);
      console.log('random index:' + randomMoveIndex);
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
    prepareBattleObject(statObj) {
      return  {
          name: statObj.species.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
          hp: statObj.stats[0].base_stat,
          atk: statObj.stats[1].base_stat,
          def: statObj.stats[2].base_stat,
          spa: statObj.stats[3].base_stat,
          spd: statObj.stats[4].base_stat,
          spe: statObj.stats[5].base_stat,
      };
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
  }
};

export default battleMixin;
