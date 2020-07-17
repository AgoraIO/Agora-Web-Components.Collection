<template>
  <div :class="$style['detector-ring']">
    <div :class="$style['ring-inner']"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Ring extends Vue {}
</script>

<style module>
.detector-ring {
  position: relative;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  border: 2px solid #099DFD;
  display: inline-block;
  border-radius: 50%;
  animation: ring 1s linear infinite;
}
.ring-inner {
  position: absolute;
  width: 4px;
  height: 4px;
  left: -2px;
  background-color: white;
}
@keyframes ring {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
