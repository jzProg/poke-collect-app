<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">{{ !activeChatId? 'Chat' :  getChat.name }}</h3>
    <div slot = "body">
      <div id="chatDiv" v-if="activeChatId">
        <div v-for="(mes, index) in getChat.messages" :key="index" style="text-align: left;" >
          <span :style="getColorStyle(mes.sender)">
            {{ mes.sender }}
          </span>
          {{ mes.text }}
          <span style="color:lightgrey;" v-if="mes.date">
            <i>{{ new Date(mes.date).toLocaleString() }}</i>
          </span>
        </div><br>
      </div>
      <div id="conversationsDiv" v-else>
        <div class="convDiv"
             v-for="(conv, index) in getAvailableChats"
            :key="index"
            @click.prevent = "chooseChat(conv.id)"
            style="cursor:pointer; padding:5%; border-style: solid;">
          <b>{{ conv.name }}</b>
        </div>
      </div>
      <NewConversation v-if="showNewChatModal"
                @confirm="createNewChat"
                @close="showNewChatModal=false">
      </NewConversation>
    </div>
    <div slot ="footer">
      <input v-if="activeChatId" type="text" placeholder="enter message" v-model="inputMessage" style="width:100%"><br>
      <div class="text-center" style="margin-top:2%" v-if="activeChatId">
        <button type = "button" class="btn btn-primary" @click.prevent = "send">Send</button>
        <button type = "button" class="btn btn-danger" @click.prevent = "back">back</button>
      </div>
      <div class="text-center" v-else>
        <button type = "button" class="btn btn-primary" @click.prevent = "showNewChat()">Add</button>
      </div>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';
  import { mapGetters, mapActions } from 'vuex';
  import NewConversation from '@/components/modals/NewConversation';
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';

  export default {
      name: 'Chat',
      mixins: [uniqueIdGeneratorMixin],
      components: { Modal, NewConversation },
      created() {
        this.fetchConversations();
      },
      data() {
        return {
          inputMessage: '',
          activeChatId: '',
          showNewChatModal: false,
          userColors: {},
        }
      },
      methods: {
        ...mapActions([
          'fetchMessages',
          'sendMessage',
          'initChat',
          'fetchConversations',
        ]),
        clearInput() {
          this.inputMessage = '';
        },
        chooseChat(id) {
          this.activeChatId = id;
          this.fetchMessages({ chatId: this.activeChatId });
        },
        showNewChat() {
          this.showNewChatModal = true;
        },
        createNewChat(name) {
          this.activeChatId = this.guid();
          this.initChat({ chatId: this.activeChatId, name: name });
          this.showNewChatModal=false;
        },
        send() {
          const message = {
            sender: this.getLoginUsername,
            text: this.inputMessage,
            date: new Date().getTime()
          }
          this.sendMessage({ chatId: this.activeChatId, message: message });
          this.clearInput();
        },
        back() {
          this.activeChatId = '';
        },
        close() {
          this.$emit('close');
        },
        getColorStyle(id) {
          return {
            color: this.getColor(id)
          }
        },
        getColor(id) {
          return  this.userColors[id] || this.assignRandomColor(id);
        },
        assignRandomColor(id){
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
           color += letters[Math.floor(Math.random() * 16)];
          }
          this.userColors[id] = color;
          return color;
        },
      },
      computed: {
        ...mapGetters([
          'getChat',
          'getLoginUsername',
          'getAvailableChats'
        ]),
      },
  }
</script>

<style scoped>
.convDiv:hover {
  color: gray;
}
</style>
