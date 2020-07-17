<template>
  <div :class="$style['detector-volume']">
      <div :class="{
          [$style['volume-block']]: true,
          [$style.active]: i / barNumArr.length < currentLevel
        }"
        v-for="(n, i) in barNumArr" :key="i">
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Volume extends Vue {
  @Prop() private length!: number;

  @Prop() private currentLevel!: number;

  get barNum() {
    return Math.floor(this.length / 6 + 0.5);
  }

  get barNumArr() {
    const arr = [];
    for (let i = 0; i < this.barNum; i += 1) {
      arr[i] = 0;
    }
    return arr;
  }
}
</script>

<style module>

.detector-volume {
  display: flex;
  width: fit-content;
  margin: 0 auto;
  margin-top: 30px;
}
.volume-block {
  width: 3px;
  height: 18px;
  margin-left: 3px;
  background-color: #CCCCCC;
}
.volume-block.active {
  background-color: #44A2FC;
}
</style>
