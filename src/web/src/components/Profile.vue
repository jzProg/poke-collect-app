<template>
  <div>
    <h2>{{ userName }} </h2>
    <img id = 'userImg'
         src = "../assets/profile_default.png"
         alt = "Profile Image"
         style = "border-radius: 100px">
    <div id = 'bookListContent'
         class = "container">
      <div class = "row">

      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

 export default {
     name: 'Profile',
     data() {
       return {
         userName: '',
         userImage: '../assets/profile_default.png',
       }
     },
     created() {
       this.userName = this.$route.query.user;
      // this.userImage =
       this.fetchBooks(this.userName);
     },
     methods: {
       ...mapActions([
           'fetchBooks',
         ]),
       },
     computed: {
       ...mapGetters([
           'getUserBooks',
       ]),
       sortedBookList() {
         return this.getUserBooks.sort((book1, book2) => {
           return book1.title > book2.title;
         });
       },
     }
   }
</script>

<style scoped>
  #userImg {
    height: 200px;
    width: 200px;
  }
</style>
