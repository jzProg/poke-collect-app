import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

const battleMixin = {
  data() {
    return {
      homebattlePokemon: {},
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
        const attackerObj = {
           name: this.homebattlePokemon.species.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
        };
        const defenderObj = {
            name: this.enemybattlePokemon.species.name, //species name AS IT IS IN THE POKEDEX  [REQUIRED]
        };
        this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0]; // TODO: get random or based on logic from damage list
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
    calcDamage(attacker, defender, move) {
      const gen = Generations.get(5);
      return calculate(
        gen,
        new Pokemon(gen, attacker.name),
        new Pokemon(gen, defender.name),
        new Move(gen, move)
      );
    },
  }
};

export default battleMixin;
