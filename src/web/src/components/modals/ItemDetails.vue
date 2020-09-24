<template>
  <Modal :width="'400px'">
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Item Details</h3>
    <div slot = "body">
      <b>{{ info.name }}</b><br>
      <img :src="info.image" class="itemImg row" style="margin-top: 10%"><br>
      <i style="font-size: 90%">{{ info.text }}</i>
    </div>
    <div slot = "footer" class="text-center">
     <div>
         You have <b>{{ info.quantity }} </b> of this item!
     </div>
    </div>
  </Modal>
</template>

<script>

import Modal from './GenericModalStructure.vue';

 export default {
      name: 'ItemDetails',
      props: ['info'],
      components: { Modal },
      methods: {
        close() {
          this.$emit('close');
        },
      },
  }
</script>
<style scoped>
.itemImg{
  width:70px;
  height:70px;
}
</style>
