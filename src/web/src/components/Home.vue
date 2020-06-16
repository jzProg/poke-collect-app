<template>
  <div>
    <div id = "addBookBtn"
         class = "btn btn-primary"
         style = "border-radius:40px"
         @click.prevent = "postBook">
      <i class = "fas fa-plus"></i>
    </div>
    <!--Modal v-if = "showModal"
           @close = "onClose">
    </Modal-->
  </div>
</template>

<script>
  import uniqueIdGeneratorMixin from '@/common/helpers/uniqueIdsGenerator';
  import bus from "@/common/eventBus";
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'Home',
    mixins: [uniqueIdGeneratorMixin],
    data() {
      return {
        userBooks: [],
        showModal: false,
      }
    },
    created() {
      if (!this.getLoginUsername) {
        bus.$on('login', (username) => {
          this.storeUsername(username);
        });
      } else {
        this.fetchBooks(this.getLoginUsername);
      }
    },
    methods: {
      ...mapActions([
          'fetchBooks',
          'addNewBook',
          'deleteBook',
          'storeUsername',
      ]),
      onClose(res) {
        if (res && Object.keys(res).length) {
          const bookId = this.guid();
          this.addNewBook({ bookId: bookId,
                            title: res.title,
                            author: res.author_name[0],
                            image: `http://covers.openlibrary.org/b/isbn/${res.isbn[0]}-L.jpg`,
                            postedBy: this.getLoginUsername}).then(() => {
            this.fetchBooks(this.getLoginUsername);
          });
        }
        this.showModal = false;
      },
      postBook() {
        this.showModal = true;
      },
      deleteBook(bookId) {
        this.deleteBook({ bookId: bookId}).then(() => {
          this.fetchBooks(this.getLoginUsername);
        });
      },
    },
    computed: {
      ...mapGetters([
          'getUserBooks',
          'getLoginUsername',
      ]),
    }
  }
</script>

<style scoped>
  #addBookBtn {
    float: left;
    margin-left: 10%;
  }
</style>
