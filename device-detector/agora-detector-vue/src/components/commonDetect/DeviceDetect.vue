<template>
  <div :class="styles['detecting-bottom']">
        <div :class="styles['detecting-text']">
          <Ring :class="styles['loading-ring']"></Ring>
          <span :class="styles['detecting-text-inner']">{{text}}</span>
        </div>
      </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Ring from '../Ring.vue';
import styles from '../../styles.module.css';

@Component({
  components: {
    Ring,
  },
})
export default class Arrow extends Vue {
  @Prop() private text!: string;

  private styles = styles;
}
</script>

<style scoped>
.detecting-bottom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detecting-text {
  text-align: center;
  height:22px;
  font-size:16px;
  font-weight:400;
  color:rgba(92,103,116,1);
  line-height:22px;
}
</style>
