import { mapGetters } from 'vuex';
import formulaMixin from '@/common/mixins/formulas';

const Pokedex = require('pokeapi-js-wrapper');
const P = new Pokedex.Pokedex();

const pokemonMixin = {
  mixins: [formulaMixin],
  data() {
    return {
      totalPokemon: 300, // TODO map by region (?)
      imageAPI: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
      startersInfo: {
        NUM_OF_STARTERS: 3,
        STANDARD_STARTERS: ['bulbasaur', 'squirtle', 'charmander'],
      },
      REACHED_LIMIT: 'You reached pokemon limit',
      coinsInfo: {
        START_COINS: 100,
        REWARD_COINS: 200,
      },
      packInfo: {
        NUM_OF_CARDS: 2,
      },
      gameRewards: [
        {
           type: 'item',
        },
        {
          type: 'pokemon',
        }
      ],
      prizes: {
        CANDY: {
          type: 'candy',
          items: [{ title: 'rare-candy', quantity: 1, price: 100 }],
        },
        PACK: {
          type: 'pack',
          items: [{ title: 'pokemon pack', quantity: 1, price: 700 }],
        },
        STONE: {
         type: 'stone',
         text: 'Evolution Stones',
         items: [{ title: 'fire-stone', evolution: ['eevee', 'growlithe', 'pansear', 'vulpix'], quantity: 1, price: 2500 },
                  { title: 'water-stone', evolution: ['eevee', 'lombre', 'panpour', 'poliwhirl', 'shellder', 'staryu'], quantity: 1, price: 2200 },
                  { title: 'moon-stone', evolution: ['clefairy', 'jigglypuff', 'munna', 'nidorina', 'nidorino', 'skitty'], quantity: 1, price: 1800 },
                  { title: 'leaf-stone', evolution: ['exeggcute', 'gloom', 'nuzleaf', 'pansage', 'weepinbell'], quantity: 1, price: 1500 },
                  { title: 'thunder-stone', evolution: ['eelektrik', 'pikachu', 'eelektross', 'eevee'], quantity: 1, price: 2700 }],
        }
      },
      avatars: {
        1: {
          name: 'Ash',
          image: 'avatar-1.png',
          pokemon: {
            0 : [
              'charmander',
              'bulbasaur',
              'squirtle',
              'pikachu',
              'pidgeotto',
              'butterfree'
            ],
            1: [
              'pikachu',
              'kingler',
              'snorlax',
              'charmeleon',
              'totodile',
              'Muk'
            ] ,
            2: [
              'charizard',
              'pikachu',
              'chicorita',
              'pidgeon',
              'primeape',
              'lapras'
            ]
          }
        },
        2: {
          name: 'Brock',
          image: 'avatar-2.png',
          pokemon: {
            0: [
              'zubat',
              'geodude',
              'onix',
              'chansey',
              'mudkip',
              'vulpix'
            ],
            1: [
              'vulpix',
              'geodude',
              'golbat',
              'onix',
              'marshtomp',
              'bonsly'
            ],
            2: [
              'steelix',
              'golbat',
              'geodude',
              'crobat',
              'sudowoodo',
              'ludicolo'
            ]
          }
        },
        3: {
          name: 'Gary',
          image: 'avatar-3.png',
          pokemon: {
            0: [
              'squirtle',
              'eevee',
              'krabby',
              'arcanine',
              'doduo',
              'hoothoot'
            ],
            1: [
              'wartortle',
              'eevee',
              'electivire',
              'nidoking',
              'arcanine',
              'dodrio'
            ],
            2: [
              'blastoise',
              'umbreon',
              'golem',
              'scizor',
              'magmar',
              'nidoqueen'
            ]
          }
        },
        4: {
          name: 'Misty',
          image: 'avatar-4.png',
          pokemon: {
            0: [
              'staryu',
              'psyduck',
              'corsola',
              'horsea',
              'goldeen',
              'poliwag'
            ],
            1: [
              'starmie',
              'goldeen',
              'azurill',
              'poliwhirl',
              'caserin',
              'togepi'
            ],
            2: [
              'gyarados',
              'politoed',
              'togetic',
              'scizor',
              'starmie',
              'golduck'
            ]
          }
        },
        5: {
          name: 'Team Rocket',
          image: 'avatar-5.jpg',
          pokemon: {
            0: [
              'meowth',
              'magikarp',
              'ekans',
              'bellsprout',
              'cacnea',
              'koffing'
            ],
            1: [
              'ditto',
              'wobbuffet',
              'victreebel',
              'growlie',
              'weezing',
              'arbok'
            ],
            2: [
              'gyarados',
              'lickitung',
              'wobbuffet',
              'mimikyu',
              'arbok',
              'weezing'
            ]
          }
        },
      },
    }
  },
  methods: {
    getPokemon(nameOrId) {
      return P.getPokemonByName(nameOrId);
    },
    getPokemonSpecies(nameOrId) {
      return P.getPokemonSpeciesByName(nameOrId);
    },
    getPokemonImage(id) {
      return this.imageAPI + id + '.png';
    },
    getItem(itemName) {
      return P.getItemByName(itemName);
    },
    getPokemonInfoFromList(listOfPokemon, listToFill) {
      while(listToFill.length > 0) {
        listToFill.pop();
      }
      return Promise.all(listOfPokemon.map(this.getPokemon)).then(data => {
        return Promise.all(listOfPokemon.map(this.getPokemonSpecies)).then(data2 => {
           data2.forEach((res, i) => {
             const image = this.getPokemonImage(data[i].id);
             const evolutionChainParts = res.evolution_chain.url.split('/');
             const evolutionChainId = parseInt(evolutionChainParts[evolutionChainParts.length - 2], 10);
             Object.assign(data[i], { color: res.color.name,
                                      pokeImage: image,
                                      description: res.flavor_text_entries[0].flavor_text,
                                      level: this.getLevelBasedOnXP(res.growth_rate.name, data[i].base_experience),
                                      growth_rate: res.growth_rate.name,
                                      copies: 1,
                                      is_legendary: res.is_legendary,
                                      is_mythical: res.is_mythical,
                                      evolutionChainId });
             if (listToFill.filter(e => e.name === data[i].name).length <= 0) {
               const { id, name, stats, height, weight, types, sprites, moves, base_experience, color, pokeImage,
                       description, level, copies, evolutionChainId, is_legendary, is_mythical, held_items, growth_rate } = data[i];
               listToFill.push({ id, name, stats, height, weight, types, level, is_legendary,
                                 evolutionChainId, held_items, is_mythical, copies, growth_rate,
                                 sprites: { back_default: sprites.back_default, front_default: sprites.front_default },
                                 hp: this.calcNewHp(data[i].stats[0].base_stat, level),
                                 moves: { 0: { move: moves[0] ? moves[0].move : ''},
                                          1: { move: moves[1] ? moves[1].move : ''},
                                          2: { move: moves[2] ? moves[2].move : ''},
                                          3: { move: moves[3] ? moves[3].move : ''}},
                                 base_experience, color, pokeImage, description });
             }
           });
        });
      });
    },
    getLevelBasedOnXP(type, baseXP) {
      let xp;
      let resultLevel;
      for (let level = 1; level <= 100; level++) {
        xp = this.getExperienceBasedlevel(type, level);
        if (xp >= baseXP) {
          resultLevel = level;
          break;
        }
      }
      return resultLevel;
    },
    chooseRandomPokemon(min, max) {
      const userPokemon = this.getUserPokemon || [];
      if (userPokemon.length ===  this.totalPokemon) {
        throw this.REACHED_LIMIT;
      }
      let randomId = this.getRandomInt(min, max);
      while(userPokemon.filter(pokemon => pokemon.id === randomId).length) {
        randomId = this.getRandomInt(min, max);
      }
      return randomId;
    },
    getNextEvolution({ evolutionChainId }) {
      return P.getEvolutionChainById(evolutionChainId);
    },
    getNextForm({ species, evolves_to }, name, stoneName) {
      let evolveToByStone;
      if (species.name === name) {
        evolveToByStone = evolves_to.filter(ev => ev.evolution_details[0].item && ev.evolution_details[0].item.name === stoneName)[0];
        return evolveToByStone.species.name;
      }
      evolveToByStone = evolves_to[0];
      return this.getNextForm(evolveToByStone, name, stoneName);
    },
    getNextFormByLevelUp({ species, evolves_to }, name, level) {
      console.log({ species, evolves_to });
      let evolveToByLevelUp;
      if (species.name === name) {
        evolveToByLevelUp = evolves_to.filter(ev => ev.evolution_details[0].trigger && ev.evolution_details[0].trigger.name === 'level-up')[0];
        if (!evolveToByLevelUp) {
          this.evolutionErrorMessage = `${name} doesn't have next form...`;
          return null;
        }
        const { min_level } = evolveToByLevelUp.evolution_details[0];
        if (level < min_level) {
          this.evolutionErrorMessage = `${name} hasn't reached the minimum level (${min_level}) to evolve...`;
          return null;
        }
        return evolveToByLevelUp.species.name;
      }

      if (evolves_to.length === 0) {
        this.evolutionErrorMessage = `${name} doesn't have next form...`;
          return null;
      }

      evolveToByLevelUp = evolves_to[0];
      return this.getNextFormByLevelUp(evolveToByLevelUp, name, level);
    }
  },
  computed: {
    ...mapGetters([
      'getUserPokemon',
    ]),
  }
};

export default pokemonMixin;
