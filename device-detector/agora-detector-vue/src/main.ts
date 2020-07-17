import { IAgoraRTC } from 'agora-rtc-sdk-ng';
import AgoraDetector from './components/AgoraDetector.vue';
import eventBus from './utils/eventBus';
import { isMobile } from './utils/helper';
import { isAgoraSDK } from './utils/checker';

function install(vue: Vue.VueConstructor, options: { AgoraSDK: IAgoraRTC }): void {
  vue.component('AgoraDetector', AgoraDetector);
  if (!options || !isAgoraSDK(options.AgoraSDK)) {
    throw Error('Agora SDK is invalid. Please provide the correct Agora SDK.');
  }
  (window as any).AgoraSDK = options.AgoraSDK;
  eventBus.$data.getStore().set('agoraSDK', options.AgoraSDK);
  eventBus.$data.getStore().set('isMobile', isMobile());
  eventBus.$data.getStore().get('trackManager').setAgoraSDK(options.AgoraSDK);
}

export { install };
export default { install };
