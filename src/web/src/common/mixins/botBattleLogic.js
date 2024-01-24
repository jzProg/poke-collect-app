import { mapActions } from 'vuex';
import { delayCall } from '../helpers/utils';

const battleMixin = {
  data() {
    return {
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
    ...mapActions([
      'updateStats'
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
        this.keepTrackOfMoveUsage(ability.name);
        this.animateAttack(true);
        this.gameState.currentState = this.getNextState(); // attacks with ability -> HOME_DAMAGE_DONE
        const attackerObj = this.prepareBattleObject(this.homebattlePokemon);
        const defenderObj = this.prepareBattleObject(this.enemybattlePokemon);
        this.gameState.currentDamage = this.calcDamage(attackerObj, defenderObj, this.gameState.currentAttack).damage[0] || 0;
        if (this.gameState.currentDamage) this.animateDamage(false);
        delayCall(() => {
          this.updateScore();
          if (this.gameState.currentState === 'ENEMY_BATTLE') delayCall(this.opponentMoves, 2000);
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
        delayCall(() => {
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
       delayCall(() => {
         this.updateScore();
         if (this.gameState.currentState === 'ENEMY_WINNER')
               this.announceRoundWinner();
         else {
           delayCall(() => {
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
       else if (this.gameState.currentState === 'ENEMY_CHOOSE') delayCall(this.enemyChoose, 2000);
       else delayCall(() => { this.gameState.currentState = this.getNextState(); }); // HOME_CHOOSE -> HOME_BATTLE
    },
    endGame() {
      console.log('game ended...');
      if (this.gameState.homeScore > this.gameState.enemyScore) {
        this.awarding(() => {
          this.gameState.currentState = this.getNextState(); // game finished -> end
        });
      } else {
        delayCall(() => {
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
    changePokemon() {
      this.storeHPState();
      this.homebattlePokemon = {};
      this.gameState.currentState = 'HOME_CHOOSE';
      this.gameState.currentState = this.getNextState();
    },
    walkAway() {
      this.updateStats({ value: { result: 'loses' }});
      this.goToIndex();
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
  }
};

export default battleMixin;
