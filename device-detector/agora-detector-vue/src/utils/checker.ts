import { IAgoraRTC } from 'agora-rtc-sdk-ng';

export function isAgoraSDK(sdk: IAgoraRTC): boolean {
  return !!(sdk.VERSION
  && sdk.checkSystemRequirements
  && sdk.createBufferSourceAudioTrack
  && sdk.createCameraVideoTrack
  && sdk.createChannelMediaRelayConfiguration
  && sdk.createClient
  && sdk.createCustomAudioTrack
  && sdk.createCustomVideoTrack
  && sdk.createMicrophoneAndCameraTracks
  && sdk.createMicrophoneAudioTrack
  && sdk.createScreenVideoTrack
  && sdk.disableLogUpload
  && sdk.enableLogUpload
  && sdk.getCameras
  && sdk.getDevices
  && sdk.getElectronScreenSources
  && sdk.getMicrophones
  && sdk.getSupportedCodec
  && sdk.setLogLevel);
}

export function emptyChecker() {
  return true;
}
