const Pokedex = require('pokeapi-js-wrapper');
const P = new Pokedex.Pokedex();

const pokemonMixin = {
  data() {
    return {
      totalPokemon: 300,
      imageAPI: 'https://pokeres.bastionbot.org/images/pokemon/',
      startersInfo: {
        NUM_OF_STARTERS: 4,
        STANDARD_STARTERS: ['bulbasaur', 'squirtle', 'charmander'],
        STARTERS_TYPE: '', // todo change based on POKE API
      },
      coinsInfo: {
        START_COINS: 100,
      },
      packInfo: {
        NUM_OF_CARDS: 2,
      },
      prizes: ["COINS", "PACK", "ITEM"],
      items: [], // todo change
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
    getPokemonInfoFromList(listOfPokemon) {
      var pokeList = [];
      listOfPokemon.forEach((item, i) => {
        this.getPokemon(item).then((response) => {
          this.getPokemonSpecies(item).then((res) => {
            const image = this.getPokemonImage(response.id);
            Object.assign(response, { color: res.color.name, pokeImage: image });
            pokeList.push(response);
          });
        });
      });
      return pokeList;
    }
  }
};

export default pokemonMixin;
