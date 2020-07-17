<template>
  <div :class="styles['agora-device-detector']"
    :style="isMobile ? {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    'padding-bottom': '80px',
  } : {
    width: width ? width : '580px',
    height: height ? height : '520px',
  }">
    <NavBar :state="state" :device="device"></NavBar>
    <Container :state="state" :device="device" :deviceStep="deviceStep"></Container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Container } from './Container.vue';
import NavBar from './NavBar.vue';
import eventBus from '../utils/eventBus';
import {
  DetectState, DeviceState, DeviceStepState, DetectResults,
} from '../types/types';
import styles from '../styles.module.css';

@Component({
  components: {
    NavBar,
    Container,
  },
})

export default class AgoraDetector extends Vue {
  @Prop() private width!: string;

  @Prop() private height!: string;

  private state: DetectState = 'IDLE';

  private device: DeviceState = 'CAMERA';

  private deviceStep: DeviceStepState = 'DETECTING';

  private isMobile = false;

  private styles = styles;

  mounted() {
    this.isMobile = eventBus.$data.getStore().get('isMobile');
    eventBus.$on('click-start', () => {
      this.state = 'DETECTING';
      this.device = 'CAMERA';
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('camera-detect-finish', () => {
      this.deviceStep = 'ASK';
    });
    eventBus.$on('mic-detect-finish', () => {
      this.deviceStep = 'ASK';
    });
    eventBus.$on('click-camera-ask-yes', () => {
      this.device = 'MICROPHONE';
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-camera-ask-no', () => {
      this.deviceStep = 'RETRY';
    });
    eventBus.$on('click-camera-retry-no', () => {
      this.device = 'MICROPHONE';
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-camera-retry-yes', () => {
      this.deviceStep = 'SWITCH';
    });
    eventBus.$on('click-camera-switch-no', () => {
      this.device = 'MICROPHONE';
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-camera-switch-yes', () => {
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-mic-ask-yes', () => {
      this.device = 'SPEAKER';
      this.deviceStep = 'ASK';
    });
    eventBus.$on('click-mic-ask-no', () => {
      this.deviceStep = 'RETRY';
    });
    eventBus.$on('click-mic-retry-yes', () => {
      this.deviceStep = 'SWITCH';
    });
    eventBus.$on('click-mic-retry-no', () => {
      this.device = 'SPEAKER';
      this.deviceStep = 'ASK';
    });
    eventBus.$on('click-mic-switch-no', () => {
      this.device = 'SPEAKER';
      this.deviceStep = 'ASK';
    });
    eventBus.$on('click-mic-switch-yes', () => {
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-speaker-ask-no', () => {
      this.deviceStep = 'RETRY';
    });
    eventBus.$on('click-speaker-ask-yes', () => {
      this.state = 'FINISH';
    });
    eventBus.$on('click-speaker-retry-no', () => {
      this.state = 'FINISH';
    });
    eventBus.$on('click-speaker-retry-yes', () => {
      this.deviceStep = 'ASK';
    });
    eventBus.$on('click-report-retry-yes', () => {
      this.state = 'IDLE';
      this.device = 'CAMERA';
      this.deviceStep = 'DETECTING';
    });
    eventBus.$on('click-report-retry-no', (report: DetectResults) => {
      this.$emit('onComplete', report);
    });
  }
}
</script>
