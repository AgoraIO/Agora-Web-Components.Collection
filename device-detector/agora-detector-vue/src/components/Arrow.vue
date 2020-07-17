<template>
  <div :class="$style['detector-arrow']">
    <div :class="$style['arrow-inner']"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Arrow extends Vue {}
</script>

<style module>
.detector-arrow {
  margin-left: 2px;
}
.detector-arrow .arrow-inner{
  width: 0;
  height: 0;
  border: 12px solid;
  border-color: transparent transparent transparent #C3C9D1;
  position: relative;
}
.detector-arrow .arrow-inner::after{
  content: '';
  position: absolute;
  top: -12px;
  left: -14px;
  border: 12px solid;
  border-color: transparent transparent transparent white;
  }
</style>
