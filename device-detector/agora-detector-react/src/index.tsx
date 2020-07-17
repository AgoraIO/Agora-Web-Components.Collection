import * as React from 'react';
import styles from './styles.module.css';
import NavBar from './components/NavBar';
import Container from './components/Container';
import {
  DetectState,
  DeviceState,
  DeviceStepState,
  DetectResults
} from './types';
import { isAgoraSDK, isMobile as getAgentIsMobile } from './utils/helper';
import { IAgoraRTC } from 'agora-rtc-sdk-ng';
import eventBus from './utils/eventBus';
import trackManager from './utils/trackManager';

interface Props {
  width?: string;
  height?: string;
  AgoraSDK: IAgoraRTC;
  onComplete: (result: DetectResults) => void;
}

export const AgoraDetector = ({
  width,
  height,
  AgoraSDK,
  onComplete
}: Props) => {
  const [state, setState] = React.useState<DetectState>('IDLE');
  const [device, setDevice] = React.useState<DeviceState>('CAMERA');
  const [deviceStep, setDeviceStep] = React.useState<DeviceStepState>(
    'DETECTING'
  );
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (!isAgoraSDK(AgoraSDK)) {
      throw Error(
        'Agora SDK is invalid. Please provide the correct Agora SDK.'
      );
    }
    trackManager.setAgoraSDK(AgoraSDK);
    eventBus.data.trackManager = trackManager;
    eventBus.data.agoraSDK = AgoraSDK;
    eventBus.data.isMobile = getAgentIsMobile();
    setIsMobile(eventBus.data.isMobile);
    eventBus.on('click-start', () => {
      setState('DETECTING');
      setDevice('CAMERA');
      setDeviceStep('DETECTING');
    });
    eventBus.on('camera-detect-finish', () => {
      setDeviceStep('ASK');
    });
    eventBus.on('mic-detect-finish', () => {
      setDeviceStep('ASK');
    });
    eventBus.on('click-camera-ask-yes', () => {
      setDevice('MICROPHONE');
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-camera-ask-no', () => {
      setDeviceStep('RETRY');
    });
    eventBus.on('click-camera-retry-no', () => {
      setDevice('MICROPHONE');
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-camera-retry-yes', () => {
      setDeviceStep('SWITCH');
    });
    eventBus.on('click-camera-switch-no', () => {
      setDevice('MICROPHONE');
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-camera-switch-yes', () => {
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-mic-ask-yes', () => {
      setDevice('SPEAKER');
      setDeviceStep('ASK');
    });
    eventBus.on('click-mic-ask-no', () => {
      setDeviceStep('RETRY');
    });
    eventBus.on('click-mic-retry-yes', () => {
      setDeviceStep('SWITCH');
    });
    eventBus.on('click-mic-retry-no', () => {
      setDevice('SPEAKER');
      setDeviceStep('ASK');
    });
    eventBus.on('click-mic-switch-no', () => {
      setDevice('SPEAKER');
      setDeviceStep('ASK');
    });
    eventBus.on('click-mic-switch-yes', () => {
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-speaker-ask-no', () => {
      setDeviceStep('RETRY');
    });
    eventBus.on('click-speaker-ask-yes', () => {
      setState('FINISH');
    });
    eventBus.on('click-speaker-retry-no', () => {
      setState('FINISH');
    });
    eventBus.on('click-speaker-retry-yes', () => {
      setDeviceStep('ASK');
    });
    eventBus.on('click-report-retry-yes', () => {
      setState('IDLE');
      setDevice('CAMERA');
      setDeviceStep('DETECTING');
    });
    eventBus.on('click-report-retry-no', (report: DetectResults) => {
      onComplete(report);
    });
  }, []);
  const size = {
    width: width || '580px',
    height: height || '520px'
  };
  return (
    <div
      className={styles['agora-device-detector']}
      style={
        isMobile
          ? {
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              paddingBottom: '80px'
            }
          : size
      }
    >
      <NavBar state={state} device={device} />
      <Container state={state} device={device} deviceStep={deviceStep} />
    </div>
  );
};

export { DetectResults };

export default AgoraDetector;
