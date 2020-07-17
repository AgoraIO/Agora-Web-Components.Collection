import Vue from 'vue';
import AgoraRTC from 'agora-rtc-sdk-ng';
import App from './App.vue';
import vueDeviceDetector from '../src/main';

Vue.config.productionTip = false;

Vue.use(vueDeviceDetector, { AgoraSDK: AgoraRTC });

new Vue({
  render: (h) => h(App),
}).$mount('#app');
