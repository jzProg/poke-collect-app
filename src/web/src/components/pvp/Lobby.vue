<template>
    <div>
        <div v-for="(user, index) in getLobby.users" :key="index" v-if="!isCurrentUser(user.id)">
           {{  'User:' + user.id }}
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'lobby-component',
  created () {
    this.registerToLobby()
  },
  methods: {
      ...mapActions([
        'registerToLobby',
      ]),
      isCurrentUser(id) {
        return localStorage.getItem('userId') === id
      }
  },
  computed: {
    ...mapGetters([
        'getLobby',
      ]),
  }
}
</script>