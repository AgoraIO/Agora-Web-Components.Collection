<template>
  <div :class="styles['switch-bottom']">
    <Select
      :class="$style['camera-select']"
      :items="deviceItems"
      :currentItem="currentItem"
      @change="change"></Select>
    <div :class="styles['button-group']">
      <button :class="styles['button-no'] + ' ' + styles.btn"
        @click="handleClickSwitchNo"
        :disabled="btnDisabled">
        Skip
      </button>
      <button :class="styles['button-yes'] + ' ' + styles.btn"
        @click="handleClickSwitchYes"
        :disabled="btnDisabled">
        Detect
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Model,
} from 'vue-property-decorator';
import { SelectItem } from '../../types/types';
import Select from '../Select.vue';
import styles from '../../styles.module.css';

@Component({
  components: {
    Select,
  },
})
export default class DeviceSwitch extends Vue {
  @Prop() private btnDisabled!: boolean;

  @Prop() private deviceItems!: SelectItem[];

  @Prop() private handleSelectChange!: Function;

  @Model('change', { type: Object }) readonly currentItem!: SelectItem;

  private styles = styles;

  handleClickSwitchNo() {
    this.$emit('handleClickSwitchNo');
  }

  handleClickSwitchYes() {
    this.$emit('handleClickSwitchYes');
  }

  change(value: any) {
    this.$emit('change', value);
  }
}
</script>

<style module>
.camera-select {
  margin: 0 auto;
  margin-top: 15px;
}
</style>
