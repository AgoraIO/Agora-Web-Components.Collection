import * as React from 'react';
import InitialPage from '../steps/InitialPage';
import ReportPage from '../steps/ReportPage';
import CameraDetecting from '../steps/CameraDetecting';
import MicDetecting from '../steps/MicDetecting';
import SpeakerDetecting from '../steps/SpeakerDetecting';
import { DetectState, DeviceState, DeviceStepState } from '../types/index';
import styles from '../styles.module.css';

interface Props {
  state: DetectState;
  device: DeviceState;
  deviceStep: DeviceStepState;
}

export const Container = ({ state, device, deviceStep }: Props) => {
  const [showCamTips, setShowCamTips] = React.useState(false);
  const [showMicTips, setShowMicTips] = React.useState(false);

  const micTipsEl = React.useRef<HTMLDivElement>(null);
  const handleShowCameraTips = () => {
    setShowCamTips(true);
    setTimeout(() => {
      setShowCamTips(false);
    }, 3000);
  };

  const handleShowMicTips = () => {
    setShowMicTips(true);
    if (showCamTips) {
      if (micTipsEl.current) micTipsEl.current.style.top = '50px';
    } else {
      if (micTipsEl.current) micTipsEl.current.style.top = '15px';
    }
    setTimeout(() => {
      setShowMicTips(false);
    }, 3000);
  };

  return (
    <div className={styles['detector-container']}>
      {showCamTips && (
        <div className={styles['err-tips']}>
          <div className={styles['err-tips-text']}>
            Your video input is detected as still!
          </div>
        </div>
      )}
      {showMicTips && (
        <div className={styles['err-tips']} ref={micTipsEl}>
          <div className={styles['err-tips-text']}>
            Your volume input is detected too low!
          </div>
        </div>
      )}
      {state === 'IDLE' && <InitialPage />}
      {state === 'FINISH' && <ReportPage />}
      {state === 'DETECTING' && device === 'CAMERA' && (
        <CameraDetecting
          deviceStep={deviceStep}
          onShowCameraTips={handleShowCameraTips}
        />
      )}
      {state === 'DETECTING' && device === 'MICROPHONE' && (
        <MicDetecting
          deviceStep={deviceStep}
          onShowMicTips={handleShowMicTips}
        />
      )}
      {state === 'DETECTING' && device === 'SPEAKER' && (
        <SpeakerDetecting deviceStep={deviceStep} />
      )}
    </div>
  );
};

export default Container;
