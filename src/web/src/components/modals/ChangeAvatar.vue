<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">ChangeAvatar</h3>
    <div slot = "body">
      <img :src = "getImage(index)"
           v-for="index in 10" :key="index"
           alt = "profile image"
           :class="[imageId === index ? 'highlighted' : '']"
           @click.prevent="choose(index)"
           style = "width:50px;height:50px;border-radius:50px;margin: 2%;cursor:pointer"><br>
    </div>
    <div slot = "footer" class = "text-center">
      <button type="button" @click.prevent="save" class="btn btn-primary">save</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';

  export default {
    name: 'ChangeAvatar',
    props: ['chooseAction'],
    components: { Modal },
    data() {
      return {
        imageId: '',
      }
    },
    methods: {
      choose(index) {
        this.imageId = index;
      },
      save() {
        this.chooseAction(this.imageId);
        this.close();
      },
      getImage(index) {
        return require(`@/assets/profileAvatar/avatar_${index}.png`);
      },
      close() {
        this.$emit('close');
      }
    },
  }
</script>

<style scoped>
.highlighted {
  background-color: yellow;
}
</style>
