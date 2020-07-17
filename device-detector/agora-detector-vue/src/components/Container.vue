<template>
  <div :class="styles['detector-container']">
    <div :class="$style['err-tips']" v-show="showCamTips">
      <div :class="$style['err-tips-text']">
        Your video input is detected as still!
      </div>
    </div>
    <div :class="$style['err-tips']" v-show="showMicTips" ref="micTips">
      <div :class="$style['err-tips-text']">
        Your volume input is detected too low!
      </div>
    </div>
    <initialPage v-if="state === 'IDLE'"></initialPage>
    <ReportPage v-if="state === 'FINISH'"></ReportPage>
    <template v-if="state === 'DETECTING'">
      <template v-if="device === 'CAMERA'">
        <CameraDetecting :deviceStep="deviceStep"
          @showCameraTips="handleShowCameraTips"></CameraDetecting>
      </template>
      <template v-if="device === 'MICROPHONE'">
        <MicDetecting :deviceStep="deviceStep" @showMicTips="handleShowMicTips"></MicDetecting>
      </template>
      <template v-if="device === 'SPEAKER'">
        <SpeakerDetecting :deviceStep="deviceStep"></SpeakerDetecting>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CameraDetecting from '../steps/CameraDetecting.vue';
import initialPage from '../steps/InitialPage.vue';
import ReportPage from '../steps/ReportPage.vue';
import MicDetecting from '../steps/MicDetecting.vue';
import SpeakerDetecting from '../steps/SpeakerDetecting.vue';
import { DetectState, DeviceState, DeviceStepState } from '../types/types';
import styles from '../styles.module.css';

@Component({
  components: {
    CameraDetecting,
    initialPage,
    ReportPage,
    MicDetecting,
    SpeakerDetecting,
  },
})
export default class Container extends Vue {
  @Prop() private state!: DetectState;

  @Prop() private device!: DeviceState;

  @Prop() private deviceStep!: DeviceStepState;

  private showCamTips = false;

  private showMicTips = false;

  private styles = styles;

  handleShowCameraTips() {
    this.showCamTips = true;
    setTimeout(() => {
      this.showCamTips = false;
    }, 3000);
  }

  handleShowMicTips() {
    this.showMicTips = true;
    if (this.showCamTips) {
      (this.$refs.micTips as HTMLElement).style.top = '50px';
    } else {
      (this.$refs.micTips as HTMLElement).style.top = '15px';
    }
    setTimeout(() => {
      this.showMicTips = false;
    }, 3000);
  }
}
export { Container };
</script>

<style module>
.err-tips {
  position: absolute;
  right: 10px;
  top: 15px;
  padding: 8px 16px;
  background-color: #fbdbdbf1;
  color: #f55151;
  border-radius: 5px;
  z-index: 1;
  text-align: center;
  display: flex;
  align-items: center;
  transition: opacity .2s;
}
.err-tips-text {
  font-size: 13px;
  line-height: 13px;
  display: inline-block;
}
</style>
