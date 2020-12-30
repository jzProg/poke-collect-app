<template>
  <Modal>
    <span slot="close" id='closeSymbol' @click.prevent="close">x</span><br>
    <h3 slot="header">Stats Update</h3>
    <div slot="body" class="">
      <div class="row" v-for="(poke, index) in battlePokemon" :key="index">
        <div class="col-md-6">
          <img :src="poke.image" alt="poke cover" width="100px" height="100px">
        </div>
        <div class="col-md-6" style="margin-top: 10%">
          <span><b>XP</b> {{ poke.oldXP }} <i class="fas fa-arrow-right"></i> {{ poke.newXP}}</span><br>
          <span v-if="poke.newLvl"><b>Lvl</b> {{ poke.oldLvl }} <i class="fas fa-arrow-right"></i> {{ poke.newLvl }}</span>
        </div>
      </div>
    </div>
    <div slot="footer" class="text-center">
      <button type="button"
              class="btn btn-primary"
              @click.prevent="confirmed">
        Confirm
     </button>
    </div>
  </Modal>
</template>

<script>
  import Modal from '@/components/modals/GenericModalStructure.vue';

  export default {
    name: 'Stats',
    props: ['battlePokemon'],
    components: { Modal },
    methods: {
      confirmed() {
        this.$emit('close');
      },
      close() {
        this.$emit('close');
      },
    },
  }
</script>
