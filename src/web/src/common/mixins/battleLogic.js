import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

const battleMixin = {
  data() {
    return {
      homebattlePokemon: {},
      defaultHP: 300,
      gameState: {
        homeScore: 0,
        enemyScore: 0,
        homePokemonHP: 300,
        enemyPokemonHP: 300,
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
      case 'HOME_DAMAGE_DONE': this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];
                          if (this.gameState.enemyPokemonHP <= 0) this.gameState.homeScore++;
                          return  this.gameState.enemyPokemonHP > 0 ? 'ENEMY_BATTLE' : 'HOME_WINNER';
      case 'ENEMY_CHOOSE': this.message = this.enemyName + stateMessage + this.enemybattlePokemon.name;
                          return 'HOME_OPTION'; // or ENEMY_BATTLE (?)
      case 'ENEMY_BATTLE': this.message = this.enemybattlePokemon.name + stateMessage + this.gameState.currentAttack;
                          return 'ENEMY_DAMAGE_DONE';
      case 'ENEMY_DAMAGE_DONE': this.message = this.gameState.currentDamage === 0 ? stateMessage[0] : this.gameState.currentDamage >= this.defaultHP/10 ? stateMessage[2] : stateMessage[1];
                                if (this.gameState.homePokemonHP <= 0) this.gameState.enemyScore++;
                                return  this.gameState.homePokemonHP > 0 ? 'HOME_OPTION' : 'ENEMY_WINNER';
      case 'HOME_WINNER': this.message = this.enemybattlePokemon.name + stateMessage;
                          this.gameState.enemyFaint = true;
                          return this.gameState.homeScore === 3 ? 'FINISH' : 'ENEMY_CHOOSE';
      case 'ENEMY_WINNER': this.message = this.homebattlePokemon.name + stateMessage;
                           this.homebattlePokemon = {};
                           return this.gameState.enemyScore === 3 ? 'FINISH' : 'HOME_CHOOSE';
      default: this.message = stateMessage;
               return ''; //end state
      }
    },
    attack(ability) {
      if (this.gameState.currentState === 'HOME_BATTLE') {
        this.gameState.currentAttack = ability.name;
        let abilityEntry = this.gameState.homeUsedAbilitiesCount[ability.name];
        if (abilityEntry) this.gameState.homeUsedAbilitiesCount[ability.name]++;
        else this.gameState.homeUsedAbilitiesCount[ability.name] = 1;
        this.gameState.currentState = this.getNextState(); // attacks with ability -> HOME_DAMAGE_DONE
        const attackerObj = this.prepareBattleObject(this.homebattlePokemon);
        const defenderObj = this.prepareBattleObject(this.enemybattlePokemon);
        this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
        this.delayCall(() => {
          // TODO: animate enemy pokemon's damage
          this.animateDamage(false);
          console.log('animating damage...');
          this.updateScore();
          if (this.gameState.currentState === 'ENEMY_BATTLE') this.delayCall(this.opponentMoves);
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
       this.gameState.currentState = this.getNextState(); // attacks with ability -> ENEMY_DAMAGE_DONE
       const defenderObj = this.prepareBattleObject(this.homebattlePokemon);
       const attackerObj = this.prepareBattleObject(this.enemybattlePokemon);
       this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
       this.delayCall(() => {
         // TODO: animate home pokemon's damage
         console.log('animating damage...');
         this.animateDamage(true);
         this.updateScore();
         if (this.gameState.currentState === 'ENEMY_WINNER')
               this.announceRoundWinner(); // TODO: for enemy
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
       else if (this.gameState.currentState === 'ENEMY_CHOOSE') this.delayCall(this.enemyChoose);
       else this.delayCall(() => { this.gameState.currentState = this.getNextState(); }); // HOME_CHOOSE -> HOME_BATTLE
    },
    endGame() {
      console.log('game ended...');
      if (this.gameState.homeScore > this.gameState.enemyScore) this.awarding();
      this.delayCall(() => { this.gameState.currentState = this.getNextState(); }); // game finished -> end
    },
    delayCall(callback) {
      setTimeout(() => {
        callback();
      }, 1000);
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
