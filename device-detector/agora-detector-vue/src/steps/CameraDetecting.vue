<template>
  <PageContainer>
    <template v-slot:main>
        <div :class="styles['video-container']"
          ref="cameraVideo"></div>
        <div :class="styles['tab-title']">Camera Detection</div>
    </template>
    <template v-slot:bottom>
      <DeviceDetect
        v-if="deviceStep==='DETECTING'"
        text="Detecting..."
      />
      <DeviceAsk v-else-if="deviceStep==='ASK'"
        askText="Can you see the picture?"
        @handleClickNo="handleClickNo"
        @handleClickYes="handleClickYes"
        :btnDisabled="btnDisabled"
      />
      <DeviceAsk v-else-if="deviceStep==='RETRY'"
        askText="Do you want to replace the device and redetect?"
        @handleClickNo="handleClickRetryNo"
        @handleClickYes="handleClickRetryYes"
      />
      <DeviceSwitch v-else-if="deviceStep==='SWITCH'"
        :deviceItems="deviceItems"
        v-model="currentDevice"
        @change="handleSelectChange"
        @handleClickSwitchNo="handleClickSwitchNo"
        @handleClickSwitchYes="handleClickSwitchYes"
        :btnDisabled="btnDisabled"
      />
    </template>
  </PageContainer>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { IAgoraRTC, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import eventBus from '../utils/eventBus';
import Ring from '../components/Ring.vue';
import PageContainer from '../components/PageContainer.vue';
import Select from '../components/Select.vue';
import { SelectItem } from '../types/types';
import { wait } from '../utils/helper';
import DeviceAsk from '../components/commonDetect/DeviceAsk.vue';
import DeviceDetect from '../components/commonDetect/DeviceDetect.vue';
import DeviceSwitch from '../components/commonDetect/DeviceSwitch.vue';
import styles from '../styles.module.css';

@Component({
  components: {
    Ring,
    PageContainer,
    Select,
    DeviceAsk,
    DeviceDetect,
    DeviceSwitch,
  },
})
export default class CameraDetecting extends Vue {
  @Prop() private state!: string;

  @Prop() private deviceStep!: string;

  private cameraDevices: MediaDeviceInfo[] = [];

  private currentDevice: SelectItem = { value: null, label: 'Null' };

  private styles = styles;

  get deviceItems(): SelectItem[] {
    return this.cameraDevices.map((device) => ({
      value: device.deviceId,
      label: device.label,
    }));
  }

  @Watch('deviceStep')
  onDeviceStepChanged(newVal: string) {
    if (newVal === 'DETECTING') {
      this.detectCountDown();
    }
  }

  private btnDisabled = false;

  private handleClickNo() {
    eventBus.$emit('click-camera-ask-no');
    const cameraResult = eventBus.$data.getStore().get('cameraResult');
    cameraResult.result = false;
    eventBus.$data.getStore().set('cameraResult', cameraResult);
  }

  private handleClickYes() {
    eventBus.$emit('click-camera-ask-yes');
  }

  private handleClickRetryNo() {
    eventBus.$emit('click-camera-retry-no');
  }

  private async handleClickRetryYes() {
    this.btnDisabled = true;
    eventBus.$emit('click-camera-retry-yes');
    try {
      await this.getDevices();
    } finally {
      this.btnDisabled = false;
    }
  }

  private async getDevices() {
    const AgoraSDK = eventBus.$data.getStore().get('agoraSDK') as IAgoraRTC;
    try {
      this.cameraDevices = await AgoraSDK.getCameras();
    } catch (e) {
      console.error(e);
    }
    return this.deviceItems;
  }

  private handleClickSwitchNo() {
    eventBus.$emit('click-camera-switch-no');
  }

  private handleClickSwitchYes() {
    eventBus.$emit('click-camera-switch-yes');
  }

  private async handleSelectChange() {
    console.log('select change', this.currentDevice);
    this.btnDisabled = true;
    try {
      const cameraTrack = await eventBus.$data.getStore().get('trackManager').getCameraTrack() as ICameraVideoTrack;
      cameraTrack.setDevice(this.currentDevice.value);
    } finally {
      this.btnDisabled = false;
    }
  }

  async mounted() {
    const cameraTrack = await eventBus.$data.getStore().get('trackManager').getCameraTrack();
    cameraTrack && cameraTrack.play(this.$refs.cameraVideo);
    this.detectCountDown();
  }

  async detectCountDown() {
    const cameraTrack = await eventBus.$data.getStore().get('trackManager').getCameraTrack();
    const [result, , deviceItems] = await Promise.all([
      eventBus.$data.getStore().get('trackManager').checkCameraTrack(cameraTrack),
      wait(2000),
      this.currentDevice.value === null ? this.getDevices() : Promise.resolve(),
    ]);
    const newCurrentDevice = deviceItems && deviceItems[0];
    if (newCurrentDevice) {
      this.currentDevice = newCurrentDevice;
    }
    if (!result) {
      this.$emit('showCameraTips');
    }
    eventBus.$data.getStore().set('cameraResult', {
      deviceLabel: this.currentDevice.label,
      deviceId: this.currentDevice.value,
      result,
    });
    eventBus.$emit('camera-detect-finish');
  }
}
</script>
