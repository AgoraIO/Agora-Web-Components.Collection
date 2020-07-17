<template>
  <PageContainer>
    <template v-slot:main>
      <div :class="styles['initial-main']">
        <img :class="styles['start-img']" src="../assets/shadowCam.png" alt="">
        <img :class="styles['start-img']" src="../assets/shadowMic.png" alt="">
        <img :class="styles['start-img']" src="../assets/shadowSpeaker.png" alt="">
      </div>
    </template>
    <template v-slot:bottom>
      <div :class="styles['initial-bottom']">
        <button :class="styles['start-btn'] + ' ' + styles.btn" @click="handleClickStart">
          Start</button>
      </div>
    </template>
  </PageContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import eventBus from '../utils/eventBus';
import Ring from '../components/Ring.vue';
import PageContainer from '../components/PageContainer.vue';
import styles from '../styles.module.css';

@Component({
  components: {
    Ring,
    PageContainer,
  },
})
export default class CameraAsk extends Vue {
  @Prop() private state!: string;

  private styles = styles;

  private handleClickStart() {
    eventBus.$emit('click-start');
    eventBus.$data.getStore().get('trackManager').createTracks();
  }
}
</script>

<style>
  .start-img {
    width: 98px;
    height: 98px;
  }
  .start-btn {
    width:160px;
    height:40px;
  }
  .initial-main {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    padding: 0 30px;
  }
  .initial-bottom {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
