import Vue from 'vue';
import App from './App.vue';
import AgoraRTC from 'agora-rtc-sdk-ng';
import vueDeviceDetector from 'agora-detector-vue';

Vue.config.productionTip = false;

Vue.use(vueDeviceDetector, { AgoraSDK: AgoraRTC });

new Vue({
  render: (h) => h(App),
}).$mount('#app');
