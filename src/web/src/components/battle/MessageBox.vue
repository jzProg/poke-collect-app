<template>
  <div :class="['messageDiv', 'row', (fullscreen) ? 'fullscreen': '']">
      <div id="battleMessage" class="col-md-6 col-xs-6">
          {{ message }}
      </div>
      <div id="options" class="col-md-6 col-xs-6" style="width: 50%;float:right">
          <div v-for="(move,index) in homebattlePokemon.moves"
                class="move"
                :key="index"
                :class="[isAbilityUsedTooMuch(move) ? 'disabledbutton' : '']"
                @click.prevent="attack(move.move)"
                v-show="isHomePlayerBattlePhase()"
                v-if="Object.keys(homebattlePokemon).length && index < 4">
                 {{ move.move.name }}
          </div>
          <span style="cursor: pointer; margin: 2%"
                @click.prevent="onWalkAway()"
                v-show="isHomePlayerBattlePhase()">
                 walk away <i class="fas fa-walking fa-2x"></i>
          </span>
          <span style="cursor: pointer; margin: 2%"
                @click.prevent="changePokemon()"
                v-show="isHomePlayerBattlePhase()">
                 pokemon <i class="fas fa-exchange-alt fa-2x"></i>
          </span>
          <div class="row">
            <div v-if="getHomePokemon && !Object.keys(homebattlePokemon).length"
                v-for="(poke, index) in getHomePokemon":key="index">
              <div class="startersDiv">
                <Pokemon :info="poke"
                         class="col-md-4 col-xs-4"
                         :classFlag="true"
                         :action-on-click="onPokemonChoosed"
                         :disabled="disabled[poke.name]"
                         id="starter">
               </Pokemon>
             </div>
            </div>
         </div>
      </div>
  </div>
</template>

<script>
  import Pokemon from '@/components/pokemon/Pokemon';

  export default {
    props: ['message', 'fullscreen', 'homebattlePokemon', 'getHomePokemon', 'disabled', 'onPokemonChoosed', 'changePokemon', 'isHomePlayerBattlePhase', 'onWalkAway', 'isAbilityUsedTooMuch', 'attack'],
    components: { Pokemon }
  }
</script>
