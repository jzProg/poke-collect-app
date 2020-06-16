import Vue from 'vue';
import Vuex from 'vuex';
import uniqueIdGenerator from '../common/helpers/uniqueIdsGenerator';
import firebase from 'firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {
      currentReward: { rewardType: '', rewardId: ''},
      loginUsername: '',
      notifications: [],
      pokemon: [],
      initialized: false,
    },
    errorLoginMessage: '',
    errorRegisterMessage: '',
  },
  getters: {
    getMessages(state) {
      return state.userInfo.messages;
    },
    getNotifications(state) {
      return state.userInfo.notifications;
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
  },
  mutations: {
    setUserBasicInfo(state, payload) {
      state.userInfo.initialized = payload.value;
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
    setNotifications(state, payload) {
      state.userInfo.notifications = payload.value;
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
    setAllBookList(state, payload) {
      state.allBooksPosted = payload.value;
    },
    setBookList (state, payload) {
      state.userInfo.booksPosted = payload.value;
    },
    setMessages(state, payload) {
      state.userInfo.messages = payload.value;
    },
  },
  actions: {
    storePokemon({ commit, dispatch, state }, payload) {
       commit({ type: 'setUserPokemon', value: payload.list });
       commit({ type: 'setUserBasicInfo', value: true });
       var id = localStorage.getItem('userId');
       firebase.database().ref('users/' + id).update({
         pokemon: payload.ids,
         initialized: state.userInfo.initialized,
       });
    },
    trade({ commit, state }, payload) {
      return  firebase.database().ref('trades/' + payload.tradeId).set({
                tradeId: payload.tradeId,
                requester: payload.requester,
                receiver: state.userInfo.loginUsername,
                bookToTrade: payload.bookToTrade,
                bookToOffer: payload.bookToOffer,
      }).then(() => {
        firebase.database().ref('books/').once("value", (bookObject) => {
          if (bookObject.val()) {
            Object.values(bookObject.val()).forEach((book) => {
              if (book.bookId === payload.bookToTrade || book.bookId === payload.bookToOffer) {
                let theUploader = state.userInfo.loginUsername;
                let theBookId = payload.bookToOffer;
                if (book.bookId === payload.bookToTrade) {
                  theUploader = payload.requester;
                  theBookId = payload.bookToTrade;
                }
                if (book.copies && book.copies > 1) {
                  firebase.database().ref('books/' + theBookId).update({
                    copies: book.copies - 1,
                  });
                  dispatch('addNewBook', {
                    bookId: uniqueIdGenerator.methods.guid(),
                    title: book.title,
                    author: book.author,
                    image: book.image,
                    postedBy: theUploader,
                  });
                } else {
                  firebase.database().ref('books/' + theBookId).update({
                    postedBy: theUploader,
                  });
                }
              }
            });
          }});
          // todo check if book already been traded (on another trade)
      });
    },
    removeMessage({ commit, state }, payload) {
      return  firebase.database().ref('users/').once("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            if (user.username === state.userInfo.loginUsername) {
              const newMessages = user.messages.filter(( mes ) => {
                return mes.messageId !== payload.messageId;
              });
              firebase.database().ref('users/' + user.userId).update({
                messages: newMessages,
              });
            }
          });
        }});
    },
    removeNotification({ commit, state }, payload) {
      return  firebase.database().ref('users/').once("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            if (user.username === state.userInfo.loginUsername) {
              const newNotif = user.notifications.filter(( not ) => {
                return not.tradeId !== payload.notificationId;
              });
              firebase.database().ref('users/' + user.userId).update({
                notifications: newNotif,
              });
            }
          });
        }});
    },
    sendTradeMessage({ commit }, payload) {
      firebase.database().ref('users/').once("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            const newEntry = {
              messageId: payload.messageId,
              message: payload.message,
              isPositive: payload.isPositive,
            };
            if (user.username === payload.sendTo) {
              if (user.messages) user.messages.push(newEntry);
              else user.messages = [newEntry];
              firebase.database().ref('users/' + user.userId).update({
                messages: user.messages,
              });
            }
          });
        }});
    },
    fetchUserPokemon({ commit }, username) {
      console.log(username);
      return firebase.database().ref('users/').on("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            if (user.username === username) {
              localStorage.setItem('userId', user.userId);
              console.log(username);
              commit({ type: 'setUserPokemon', value: user.pokemon }); //todo from api
              commit({ type: 'setUserBasicInfo', value: user.initialized });
            }
          });
        }});
    },
    fetchNotifications({ commit }, username) {
      return firebase.database().ref('users/').on("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            if (user.username === username) {
              commit({ type: 'setNotifications', value: user.notifications });
            }
          });
        }});
    },
    sendNotification({ commit }, payload) {
      firebase.database().ref('users/').once("value", (userObject) => {
        if (userObject.val()) {
          Object.values(userObject.val()).forEach((user) => {
            const newEntry = {
                               tradeId: payload.tradeId,
                               requester: payload.requester,
                               bookToTrade: payload.bookToTrade,
                               bookToOffer: payload.bookToOffer};
            if (user.username === payload.trader) {
              if (user.notifications) user.notifications.push(newEntry);
              else user.notifications = [newEntry];
              firebase.database().ref('users/' + user.userId).update({
                notifications: user.notifications,
              })
            }
          });
        }});
    },
    addNewBook({ commit, state }, payload) {
      const results = state.userInfo.booksPosted.find(book => {
          return book.title === payload.title && book.postedBy === payload.postedBy;
      });
      if (results) {
        return firebase.database().ref('books/' + results.bookId)
          .update({ copies: ( results.copies? results.copies + 1 : 2 ) });
      }
      return firebase.database().ref('books/' + payload.bookId).set({
        bookId: payload.bookId,
        title: payload.title,
        author: payload.author,
        image: payload.image,
        copies: 1,
        postedBy: payload.postedBy,
      });
    },
    fetchBooks({commit}, username) {
       firebase.database().ref('books/').on("value", (bookObject) => {
        const filteredBooks = [];
        if (bookObject.val()) {
          Object.values(bookObject.val()).forEach((book) => {
            if (book.postedBy === username) {
              filteredBooks.push(book);
            }
          });
         commit({ type: 'setBookList', value: filteredBooks});
        }
      }, (errorObject) => {
        console.log("Can't fetch books! The read failed: " + errorObject.code);
      });
    },
    fetchAllBooks({commit}) {
      console.log('in fetch all books');
      firebase.database().ref('books/').on("value", (bookObject) => {
        const allBookList = [];
        if (bookObject.val()) {
          Object.values(bookObject.val()).forEach((book) => {
            allBookList.push(book);
          });
          commit({ type: 'setAllBookList', value: allBookList});
        }
      }, (errorObject) => {
        console.log("Can't fetch books! The read failed: " + errorObject.code);
      });
    },
    deleteBook({ commit }, payload) {
      return  firebase.database().ref('books/' + payload.bookId).remove();
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
    createUserProfile({ commit }, payload) {
      return firebase.database().ref('users/' + payload.userId).set({
        userId: payload.userId,
        username: payload.username,
        pokemon: [],
        initialized: false,
      }).then(() => {
        firebase.auth().currentUser.updateProfile({
          displayName: payload.username,
        }).catch((error) => {
          console.log('profile update error: ', error);
        });
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
      commit({ type: 'setBookList', value: []});
    }
  }
});
