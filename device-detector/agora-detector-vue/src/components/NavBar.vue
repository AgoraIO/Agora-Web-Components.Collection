<template>
  <div :class="$style['detector-navbar']">
    <div :class="$style['navbar-banner']" v-if="state==='IDLE'">
      Will detect your following devices</div>
    <div :class="$style['navbar-banner']" v-else-if="state==='FINISH'">
      Detection Report</div>
    <template v-else v-for="(item) in tabItems">
      <div :class="{
          [$style['detector-navbar-tab']]: true,
          [$style.isActive]: currentOrder === item.order,
        }" :key="item.order + 'tab'">
        <div :class="$style['tab-order']">{{item.order}}</div>
        <div :class="$style['tab-text']">{{item.text}}</div>
      </div>
      <Arrow v-if="item.order !== 3" :key="item.order + 'arrow'"></Arrow>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Arrow from './Arrow.vue';

@Component({
  components: {
    Arrow,
  },
})
export default class NavBar extends Vue {
  @Prop() private state!: string;

  @Prop() private device!: string;

  private get currentOrder() {
    if (this.state !== 'DETECTING') {
      return 0;
    }
    if (this.device === 'CAMERA') {
      return 1;
    }
    if (this.device === 'MICROPHONE') {
      return 2;
    }
    if (this.device === 'SPEAKER') {
      return 3;
    }
    return 0;
  }

  private tabItems = [
    {
      order: 1,
      text: 'Camera',
    }, {
      order: 2,
      text: 'Microphone',
    }, {
      order: 3,
      text: 'Speaker',
    },
  ]
}
</script>

<style module>
.navbar-banner {
  height:22px;
  font-size:16px;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:22px;
}
.detector-navbar {
  display: flex;
  width: 100%;
  align-items: center;
  flex: 0 0 60px;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
}
.detector-navbar-tab {
  display: flex;
  align-items: center;
  color: #9FAAB8;
  /* flex: 1 1; */
  /* justify-content: space-around; */
}
.detector-navbar-tab.isActive {
  color: #367EAD;
}
.tab-order, .tab-text {
  display: inline-block;
  vertical-align: middle;
}
.detector-navbar-tab.isActive .tab-order {
  border:1px solid rgba(54,126,173,1);
}
.tab-order {
  width: 22px;
  height: 22px;
  border:1px solid #9FAAB8;;
  border-radius: 100%;
  text-align: center;
  flex-shrink: 0;
  font-size: 16px;
  font-family: Sans-serif;
}

.tab-text {
  margin-left: 14px;
  font-size: 16px;
  line-height: 22px;
}
</style>
