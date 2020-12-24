import Vue from 'vue';
import Vuex from 'vuex';
import uniqueIdGenerator from '../common/helpers/uniqueIdsGenerator';
import firebase from 'firebase/app';
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
      chat: {},
    },
    enemybattlePokemon: [],
    errorLoginMessage: '',
    errorRegisterMessage: '',
    pokemonToBeSwitched: {},
    chats: [],
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
    getChat(state) {
      return state.userInfo.chat;
    },
    getAvailableChats(state) {
      return state.chats;
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
    setChat(state, payload) {
      state.userInfo.chat = payload.value;
    },
    setConversations(state, payload) {
      state.chats = payload.value;
    },
    replaceStarterPokemon(state, { value }) {
      const starterToBeRemoved_id = value.pokeId;
      const starterToBeRemoved_name = value.name;
      state.userInfo.starters = state.userInfo.starters.filter(starter => starter.id !== starterToBeRemoved_id && starter.name !== starterToBeRemoved_name);
      const pokemonToBeAddedToStarters = state.pokemonToBeSwitched;
      state.userInfo.starters.push(pokemonToBeAddedToStarters);
    }
  },
  actions: {
    fetchConversations({ commit, state }, payload) {
      firebase.database().ref('chats/').on("value", (chatObject) => {
        if (chatObject.val()) {
          const conversations = [];
          Object.values(chatObject.val()).forEach((chat) => {
            conversations.push({ name: chat.name, id: chat.id });
          });
          commit({ type: 'setConversations', value: conversations });
        }
      });
    },
    initChat({ commit, state }, payload) {
      return firebase.database().ref('chats/' + payload.chatId).set({
        id: payload.chatId,
        name: payload.name,
        messages: [],
      });
    },
    sendMessage({ commit, state }, payload) {
      return firebase.database().ref('chats/' + payload.chatId).child('messages').push(payload.message);
    },
    fetchMessages({ commit, state }, payload) {
      firebase.database().ref('chats/').on("value", (chatObject) => {
        if (chatObject.val()) {
          Object.values(chatObject.val()).forEach((chat) => {
            if (payload.chatId === chat.id) {
              commit({ type: 'setChat', value: chat });
            }
          });
        }});
    },
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
      var existingItems = state.userInfo.items || [];
      for (let itemEntry in payload.list) {
        const indexOfItem = existingItems.map((e) => e.name).indexOf(payload.list[itemEntry].name);
        if (indexOfItem === -1) existingItems.push(payload.list[itemEntry]);
        else {
          existingItems[indexOfItem].quantity += parseInt(payload.list[itemEntry].quantity);
        }
      }
      commit({ type: 'setItems', value: existingItems });
      var coins = state.userInfo.coins;
      if (payload.coins) coins -= payload.coins;
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        coins: coins,
        items: existingItems,
      });
    },
    purchase({ commit, state, dispatch}, payload) {
      var type = payload.type;
      if (type === 'pack') {
        return dispatch('awardPokemon', { list: payload.items[0].items, coins: payload.cost });
      } else {
        var items = payload.items;
        var newItems = [];
        for (var i = 0; i< items.length; i++) {
          newItems.push({ type: type, name: items[i].title, image: items[i].image, quantity: parseInt(items[i].quantity), text: items[i].text })
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
    replaceStarter({ commit, state, dispatch }, payload) {
      commit({ type: 'replaceStarterPokemon', value: payload });
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
    storeInitialUserInfo({ commit, dispatch, state }, payload) {
       commit({ type: 'setUserPokemon', value: payload.list });
       commit({ type: 'setUserBasicInfo', value: true });
       var id = localStorage.getItem('userId');
       return firebase.database().ref('users/' + id).update({
         pokemon: payload.list,
         starters: payload.list,
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
        level: 1,
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
