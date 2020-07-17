<template>
  <div :class="styles['ask-bottom']">
    <div :class="styles['bottom-common-text']">{{askText}}</div>
    <div :class="styles['button-group']">
      <button :class="styles['button-no'] + ' ' + styles.btn"
        @click="handleClickNo"
        :disabled="btnDisabled">No</button>
      <button :class="styles['button-yes'] + ' ' + styles.btn"
        @click="handleClickYes"
        :disabled="btnDisabled">Yes</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import styles from '../../styles.module.css';

@Component
export default class Arrow extends Vue {
  @Prop() private text!: string;

  @Prop() private btnDisabled!: boolean;

  @Prop() private askText!: string;

  private styles = styles;

  handleClickNo() {
    this.$emit('handleClickNo');
  }

  handleClickYes() {
    this.$emit('handleClickYes');
  }
}
</script>

<style scoped>
.ask-bottom {
  width: 100%;
  height: 100%;
}
.bottom-common-text {
  margin-top: 22px;
  margin-left: 30px;
  height:22px;
  font-size:16px;
  font-weight:400;
  color:rgba(92,103,116,1);
  line-height:22px;
}
.button-group {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}
.btn {
  background:rgba(9,157,253,1);
  border-radius:4px;
  border: 0;
  font-size:18px;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:25px;
}
.btn.button-yes {
  background:rgba(9,157,253,1);
  color:rgba(255,255,255,1);
  width: 120px;
  height: 40px;
  margin-left: 40px;
}
.btn.button-no {
  background:rgba(255,255,255,1);
  border:1px solid rgba(159,170,184,1);
  color:rgba(51,51,51,1);
  width: 120px;
  height: 40px;
}
</style>
