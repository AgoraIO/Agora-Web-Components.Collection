import * as React from 'react';
import PageContainer from '../components/PageContainer';
import styles from '../styles.module.css';
import eventBus from '../utils/eventBus';
import Volume from '../components/Volume';
import bigMic from '../assets/bigMic.png';
import DeviceAsk from '../components/commonDetect/DeviceAsk';
import DeviceSwitch from '../components/commonDetect/DeviceSwitch';
import DeviceDetect from '../components/commonDetect/DeviceDetect';
import { DeviceStepState, DeviceItem } from '../types';
import { wait } from '../utils/helper';

interface Props {
  deviceStep: DeviceStepState;
  onShowMicTips: Function;
}

export const MicDetecting = ({ deviceStep, onShowMicTips }: Props) => {
  const [currentDevice, setCurrentDevice] = React.useState<DeviceItem>();

  const [deviceItems, setDeviceItems] = React.useState<DeviceItem[]>([]);

  const [volumeLevel, setVolumeLevel] = React.useState<number>();

  const [btnDisabled, setBtnDisabled] = React.useState(false);

  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (!eventBus.data.trackManager) {
      throw new Error('trackManager is not found');
    }
    let volumeInterval: any;
    eventBus.data.trackManager.getMicrophoneTrack().then((track) => {
      if (!track) return;
      const micTrack = track;
      volumeInterval = setInterval(() => {
        setVolumeLevel(micTrack.getVolumeLevel());
      }, 200);
      // micTrack && micTrack.play();
    });
    setIsFirstRender(false);
    detectCountDown();
    return () => {
      clearInterval(volumeInterval);
    };
  }, []);

  React.useEffect(() => {
    if (!isFirstRender && deviceStep === 'DETECTING') {
      detectCountDown();
    }
  }, [deviceStep]);

  const handleClickNo = () => {
    eventBus.emit('click-mic-ask-no');
    const micResult = eventBus.data.micResult;
    if (micResult) {
      micResult.result = false;
    }
    eventBus.data.micResult = micResult;
  };

  const handleClickYes = () => {
    eventBus.emit('click-mic-ask-yes');
  };

  const handleClickRetryYes = async () => {
    setBtnDisabled(true);
    eventBus.emit('click-mic-retry-yes');
    try {
      await getDevices();
    } finally {
      setBtnDisabled(false);
    }
  };

  const handleClickRetryNo = () => {
    eventBus.emit('click-mic-retry-no');
  };

  const handleSelectChange = async (item: DeviceItem) => {
    setCurrentDevice(item);
    try {
      setBtnDisabled(true);
      if (!eventBus.data.trackManager) return;
      const micTrack = await eventBus.data.trackManager.getMicrophoneTrack();
      if (!micTrack) throw new Error('cannot find mic track to set device');
      micTrack.setDevice(item.value);
    } finally {
      setBtnDisabled(false);
    }
  };

  const handleClickSwitchNo = () => {
    eventBus.emit('click-mic-switch-no');
  };

  const handleClickSwitchYes = () => {
    eventBus.emit('click-mic-switch-yes');
  };

  const getDevices = async () => {
    const AgoraSDK = eventBus.data.agoraSDK;
    if (!AgoraSDK) return;
    let newDeviceItems;
    try {
      const micDevices = await AgoraSDK.getMicrophones();
      newDeviceItems = micDevices.map((device) => ({
        value: device.deviceId,
        label: device.label
      }));
      setDeviceItems(newDeviceItems);
    } catch (e) {
      console.error(e);
    }
    return newDeviceItems;
  };

  const detectCountDown = async () => {
    if (!eventBus.data.trackManager) return;
    const micTrack = await eventBus.data.trackManager.getMicrophoneTrack();
    const taskList: Promise<any>[] = [wait(2000)];
    micTrack &&
      taskList.push(eventBus.data.trackManager.checkMicTrack(micTrack));
    if (!currentDevice || !currentDevice.value) {
      taskList.push(getDevices());
    }
    const [, result, newDeviceItems] = await Promise.all(taskList);
    const newCurrentDevice = newDeviceItems && newDeviceItems[0];
    newCurrentDevice && setCurrentDevice(newCurrentDevice);
    const deviceForResult = newCurrentDevice || currentDevice;
    if (!deviceForResult) {
      throw new Error(
        `check audio track failed. currentDevice: ${deviceForResult}, result: ${result}`
      );
    }
    if (!result) {
      onShowMicTips();
    }
    eventBus.data.micResult = {
      deviceLabel: deviceForResult.label,
      deviceId: deviceForResult.value,
      result
    };
    eventBus.emit('mic-detect-finish');
  };

  return (
    <PageContainer
      main={
        <React.Fragment>
          <div className={styles['mic-speaker-title']}>
            Microphone Detection
          </div>
          <div className={styles['img-and-volume']}>
            <div className={styles['detecting-img']}>
              <img className={styles['circle-img']} src={bigMic} />
            </div>
            <Volume length={180} currentLevel={volumeLevel || 0} />
          </div>
        </React.Fragment>
      }
      bottom={
        <React.Fragment>
          {deviceStep === 'DETECTING' && (
            <DeviceDetect text='Say something to the microphone...' />
          )}
          {deviceStep === 'ASK' && (
            <DeviceAsk
              askText='Can you see the volume bar change as you speak?'
              handleClickNo={handleClickNo}
              handleClickYes={handleClickYes}
            />
          )}
          {deviceStep === 'RETRY' && (
            <DeviceAsk
              askText='Do you want to replace the device and redetect?'
              handleClickYes={handleClickRetryYes}
              handleClickNo={handleClickRetryNo}
            />
          )}
          {deviceStep === 'SWITCH' && (
            <DeviceSwitch
              handleClickSwitchNo={handleClickSwitchNo}
              handleClickSwitchYes={handleClickSwitchYes}
              btnDisabled={btnDisabled}
              deviceItems={deviceItems}
              handleSelectChange={handleSelectChange}
              currentDevice={currentDevice || { value: null, label: 'null' }}
            />
          )}
        </React.Fragment>
      }
    />
  );
};

export default MicDetecting;
