import * as React from 'react';
import styles from '../styles.module.css';
import PageContainer from '../components/PageContainer';
import Volume from '../components/Volume';
import eventBus from '../utils/eventBus';
import DeviceAsk from '../components/commonDetect/DeviceAsk';
import DeviceDetect from '../components/commonDetect/DeviceDetect';
import bigSpeaker from '../assets/bigSpeaker.png';
import { IBufferSourceAudioTrack } from 'agora-rtc-sdk-ng';

interface Props {
  deviceStep: string;
}
export const SpeakerDetecting = ({ deviceStep }: Props) => {
  const [volumeLevel, setVolumeLevel] = React.useState<number>();

  React.useEffect(() => {
    if (!eventBus.data.trackManager) {
      throw new Error('TrackManager is not found.');
    }
    let volumeInterval: any;
    let bfTrack: IBufferSourceAudioTrack;
    eventBus.data.trackManager.getSpeakerTrack().then((track) => {
      if (!track) throw new Error('Speaker track is not found.');
      bfTrack = track;
      track.startProcessAudioBuffer({ loop: true });
      track.play();
      volumeInterval = setInterval(() => {
        setVolumeLevel(track.getVolumeLevel());
      }, 200);
    });
    return () => {
      bfTrack.stop();
      clearInterval(volumeInterval);
    };
  }, []);

  const handleClickNo = () => {
    eventBus.emit('click-speaker-ask-no');
    eventBus.data.speakerResult = {
      result: false,
      deviceLabel: 'Default speaker',
      deviceId: ''
    };
  };

  const handleClickYes = () => {
    eventBus.emit('click-speaker-ask-yes');
    eventBus.data.speakerResult = {
      result: true,
      deviceLabel: 'Default speaker',
      deviceId: ''
    };
  };

  const handleClickRetryNo = () => {
    eventBus.emit('click-speaker-retry-no');
  };

  const handleClickRetryYes = () => {
    eventBus.emit('click-speaker-retry-yes');
  };

  return (
    <PageContainer
      main={
        <React.Fragment>
          <div className={styles['mic-speaker-title']}>Speaker Detection</div>
          <div className={styles['img-and-volume']}>
            <div className={styles['detecting-img']}>
              <img className={styles['circle-img']} src={bigSpeaker} />
            </div>
            <Volume length={180} currentLevel={volumeLevel || 0} />
          </div>
        </React.Fragment>
      }
      bottom={
        <React.Fragment>
          {deviceStep === 'DETECTING' && (
            <DeviceDetect text='Playing music...' />
          )}
          {deviceStep === 'ASK' && (
            <DeviceAsk
              handleClickNo={handleClickNo}
              handleClickYes={handleClickYes}
              askText='Can you hear the beeps?'
            />
          )}
          {deviceStep === 'RETRY' && (
            <DeviceAsk
              handleClickNo={handleClickRetryNo}
              handleClickYes={handleClickRetryYes}
              askText='Do you want to redetect?'
            />
          )}
        </React.Fragment>
      }
    />
  );
};

export default SpeakerDetecting;
