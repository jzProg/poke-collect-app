<template>
  <Modal>
    <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
    <h3 slot = "header">Select bundles to buy</h3>
    <div slot = "body">
      <div v-for="(item, index) in items.items"
           :key="index"
           style="cursor:pointer">
        <input type="number" min="1" v-model="item.quantity" size="1" style="margin-bottom:2%"> x
        <img v-if="items.type !== 'pack'" :src="item.image">
        <span v-else>{{ item.title }}</span>
        for <b>{{ item.price }}</b> coins
        <input type="radio" :checked="itemsToBuy.indexOf(item) != -1" @click.prevent="onChoose(item)">
      </div>
    </div>
    <div slot = "footer" class="text-center">
      <span v-if="cashError" class="text-center" style="color:red">Not enough coins</span><br>
      <button :disabled="!itemsToBuy.length" type = "button" class="btn btn-primary" @click.prevent = "buy">Buy</button>
      <button type = "button" class="btn btn-danger" @click.prevent = "cancel">Cancel</button>
    </div>
  </Modal>
</template>

<script>
  import Modal from './GenericModalStructure.vue';
  import { mapGetters } from 'vuex';

  export default {
      name: 'BuyModal',
      props: ['items', 'buyAction'],
      components: { Modal },
      data() {
        return {
          itemsToBuy: [],
          cashError: false,
        }
      },
      methods: {
        onChoose(item) {
        const position = this.itemsToBuy.indexOf(item);
         if (position != -1) {
           this.itemsToBuy.splice(position, 1);
         } else {
           this.totalCost += item.quantity*item.price; // add new value
           this.itemsToBuy.push(item);
         }
        },
        buy() {
          if (this.getUserCoins < this.getTotalCost) {
            this.cashError = true;
          } else this.buyAction(this.itemsToBuy, this.items.type);
        },
        cancel() {
          this.$emit('close');
        },
        close() {
          this.$emit('close');
        },
      },
      computed: {
        ...mapGetters([
          'getUserCoins',
        ]),
        getTotalCost() {
          return this.itemsToBuy.map(item => item.price*item.quantity).reduce((prev, curr) => prev + curr, 0);
        }
      }
  }
</script>
