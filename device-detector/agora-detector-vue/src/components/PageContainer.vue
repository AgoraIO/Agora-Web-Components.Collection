<template>
  <div :class="styles['detector-container']">
      <div :class="styles['detector-main']">
        <slot name="main"></slot>
      </div>
    <div :class="styles['detector-bottom']">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import styles from '../styles.module.css';

@Component
export default class PageContainer extends Vue {
  private styles = styles;
}
</script>
