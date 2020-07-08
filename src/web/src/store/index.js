import Vue from 'vue';
import Vuex from 'vuex';
import uniqueIdGenerator from '../common/helpers/uniqueIdsGenerator';
import firebase from 'firebase';
import bus from "@/common/eventBus";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {
      image: '',
      currentReward: { rewardType: '', rewardId: ''},
      loginUsername: '',
      pokemon: [],
      starters: [],
      coins: 0,
      items: [],
      initialized: false,
      currentOpponentId: 0,
    },
    enemybattlePokemon: [],
    errorLoginMessage: '',
    errorRegisterMessage: '',
    pokemonToBeSwitched: {}
  },
  getters: {
    getItems(state) {
      return state.userInfo.items;
    },
    getUserImage(state) {
      return state.userInfo.image;
    },
    getCurrentOpponentId(state) {
      return state.userInfo.currentOpponentId;
    },
    getErrorRegisterMessage(state) {
      return state.errorRegisterMessage;
    },
    getErrorLoginMessage(state) {
      return state.errorLoginMessage;
    },
    getLoginUsername(state) {
      return state.userInfo.loginUsername;
    },
    getCurrentReward(state) {
      return state.userInfo.currentReward;
    },
    getUserBasicInfo(state) {
      return state.userInfo.initialized;
    },
    getUserPokemon(state) {
      return state.userInfo.pokemon;
    },
    getUserStarters(state) {
      return state.userInfo.starters;
    },
    getUserCoins(state) {
      return state.userInfo.coins;
    },
    getEnemyBattlePokemon(state) {
      return state.enemybattlePokemon;
    },
  },
  mutations: {
    setItems(state, payload) {
      state.userInfo.items = payload.value;
    },
    setUserImage(state, payload) {
      state.userInfo.image = payload.value;
    },
    storePokemonToBeSwitched(state, payload) {
      state.pokemonToBeSwitched = payload.value;
    },
    setEnemyBattlePokemon(state, payload) {
      state.enemybattlePokemon = payload.value;
    },
    setCurrentOpponentId(state, payload) {
      state.userInfo.currentOpponentId = payload.value;
    },
    setUserCoins(state, payload) {
      state.userInfo.coins = payload.value;
    },
    setUserBasicInfo(state, payload) {
      state.userInfo.initialized = payload.value;
    },
    setUserStarters(state, payload) {
      state.userInfo.starters = payload.value;
    },
    setUserPokemon(state, payload) {
      state.userInfo.pokemon = payload.value;
    },
    addNewPokemon(state, payload) {
      console.log(payload.value);
      state.userInfo.pokemon.push(payload.value);
    },
    setCurrentReward(state, payload) {
      state.userInfo.currentReward.rewardType = payload.type;
      state.userInfo.currentReward.rewardId = payload.value;
    },
    setRegisterErrorMessage(state, payload) {
      state.errorRegisterMessage = payload.value;
    },
    setLoginErrorMessage(state, payload) {
      state.errorLoginMessage = payload.value;
    },
    setLoginUsername(state, payload) {
      state.userInfo.loginUsername = payload.value;
    },
  },
  actions: {
    awardPokemon({ commit, state }, payload) {
      var existingPokemon = state.userInfo.pokemon;
      var mergedPokemon = existingPokemon.concat(payload.list);
      var coins = state.userInfo.coins;
      if (payload.coins) coins -= payload.coins;
      commit({ type: 'setUserPokemon', value: mergedPokemon });
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        pokemon: mergedPokemon,
        coins: coins,
      });
    },
    awardItems({ commit, state }, payload) {
      var existingItems = state.userInfo.items;
      var mergedItems = existingItems.concat(payload.list);
      commit({ type: 'setItems', value: mergedItems });
      var coins = state.userInfo.coins;
      if (payload.coins) coins -= payload.coins;
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        coins: coins,
        items: mergedItems,
      });
    },
    purchase({ commit, state, dispatch}, payload) {
      console.log(payload.items);
      var type = payload.type;
      if (type === 'pack') {
        return dispatch('awardPokemon', { list: payload.items[0].items, coins: payload.cost });
      } else {
        var items = payload.items;
        var newItems = [];
        for (var i = 0; i< items.length; i++) {
          newItems.push({ type: type, name: items[i].title, image: items[i].image, quantity: items[i].quantity })
        }
        return dispatch('awardItems', { list: newItems, coins: payload.cost });
      }
    },
    changeAvatar({ commit, state}, payload) {
      const image = `avatar_${payload.image}.png`;
      commit({ type: 'setUserImage', value: image });
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        image: image,
      });
    },
    replaceStarter({ commit, state}, payload) {
      const starterToBeRemoved_id = payload.pokeId;
      const starterToBeRemoved_name = payload.name;
      var index = state.userInfo.starters.indexOf(starterToBeRemoved_id);
      if (index === -1) index = state.userInfo.starters.indexOf(starterToBeRemoved_name);
      const pokemonToBeAddedToStarters = state.pokemonToBeSwitched.id;
      state.userInfo.starters.splice(index, 1, pokemonToBeAddedToStarters);
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        starters: state.userInfo.starters,
      });
    },
    findUserByUsername({ commit, dispatch}, payload) {
      firebase.database().ref('users/').on("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            if (user.username === payload.username) {
              commit({ type: 'setRegisterErrorMessage', value: 'Username exists...Please, enter another one' });
            }
          });
        }});
    },
    storePokemon({ commit, dispatch, state }, payload) { //initial pokemon + basic info set (TODO refactor naming)
       commit({ type: 'setUserPokemon', value: payload.list });
       commit({ type: 'setUserBasicInfo', value: true });
       var id = localStorage.getItem('userId');
       return firebase.database().ref('users/' + id).update({
         pokemon: payload.ids,
         starters: payload.ids,
         coins: payload.coins,
         initialized: state.userInfo.initialized,
       });
    },
    userLogin({ commit }, payload) {
      return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .catch((error) => {
            console.log('login error! Error info: ', error);
            commit({ type: 'setLoginErrorMessage', value: error.message });
      });
    },
    userAuth({ commit }, payload) {
      return firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .catch((error) => {
          console.log('register error! Error info: ', error);
          commit({ type: 'setRegisterErrorMessage', value: error.message });
        });
    },
    createUserProfile({ commit, dispatch }, payload) {
      return firebase.database().ref('users/' + payload.userId).set({
        userId: payload.userId,
        username: payload.username,
        mail: payload.mail,
        pokemon: [],
        items: [],
        image: 'profile_default.png',
        starters: [],
        coins: 0,
        initialized: false,
      });
    },
    deleteUser({ commit, dispatch }) {
      const user = firebase.auth().currentUser;
       const userId = localStorage.getItem('userId');
       firebase.database().ref('users/' + userId).remove().then(() => {
         console.log('DB user deleted succesfully! About to delete auth user as well...');
         user.delete()
          .then(() => {
            console.log('Successfully deleted auth user');
         })
         .catch((error) => {
           console.log('Error deleting auth user:', error);
        });
       }).catch((error) => {
         console.log('Error deleting DB user:', error);
      });
    },
    userLogout({ commit }) {
      return firebase.auth().signOut()
        .then(() => {
          localStorage.setItem('token', '');
          localStorage.setItem('userId', '');
        }).catch((error) => {
          console.log('logout error: ', error);
        });
    },
    storeUsername({ commit }, username) {
      commit({ type: 'setLoginUsername', value: username });
    },
    clearUserData({ commit }) {
      commit({ type: 'setLoginUsername', value: '' });
      commit({ type: 'setUserPokemon', value: []});
      commit({ type: 'setUserBasicInfo', value: false});
    }
  }
});
