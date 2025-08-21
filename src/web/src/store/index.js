import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '../router';

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
      level: 1,
      items: [],
      initialized: false,
      currentOpponentId: 0,
      chat: {},
      wins: 0,
      loses: 0,
      seenCongrats: false,
      seeInvitation: false,
      invitationGameId: null,
      invitationSender: null,
      showReject: false,
      rejectInvitationId: null
    },
    enemybattlePokemon: [],
    errorLoginMessage: '',
    errorRegisterMessage: '',
    errorResetMessage: '',
    resetSent: false,
    pokemonToBeSwitched: {},
    evolutionData: {},
    chats: [],
    load: false,
    lobby: {
      users: [],
      invitations: []
    }
  },
  getters: {
    getResetSent(state) {
      return state.resetSent;
    },
    getLobby(state) {
      return state.lobby;
    },
    getLoad(state) {
      return state.load;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
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
    getEvolutionData(state) {
      return state.evolutionData;
    },
    getUserLevel(state) {
      return state.userInfo.level;
    },
    getSeeInvitation(state) {
      return state.userInfo.seeInvitation;
    },
    getGameInvitationId(state) {
      return state.userInfo.invitationGameId;
    },
    getGameInvitationSender(state) {
      return state.userInfo.invitationSender;
    },
    getShowReject(state) {
      return state.userInfo.showReject;
    },
    getErrorResetMessage(state) {
      return state.errorResetMessage;
    }
  },
  mutations: {
    setErrorResetMessage(state, payload) {
      state.errorResetMessage = payload.value;
    },
    setShowReject(state, payload) {
      state.userInfo.showReject = payload.value;
    },
    setLobbyUsers(state, payload) {
      state.lobby.users = payload.value;
    },
    setSeenCongrats(state, payload) {
      state.userInfo.seenCongrats = payload.value;
    },
    setUserStats(state, payload) {
      const { wins, loses } = payload.value;
      state.userInfo.wins =  wins;
      state.userInfo.loses =  loses;
    },
    setLoad(state, payload) {
      state.load = payload.value;
    },
    setUserLevel(state, payload) {
      state.userInfo.level = payload.value;
    },
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
    storeEvolutionData(state, { from, to }) {
      state.evolutionData = { from, to };
    },
    replaceStarterPokemon(state, { value }) {
      const starterToBeRemoved_id = value.pokeId;
      const starterToBeRemoved_name = value.name;
      state.userInfo.starters = state.userInfo.starters.filter(starter => starter.id !== starterToBeRemoved_id && starter.name !== starterToBeRemoved_name);
      const pokemonToBeAddedToStarters = state.pokemonToBeSwitched;
      state.userInfo.starters.push(pokemonToBeAddedToStarters);
    },
    replaceCollectionPokemon(state, { value }) {
      const { from, to } = value;
      if (state.userInfo.pokemon.copies && state.userInfo.pokemon.copies > 1) state.userInfo.pokemon.copies--;
      else state.userInfo.pokemon = state.userInfo.pokemon.filter(poke => poke.id !== from.id);
      const indexOfDuplicate = state.userInfo.pokemon.findIndex(poke => poke.id === to.id);
      if (indexOfDuplicate !== -1) state.userInfo.pokemon[indexOfDuplicate].copies = 2;
      else state.userInfo.pokemon.push(to);
    }
  },
  actions: {
    sendResetPasswordEmail({ commit, state }, { email }) {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          state.resetSent = true;
        })
        .catch((error) => {
          state.errorResetMessage = error.message;
        });
    },
    playGameMove({ commit, state }, { gameId , gameObject }) {
      return firebase.database().ref('games/' + gameId).update(gameObject);
    },
    updateGameState({ commit, state }, { gameId , nextState, nextPlayer }) {
      return firebase.database().ref('games/' + gameId).update({
        status: nextState,
        currentPlayer: nextPlayer
      });
    },
    registerToGame({ commit, state }, { gameId , eventHandler }) {
      return firebase.database().ref('games/' + gameId).on('value', eventHandler);
    },
    closeReject({ commit, state }) {
      state.userInfo.showReject = false; // close modal

      firebase.database().ref('lobby/invitations/' + state.userInfo.rejectInvitationId).remove();
    },
    rejectGameInvitation({ commit, state }) {
      var id = localStorage.getItem('userId');

      firebase.database().ref('lobby/invitations/' + id).update({
        status: 'REJECTED'
      }).then(() => {
        state.userInfo.seeInvitation = false; // close modal
      });
    },
    acceptGameInvitation({ commit, state }) {
      var id = localStorage.getItem('userId');

      state.userInfo.seeInvitation = false; // close modal

      const gameId = state.userInfo.invitationGameId;
      state.userInfo.invitationGameId = null;
      state.userInfo.invitationSender = null;

      firebase.database().ref('lobby/invitations/' + id).update({    
        status: 'ACCEPTED',
        awayPokemon: state.userInfo.starters
      }).then(() => {
        router.push({ name: 'PvpGame', params: { gameId }});
      });
    },
    sendGameInvitation({ commit, state }, { awayUser, gameId }) {
      state.load = true;

      var senderId = localStorage.getItem('userId');

      firebase.database().ref('lobby/invitations/' + awayUser.id).on("value", (invitationObj) => {
        if (invitationObj.val() && invitationObj.val().sender === senderId && invitationObj.val().status === 'ACCEPTED') {
          state.load = false;

          firebase.database().ref('lobby/invitations/' + awayUser.id).remove(); // delete invitation

          firebase.database().ref('games/' + invitationObj.val().gameId).set({
            winner: null,
            previousPlayer: senderId,
            currentPlayer: senderId,
            status: 'STARTED',
            player1: { id: senderId, name: state.userInfo.loginUsername, img: state.userInfo.image, pokemon: state.userInfo.starters },
            player2: { id: awayUser.id,  name: awayUser.name, img: awayUser.img, pokemon: invitationObj.val().awayPokemon },
            gameId: invitationObj.val().gameId
          }).then(() => {
            router.push({ name: 'PvpGame', params: { gameId: invitationObj.val().gameId }});
          });
        } else if (invitationObj.val() && invitationObj.val().sender === senderId && invitationObj.val().status === 'REJECTED') {
          state.load = false;
          state.userInfo.showReject = true;
          state.userInfo.rejectInvitationId = userId;
        }
      });

      return firebase.database().ref('lobby/invitations/' + awayUser.id).set({
        senderUsername: state.userInfo.loginUsername,
        sender: senderId,
        status: 'SENT',
        gameId
      });
    },
    unregisterFromLobby({ commit, state }) {
      var id = localStorage.getItem('userId');
      return firebase.database().ref('lobby/users/' + id).remove()
    },
    registerToLobby({ commit, state }) {
      var id = localStorage.getItem('userId');
      firebase.database().ref('lobby/users').on("value", (lobbyObj) => {
        if (lobbyObj.val()) {
          const users = [];
          Object.values(lobbyObj.val()).forEach((user) => {
            users.push(user);
          });
          commit({ type: 'setLobbyUsers', value: users });
        }
      });

      firebase.database().ref('lobby/invitations/' + id).on("value", (invitationObj) => {
        if (invitationObj.val() && invitationObj.val().sender !== id && invitationObj.val().status === 'SENT') {
          state.userInfo.invitationGameId = invitationObj.val().gameId;
          state.userInfo.invitationSender = invitationObj.val().senderUsername;
          state.userInfo.seeInvitation = true; // show invitation modal
        }
      });

      return firebase.database().ref('lobby/users/' + id).set({
        id,
        username: state.userInfo.loginUsername,
        starters: state.userInfo.starters,
        img: state.userInfo.image
      });
    },
    updateSeenCongrats({ commit, state }, { value }) {
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        seenCongrats: value,
      });
    },
    updateXPs({ commit, state }, { value }) {
      for (const pokemon of value) {
        const { name, newXP, hasLevelUp, newHp } = pokemon;
        const newPokemon = state.userInfo.pokemon.filter(poke => poke.name === name)[0];
        newPokemon.XP = newXP;
        newPokemon.hp = newHp;
        if (hasLevelUp) newPokemon.level = parseInt(newPokemon.level, 10) + 1;
        commit({ type: 'replaceCollectionPokemon', value: { from: newPokemon, to: newPokemon }});
        if (state.userInfo.starters.find(starter => starter.name === name || newPokemon.id === starter.id)) {
          commit({ type: 'storePokemonToBeSwitched', value: newPokemon });
          commit({ type: 'replaceStarterPokemon', value: { pokeId: newPokemon.id, name: newPokemon.name }})
        }
      }
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        pokemon: state.userInfo.pokemon,
        starters: state.userInfo.starters
      });
    },
    levelUpPokemon({ commit, state }, payload) {
      const { name, quantity } = payload;
      const newPokemon = state.userInfo.pokemon.filter(poke => poke.name === name)[0];
      newPokemon.level = parseInt(newPokemon.level, 10) + parseInt(quantity, 10);
      commit({ type: 'replaceCollectionPokemon', value: { from: newPokemon, to: newPokemon }});
      if (state.userInfo.starters.find(starter => starter.name === name || newPokemon.id === starter.id)) {
        commit({ type: 'storePokemonToBeSwitched', value: newPokemon });
        commit({ type: 'replaceStarterPokemon', value: { pokeId: newPokemon.id, name: newPokemon.name }})
      }
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        pokemon: state.userInfo.pokemon,
        starters: state.userInfo.starters
      });
    },
    updateStats({ commit, state }, payload) {
      const { result } = payload.value;
      const wins = result === 'wins' ? state.userInfo.wins + 1 : state.userInfo.wins;
      const loses = result === 'loses' ? state.userInfo.loses + 1: state.userInfo.loses;
      const stats = { wins, loses };
      commit({ type: 'setUserStats', value: stats });
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        stats: stats,
      });
    },
    removeItem({ commit, state }, payload) {
      var existingItems = state.userInfo.items || [];
      const indexOfItem = existingItems.map(e => e.name).indexOf(payload.item);
      if (existingItems[indexOfItem].quantity > payload.quantity) existingItems[indexOfItem].quantity -= payload.quantity;
      else delete existingItems[indexOfItem];
      commit({ type: 'setItems', value: existingItems });
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        items: existingItems,
      });
    },
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
    evolvePokemon({ commit, state }, payload) {
      commit({ type: 'replaceCollectionPokemon', value: payload });
      if (state.userInfo.starters.find(starter => starter.id === payload.from.id)) {
        commit({ type: 'storePokemonToBeSwitched', value: payload.to });
        commit({ type: 'replaceStarterPokemon', value: { pokeId: payload.from.id, name: payload.from.name }})
      }
      var id = localStorage.getItem('userId');
      return firebase.database().ref('users/' + id).update({
        pokemon: state.userInfo.pokemon,
        starters: state.userInfo.starters
      });
    },
    awardPokemon({ commit, state }, payload) {
      var existingPokemon = state.userInfo.pokemon;
      var mergedPokemon = existingPokemon.concat(payload.list);
      var coins = state.userInfo.coins;
      if (payload.coins) coins -= payload.coins;
      if (payload.coinsToBeAdded) coins += payload.coinsToBeAdded;
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
      if (payload.coinsToBeAdded) coins += payload.coinsToBeAdded;
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
        stats: { wins: 0, loses: 0 },
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
