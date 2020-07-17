<template>
  <PageContainer>
    <template v-slot:main>
        <div :class="styles['mic-speaker-title']">Speaker Detection</div>
        <div :class="styles['img-and-volume']">
          <div :class="styles['detecting-img']">
            <img :class="styles['circle-img']"
              src="../assets/bigSpeaker.png">
          </div>
          <Volume :class="styles['mic-volume']"
            :length="180" :currentLevel="volumeLevel"></Volume>
        </div>
    </template>
    <template v-slot:bottom>
      <DeviceDetect
        v-if="deviceStep==='DETECTING'"
        text="Playing music..."
      />
      <DeviceAsk v-else-if="deviceStep==='ASK'"
        askText="Can you hear the beeps?"
        @handleClickNo="handleClickNo"
        @handleClickYes="handleClickYes"
        :btnDisabled="btnDisabled"
      />
      <DeviceAsk v-else-if="deviceStep==='RETRY'"
        askText="Do you want to redetect?"
        @handleClickNo="handleClickRetryNo"
        @handleClickYes="handleClickRetryYes"
      />
    </template>
  </PageContainer>
</template>

<script lang="ts">
import { IBufferSourceAudioTrack } from 'agora-rtc-sdk-ng';
import { Component, Vue, Prop } from 'vue-property-decorator';
import eventBus from '../utils/eventBus';
import Ring from '../components/Ring.vue';
import PageContainer from '../components/PageContainer.vue';
import Volume from '../components/Volume.vue';
import { SelectItem } from '../types/types';
import Select from '../components/Select.vue';
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
export default class SpeakerDetecting extends Vue {
  @Prop() private state!: string;

  @Prop() private deviceStep!: string;

  private volumeInterval = 0;

  private volumeLevel = 0;

  private micDevices: MediaDeviceInfo[] = [];

  private currentDevice: SelectItem = { value: 'Null', label: 'Null' };

  private styles = styles;

  get deviceItems(): SelectItem[] {
    return this.micDevices.map((device) => ({
      value: device.deviceId,
      label: device.label,
    }));
  }

  private btnDisabled = false;

  private handleClickNo() {
    eventBus.$emit('click-speaker-ask-no');
    eventBus.$data.getStore().set('speakerResult', { result: false, deviceLabel: 'Default speaker', deviceId: '' });
  }

  private handleClickYes() {
    eventBus.$emit('click-speaker-ask-yes');
    eventBus.$data.getStore().set('speakerResult', { result: true, deviceLabel: 'Default speaker', deviceId: '' });
  }

  private handleClickRetryNo() {
    eventBus.$emit('click-speaker-retry-no');
  }

  private async handleClickRetryYes() {
    eventBus.$emit('click-speaker-retry-yes');
  }

  private async mounted() {
    const speakerTrack = await eventBus.$data.getStore().get('trackManager').getSpeakerTrack() as IBufferSourceAudioTrack;
    if (!speakerTrack) {
      return;
    }
    speakerTrack.startProcessAudioBuffer({ loop: true });
    speakerTrack.play();
    this.volumeInterval = setInterval(() => {
      this.volumeLevel = speakerTrack.getVolumeLevel();
    }, 200);
  }

  private async beforeDestroy() {
    clearInterval(this.volumeInterval);
    const speakerTrack = await eventBus.$data.getStore().get('trackManager').getSpeakerTrack() as IBufferSourceAudioTrack;
    speakerTrack.stop();
    speakerTrack.stopProcessAudioBuffer();
  }
}
</script>

<style>
.text-title {
  position: absolute;
  left: 30px;
  top: 30px;
  height:22px;
  font-size:16px;
  font-weight:400;
  color:rgba(92,103,116,1);
  line-height: 22px;
  text-align: center;
}
.video-container {
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

.mic-ask-bottom {
  width: 100%;
  height: 100%;
}
.camera-button-group {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}
.camera-button-group .button-yes {
  margin-left: 10px;
}

.detecting-img {
  text-align: center;
  margin-top: 91px;
}

.mic-volume {
  margin: 0 auto;
  margin-top: 30px;
}

.camera-switch-bottom {
  width: 100%;
  height: 100%;
}
.camera-select {
  margin: 0 auto;
  margin-top: 15px;
}
.camera-switch-bottom .camera-button-group {
  margin-top: 15px;
}
</style>
