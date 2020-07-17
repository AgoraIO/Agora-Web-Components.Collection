<template>
  <PageContainer>
    <template v-slot:main>
        <div :class="styles['mic-speaker-title']">Microphone Detection</div>
        <div :class="styles['img-and-volume']">
          <div :class="styles['detecting-img']">
            <img :class="styles['circle-img']"
            src="../assets/bigMic.png">
          </div>
          <Volume :length="180" :currentLevel="volumeLevel"></Volume>
        </div>
    </template>
    <template v-slot:bottom>
      <DeviceDetect
        v-if="deviceStep==='DETECTING'"
        text="Say something to the microphone..."
      />
      <DeviceAsk v-else-if="deviceStep==='ASK'"
        askText="Can you see the volume bar change as you speak?"
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
import { IMicrophoneAudioTrack, IAgoraRTC } from 'agora-rtc-sdk-ng';
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import eventBus from '../utils/eventBus';
import Ring from '../components/Ring.vue';
import PageContainer from '../components/PageContainer.vue';
import Volume from '../components/Volume.vue';
import { SelectItem } from '../types/types';
import Select from '../components/Select.vue';
import { wait } from '../utils/helper';
import DeviceAsk from '../components/commonDetect/DeviceAsk.vue';
import DeviceDetect from '../components/commonDetect/DeviceDetect.vue';
import DeviceSwitch from '../components/commonDetect/DeviceSwitch.vue';
import styles from '../styles.module.css';

@Component({
  components: {
    Ring,
    Volume,
    Select,
    PageContainer,
    DeviceAsk,
    DeviceDetect,
    DeviceSwitch,
  },
})
export default class MicDetecting extends Vue {
  @Prop() private state!: string;

  @Prop() private deviceStep!: string;

  private volumeInterval = 0;

  private volumeLevel = 0;

  private micDevices: MediaDeviceInfo[] = [];

  private currentDevice: SelectItem = { value: null, label: 'Null' };

  private btnDisabled = false;

  private styles = styles;

  get deviceItems(): SelectItem[] {
    return this.micDevices.map((device) => ({
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

  private handleClickNo() {
    eventBus.$emit('click-mic-ask-no');
    const micResult = eventBus.$data.getStore().get('micResult');
    micResult.result = false;
    eventBus.$data.getStore().set('micResult', micResult);
  }

  private handleClickYes() {
    eventBus.$emit('click-mic-ask-yes');
  }

  private handleClickRetryNo() {
    eventBus.$emit('click-mic-retry-no');
  }

  private async handleClickRetryYes() {
    this.btnDisabled = true;
    eventBus.$emit('click-mic-retry-yes');
    try {
      await this.getDevices();
    } finally {
      this.btnDisabled = false;
    }
  }

  private async getDevices() {
    const AgoraSDK = eventBus.$data.getStore().get('agoraSDK') as IAgoraRTC;
    try {
      this.micDevices = await AgoraSDK.getMicrophones();
    } catch (e) {
      console.error(e);
    }
    return this.deviceItems;
  }

  private handleClickSwitchNo() {
    eventBus.$emit('click-mic-switch-no');
  }

  private handleClickSwitchYes() {
    eventBus.$emit('click-mic-switch-yes');
  }

  private async handleSelectChange() {
    console.log('select change', this.currentDevice);
    this.btnDisabled = true;
    try {
      const micTrack = await eventBus.$data.getStore().get('trackManager').getMicrophoneTrack() as IMicrophoneAudioTrack;
      micTrack.setDevice(this.currentDevice.value);
    } finally {
      this.btnDisabled = false;
    }
  }

  async mounted() {
    const micTrack = await eventBus.$data.getStore().get('trackManager').getMicrophoneTrack() as IMicrophoneAudioTrack;
    if (!micTrack) {
      return;
    }
    this.volumeInterval = setInterval(() => {
      this.volumeLevel = micTrack.getVolumeLevel();
    }, 200);
    this.detectCountDown();
  }

  async detectCountDown() {
    const micTrack = await eventBus.$data.getStore().get('trackManager').getMicrophoneTrack();
    const [result, , deviceItems] = await Promise.all([
      eventBus.$data.getStore().get('trackManager').checkMicTrack(micTrack),
      wait(2000),
      this.currentDevice.value === null ? this.getDevices() : Promise.resolve(),
    ]);
    const newCurrentDevice = deviceItems && deviceItems[0];
    if (newCurrentDevice) {
      this.currentDevice = newCurrentDevice;
    }
    if (!result) {
      this.$emit('showMicTips');
    }
    eventBus.$data.getStore().set('micResult', {
      deviceLabel: this.currentDevice.label,
      deviceId: this.currentDevice.value,
      result,
    });
    eventBus.$emit('mic-detect-finish');
  }

  private beforeDestroy() {
    clearInterval(this.volumeInterval);
  }
}
</script>
