# PokeCollectApp

A simple Pokemon web app game written in Vue.js. Users can create account, collect Pokemon & items and battle other trainers.


## Technologies and Tools

- **Webpack**, version 3.6
- **Vue**, version 2.6
- **Firebase**, for data persistence purposes.


## Libraries and APIs

- **PokeAPI** (https://pokeapi.co/), for retrieving the Pokemon data.
- **damage-calc** (https://github.com/smogon/damage-calc), for damage calculation during Pokemon battles.
- All non action Pokemon images are retrieved from https://pokeres.bastionbot.org.

## Setup Instructions

- In the **/web/src/common/firebaseConfigProperties.js** file, include valid firebase config keys.
- cd to */web* folder.
- Run **npm install**
- Build with **npm run build** command
- For *dev server*, run **npm run dev**
