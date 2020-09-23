# PokeCollectApp

A simple Pokemon web app game written in Vue.js. Users can create account, chat, collect Pokemon & items and battle popular trainers from anime/games.


## Technologies and Tools

- **Webpack**, version 3.6.
- **Vue**, version 2.6.
- **Firebase**, for user authentication and data persistence.


## Libraries and APIs

- **pokeapi-js-wrapper** (https://github.com/PokeAPI/pokeapi-js-wrapper) for utilizing the **PokeAPI** (https://pokeapi.co/), in order to retrieve the Pokemon data. 
- **damage-calc** (https://github.com/smogon/damage-calc), for damage calculation during Pokemon battles.
- All non action Pokemon images are retrieved from https://pokeres.bastionbot.org.

## Game Features
- **Version 1**
  - On registration, choose starter Pokemon and randomly obtain other 2 starters.
  - Battle avatar trainers and gain game coins, Pokemon and items.
  - Chat with other users.
  - Use game coins to buy Pokemon and items.

## Setup Instructions

- In the **/web/src/common/firebaseConfigProperties.js** file, include valid firebase config keys.
- cd to */web* folder.
- Run **npm install**.
- Build with **npm run build** command.
- For *dev server*, run **npm run dev**.

## Disclaimer

This project is for educational use only. The trademarks belong to The Pokémon Company and Nintendo.
