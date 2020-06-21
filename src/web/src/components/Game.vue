<template>
	<!--svg-map id= "map" :map="Japan" /-->
  <div id='mapContainer' style="width: 55%;float:right;">
    <checkbox-svg-map v-model="selectedLocations" :map="Japan" />
  </div>

</template>

<script>
import { SvgMap, CheckboxSvgMap } from "vue-svg-map";
import Japan from "@svg-maps/japan";

export default {
  name: 'Game',
  components: {
  		SvgMap, CheckboxSvgMap
  	},
  	data() {
  		return {
  			Japan,
        selectedLocations: []
  		};
  	},
}
</script>

<style>
.svg-map {
  width: 100%;

  stroke: #666;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round; }
  .svg-map__location {
    fill: #a1d99b;
    cursor: pointer; }
    .svg-map__location:focus, .svg-map__location:hover {
      fill: #b8e2b3;
      outline: 0; }
    .svg-map__location[aria-checked="true"] {
      fill: #f4bc44; }
</style>
