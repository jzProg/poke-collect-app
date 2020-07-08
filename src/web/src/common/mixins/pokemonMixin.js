const Pokedex = require('pokeapi-js-wrapper');
const P = new Pokedex.Pokedex();
import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

const pokemonMixin = {
  data() {
    return {
      totalPokemon: 300, // TODO map by region (?)
      imageAPI: 'https://pokeres.bastionbot.org/images/pokemon/',
      startersInfo: {
        NUM_OF_STARTERS: 3,
        STANDARD_STARTERS: ['bulbasaur', 'squirtle', 'charmander'],
        STARTERS_TYPE: '', // TODO change based on POKE API
      },
      coinsInfo: {
        START_COINS: 100,
      },
      packInfo: {
        NUM_OF_CARDS: 2,
      },
      prizes: {
        COINS: {
          //TODO implement after battle
        },
        PACK: {
          type: 'pack',
          items: [{ title: 'pokemon pack', quantity: 1, price: 50 }],
        },
        ITEM: {
           //TODO implement
        },
        STONE: {
         type: 'stone',
         items: [{ title: 'fire-stone', quantity: 1, price: 480 },
                  { title: 'water-stone', quantity: 1, price: 550 },
                  { title: 'thunder-stone', quantity: 1, price: 650 }],
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
    calcDamage(attacker, defender, move) {
      const gen = Generations.get(5);
      return calculate(
        gen,
        new Pokemon(gen, attacker.name),
        new Pokemon(gen, defender.name),
        new Move(gen, move)
      );
    },
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
      listOfPokemon.forEach((item, i) => {
        this.getPokemon(item).then((response) => {
          this.getPokemonSpecies(item).then((res) => {
            const image = this.getPokemonImage(response.id);
            Object.assign(response, { color: res.color.name, pokeImage: image });
            if (listToFill.filter(e => e.name === response.name).length <= 0)
              listToFill.push(response);
          });
        });
      });
    }
  }
};

export default pokemonMixin;
