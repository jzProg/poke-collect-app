import { calculate, Generations, Pokemon, Move } from '@smogon/calc';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const battleHelper = {
  methods: {
    ...mapMutations([
      'setCurrentReward',
      'setUserCoins'
    ]),
    ...mapActions([
       'awardItems',
       'updateStats',
       'updateXPs',
       'awardPokemon'
    ]),
    haveAllMovesUsed() {
      const pokemonAbilitiesEntries = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (!pokemonAbilitiesEntries) return false;
      const notUsed = Object.keys(pokemonAbilitiesEntries).filter(k => pokemonAbilitiesEntries[k] !== 4)
      return !notUsed.length;
    },
    isAbilityUsedTooMuch(ability) {
      const pokemonAbilitiesEntries = this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name];
      if (!pokemonAbilitiesEntries) return false;
      const abilityUsageCount = pokemonAbilitiesEntries[ability.move.name];
      return abilityUsageCount && abilityUsageCount >= 4;
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
          stats.oldLvl = poke.level;
          stats.newLvl = poke.level + 1;
          stats.oldHp = poke.hp;
          stats.newHp = this.calcNewHp(poke.stats[0].base_stat, stats.newLvl);
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
    awarding(callback) {
      console.log('about to award...');
      this.updateStats({ value: { result: 'wins' }});
      const coinsToBeAdded = this.coinsInfo.REWARD_COINS;
      const rewardTypeIndex = this.getUserPokemon.length ===  this.totalPokemon ? 0 : this.getRandomInt(0, 1); // choose extra reward category (item or pokemon)
      const rewardType = this.gameRewards[rewardTypeIndex].type;
      if (rewardType === this.gameRewards[0].type) {
        console.log('type ITEM reward');
        const itemId = this.getRandomInt(1, 100);
        this.getItem(itemId).then(res => {
          this.awardItem(
            res,
            res.name.includes('stone') ? this.prizes.STONE.type : res.name.includes('candy') ? this.prizes.CANDY.type : rewardType,
            false,
            coinsToBeAdded
          );
          callback();
        });
      } else {
        console.log('type POKEMON reward');
        let pokeObj= [];
        let pokeId;
        try {
          pokeId = this.chooseRandomPokemon(1, this.totalPokemon);
        } catch(error) {
          console.log(error);
          callback();
          return;
        }
        this.getPokemonInfoFromList([ pokeId ], pokeObj).then(() => {
          this.awardPokemon({ list: pokeObj, coinsToBeAdded });
          this.setCurrentReward({ type: this.gameRewards[1].type, value: pokeObj });
          if (pokeObj[0].held_items.length) {
            console.log(`has extra item: ${pokeObj[0].held_items[0].item.name}`);
            this.getItem(pokeObj[0].held_items[0].item.name).then(res => {
                this.awardItem(res, res.name.includes('stone') ? this.prizes.STONE.type : res.name.includes('candy') ? this.prizes.CANDY.type : this.gameRewards[0].type, true);
                callback();
            });
          } else {
            callback();
          }
        });
      }
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
      if (abilityEntry && abilityEntry[ability])
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name][ability]++;
      else {
        this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] = Object.assign(this.gameState.homeUsedAbilitiesCount[this.homebattlePokemon.name] || {}, { [ability]: 1 });
      }
    },
    storeHPState(isHome = true) {
      if (isHome) this.gameState.homeHPHistory[this.homebattlePokemon.name] = this.gameState.homePokemonHP;
      else this.gameState.enemyHPHistory[this.enemybattlePokemon.name] = this.gameState.enemyPokemonHP;
    },
    getHPFromHistory(poke, isHome = true) {
      return isHome? this.gameState.homeHPHistory[poke] : this.gameState.enemyHPHistory[poke];
    }
  },
  computed: {
    ...mapGetters([
      'getUserCoins',
      'getCurrentReward'
    ])
  }
};

export default battleHelper;
