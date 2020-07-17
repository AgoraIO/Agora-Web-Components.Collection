<template>
  <PageContainer>
    <template v-slot:main>
      <div :class="styles['report-main']">
        <div :class="styles['equip-report']">
          <div :class="styles['equip-head']">
            <img :class="styles['report-img']"
              src="../assets/bigCam.png" alt="">
            <div :class="styles['equip-title']">Camera:</div>
          </div>
          <div :class="styles['report-list']">
            <img :class="styles['report-list-img']"
              src="../assets/successed.png"
              v-if="results && results.cameraResult.result"
              alt="">
            <img :class="styles['report-list-img']"
              src="../assets/failed.png"
              v-else
              alt="">
            <div :class="styles['report-text']">
              {{results && results.cameraResult.deviceLabel}}</div>
          </div>
        </div>
        <div :class="styles['equip-report']">
          <div :class="styles['equip-head']">
            <img :class="styles['report-img']"
              src="../assets/bigMic.png" alt="">
            <div :class="styles['equip-title']">Mic:</div>
          </div>
          <div :class="styles['report-list']">
            <img :class="styles['report-list-img']"
              src="../assets/successed.png"
              v-if="results && results.micResult.result"
              alt="">
            <img :class="styles['report-list-img']"
              src="../assets/failed.png"
              v-else
              alt="">
            <div :class="styles['report-text']">
              {{results && results.micResult.deviceLabel}}</div>
          </div>
        </div>
        <div :class="styles['equip-report']">
          <div :class="styles['equip-head']">
            <img :class="styles['report-img']"
              src="../assets/bigSpeaker.png" alt="">
            <div :class="styles['equip-title']">Speaker:</div>
          </div>
          <div :class="styles['report-list']">
            <img :class="styles['report-list-img']"
              src="../assets/successed.png"
              v-if="results && results.speakerResult.result"
              alt="">
            <img :class="styles['report-list-img']"
              src="../assets/failed.png"
              v-else
              alt="">
            <div :class="styles['report-text']">
              {{results && results.speakerResult.deviceLabel}}</div>
          </div>
          <div :class="styles['speaker-report']"></div>
        </div>
      </div>
    </template>
    <template v-slot:bottom>
      <div :class="styles['retry-bottom']">
        <div :class="styles['bottom-common-text']">Do you want to redetect?</div>
        <div :class="styles['button-group']">
          <button :class="styles['button-no'] + ' ' + styles.btn"
            @click="handleClickRetryYes">Try again</button>
          <button :class="styles['button-yes'] + ' ' + styles.btn"
            @click="handleClickRetryNo">Close</button>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script lang="ts">
import { IBufferSourceAudioTrack, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Component, Vue } from 'vue-property-decorator';
import eventBus from '../utils/eventBus';
import Ring from '../components/Ring.vue';
import PageContainer from '../components/PageContainer.vue';
import Volume from '../components/Volume.vue';
import Select from '../components/Select.vue';
import { DetectResults } from '../types/types';
import styles from '../styles.module.css';

@Component({
  components: {
    Ring,
    Volume,
    Select,
    PageContainer,
  },
})
export default class ResultPage extends Vue {
  private results: DetectResults | null = null;

  private styles = styles;

  async mounted() {
    const micResult = eventBus.$data.getStore().get('micResult');
    const cameraResult = eventBus.$data.getStore().get('cameraResult');
    const speakerResult = eventBus.$data.getStore().get('speakerResult');
    this.results = { micResult, cameraResult, speakerResult };

    const cameraTrack = await eventBus.$data.getStore().get('trackManager').getCameraTrack() as ICameraVideoTrack;
    if (cameraTrack) {
      cameraTrack.stop();
      cameraTrack.close();
    }
    const micTrack = await eventBus.$data.getStore().get('trackManager').getMicrophoneTrack() as IMicrophoneAudioTrack;
    if (micTrack) {
      micTrack.stop();
      micTrack.close();
    }
    const speakerTrack = await eventBus.$data.getStore().get('trackManager').getSpeakerTrack() as IBufferSourceAudioTrack;
    if (speakerTrack) {
      speakerTrack.stop();
      speakerTrack.close();
    }
  }

  handleClickRetryYes() {
    eventBus.$emit('click-report-retry-yes');
  }

  handleClickRetryNo() {
    const micResult = eventBus.$data.getStore().get('micResult');
    const cameraResult = eventBus.$data.getStore().get('cameraResult');
    const speakerResult = eventBus.$data.getStore().get('speakerResult');
    eventBus.$emit('click-report-retry-no', { micResult, cameraResult, speakerResult });
  }
}
</script>

<style>
.report-main {
  padding: 10% 10%;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}
.report-img {
  width: 38px;
  height: 38px;
  display: inline-block;
  vertical-align: middle;
}
.equip-title {
  height:22px;
  font-size:16px;
  font-weight:400;
  color:rgba(92,103,116,1);
  line-height:22px;
  display: inline-block;
  vertical-align: middle;
}
.equip-head {
  margin-right: 17px;
  flex-shrink: 0;
}
.equip-report {
  display: flex;
  align-items: center;
  overflow: hidden;

}
.report-list {
  flex: 1 1;
  height:20px;
  font-size:14px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:20px;
  overflow: hidden;
}
.report-list-img {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.report-text {
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}
</style>
