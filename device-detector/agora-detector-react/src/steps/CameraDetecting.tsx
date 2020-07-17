import * as React from 'react';
import PageContainer from '../components/PageContainer';
import styles from '../styles.module.css';
import eventBus from '../utils/eventBus';
import DeviceSwitch from '../components/commonDetect/DeviceSwitch';
import DeviceDetect from '../components/commonDetect/DeviceDetect';
import { DeviceStepState, DeviceItem } from '../types';
import { wait } from '../utils/helper';
import DeviceAsk from '../components/commonDetect/DeviceAsk';

interface Props {
  deviceStep: DeviceStepState;
  onShowCameraTips: Function;
}

export const CameraDetecting = ({ deviceStep, onShowCameraTips }: Props) => {
  const [currentDevice, setCurrentDevice] = React.useState<DeviceItem>();

  const [deviceItems, setDeviceItems] = React.useState<DeviceItem[]>([]);

  const cameraVideo = React.useRef<HTMLDivElement>(null);

  const [btnDisabled, setBtnDisabled] = React.useState(false);

  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (!eventBus.data.trackManager) {
      throw new Error('trackManager is not found');
    }
    eventBus.data.trackManager.getCameraTrack().then((track) => {
      if (!track) return;
      const cameraTrack = track;
      if (!cameraVideo.current) {
        throw new Error('can not get Video DOM');
      }
      cameraTrack && cameraTrack.play(cameraVideo.current);
    });
    setIsFirstRender(false);
    detectCountDown();
  }, []);

  React.useEffect(() => {
    if (!isFirstRender && deviceStep === 'DETECTING') {
      detectCountDown();
    }
  }, [deviceStep]);

  const handleClickNo = () => {
    eventBus.emit('click-camera-ask-no');
    const cameraResult = eventBus.data.cameraResult;
    if (cameraResult) {
      cameraResult.result = false;
    }
    eventBus.data.cameraResult = cameraResult;
  };

  const handleClickYes = () => {
    eventBus.emit('click-camera-ask-yes');
  };

  const handleClickRetryYes = async () => {
    setBtnDisabled(true);
    eventBus.emit('click-camera-retry-yes');
    try {
      await getDevices();
    } finally {
      setBtnDisabled(false);
    }
  };

  const handleClickRetryNo = () => {
    eventBus.emit('click-camera-retry-no');
  };

  const handleClickSwitchNo = () => {
    eventBus.emit('click-camera-switch-no');
  };

  const handleClickSwitchYes = () => {
    eventBus.emit('click-camera-switch-yes');
  };

  const handleSelectChange = async (item: DeviceItem) => {
    setCurrentDevice(item);
    try {
      setBtnDisabled(true);
      if (!eventBus.data.trackManager) return;
      const cameraTrack = await eventBus.data.trackManager.getCameraTrack();
      if (!cameraTrack)
        throw new Error('cannot find camera track to set device');
      cameraTrack.setDevice(item.value);
    } finally {
      setBtnDisabled(false);
    }
  };

  const getDevices = async () => {
    const AgoraSDK = eventBus.data.agoraSDK;
    if (!AgoraSDK) return;
    let newDeviceItems;
    try {
      const cameraDevices = await AgoraSDK.getCameras();
      newDeviceItems = cameraDevices.map((device) => ({
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
    const cameraTrack = await eventBus.data.trackManager.getCameraTrack();
    const taskList: Promise<any>[] = [wait(2000)];
    cameraTrack &&
      taskList.push(eventBus.data.trackManager.checkCameraTrack(cameraTrack));
    if (!currentDevice || !currentDevice.value) {
      taskList.push(getDevices());
    }
    const [, result, newDeviceItems] = await Promise.all(taskList);
    const newCurrentDevice = newDeviceItems && newDeviceItems[0];
    newCurrentDevice && setCurrentDevice(newCurrentDevice);
    const deviceForResult = newCurrentDevice || currentDevice;
    if (!deviceForResult) {
      throw new Error(
        `check video track failed. currentDevice: ${deviceForResult}, result: ${result}`
      );
    }
    if (!result) {
      onShowCameraTips();
    }
    eventBus.data.cameraResult = {
      deviceLabel: deviceForResult.label,
      deviceId: deviceForResult.value,
      result
    };
    eventBus.emit('camera-detect-finish');
  };

  return (
    <PageContainer
      main={
        <React.Fragment>
          <div className={styles['video-container']} ref={cameraVideo} />
          <div className={styles['tab-title']}>Camera Detection</div>
        </React.Fragment>
      }
      bottom={
        <React.Fragment>
          {deviceStep === 'DETECTING' && <DeviceDetect text='Detecting...' />}
          {deviceStep === 'ASK' && (
            <DeviceAsk
              askText='Can you see the picture?'
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

export default CameraDetecting;
