<template>
    <div>
        <h3>Select Opponent</h3>
        <lobby-player v-for="(user, index) in getLobby.users"
                      :key="index"
                      :id="user.id"
                      :username="user.username"
                      :starters="user.starters.map(s => s.name)"
                      @select="sendInvitation"
                      v-if="!isCurrentUser(user.id)">
        </lobby-player>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LobbyPlayer from '@/components/pvp/LobbyPlayer'
import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator'

export default {
  name: 'lobby-component',
  components: {
    LobbyPlayer
  },
  mixins: [uniqueIdGeneratorMixin],
  created () {
    this.registerToLobby()
  },
  destroyed() {
    this.unregisterFromLobby()
  },
  methods: {
      ...mapActions([
        'registerToLobby',
        'unregisterFromLobby',
        'sendGameInvitation'
      ]),
      isCurrentUser(id) {
        return localStorage.getItem('userId') === id
      },
      sendInvitation (userId) {
        this.sendGameInvitation({ userId, gameId: this.guid() })
      }
  },
  computed: {
    ...mapGetters([
        'getLobby',
      ]),
  }
}
</script>