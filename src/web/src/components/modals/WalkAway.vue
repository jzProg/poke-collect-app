<template>
    <Modal :width="'400px'">
      <span slot = "close" id = 'closeSymbol' @click.prevent = "close">x</span><br>
      <h3 slot = "header">Game Ended</h3>
      <div slot = "body">
        <h2>{{ 'You won!'}}</h2><br>
        {{  message  }}<br>
        <img :src="require('../../assets/happy.png')">
      </div>
    </Modal>
  </template>
  
  <script>
  import Modal from './GenericModalStructure.vue';
  
    export default {
        name: 'WalkAway',
        props: ['message'],
        components: { Modal },
        methods: {
          close() {
            this.$emit('close');
          },
        }
    }
  </script>
  