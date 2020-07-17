import * as React from 'react';
import PageContainer from '../components/PageContainer';
import styles from '../styles.module.css';
import eventBus from '../utils/eventBus';
import { DetectResults } from '../types/index';
import Successed from '../assets/successed.png';
import Failed from '../assets/failed.png';
import BigCam from '../assets/bigCam.png';
import BigMic from '../assets/bigMic.png';
import BigSpeaker from '../assets/bigSpeaker.png';

export const ReportPage = () => {
  const [results, setResults] = React.useState<DetectResults>();
  React.useEffect(() => {
    if (!eventBus.data.trackManager) {
      return;
    }
    eventBus.data.trackManager.getCameraTrack().then((cameraTrack) => {
      if (cameraTrack) {
        cameraTrack.stop();
        cameraTrack.close();
      }
    });

    eventBus.data.trackManager.getMicrophoneTrack().then((micTrack) => {
      if (micTrack) {
        micTrack.stop();
        micTrack.close();
      }
    });
    eventBus.data.trackManager.getSpeakerTrack().then((speakerTrack) => {
      if (speakerTrack) {
        speakerTrack.stop();
        speakerTrack.close();
      }
    });
    if (!eventBus.data.cameraResult) {
      throw Error('cannot get camera result!');
    }
    if (!eventBus.data.micResult) {
      throw Error('cannot get microphone result!');
    }
    if (!eventBus.data.speakerResult) {
      throw Error('cannot get speaker result!');
    }
    setResults({
      cameraResult: eventBus.data.cameraResult,
      micResult: eventBus.data.micResult,
      speakerResult: eventBus.data.speakerResult
    });
  }, []);

  const handleClickRetryYes = () => {
    eventBus.emit('click-report-retry-yes');
  };

  const handleClickRetryNo = () => {
    eventBus.emit('click-report-retry-no', results);
  };

  return (
    <PageContainer
      main={
        <div className={styles['report-main']}>
          <div className={styles['equip-report']}>
            <div className={styles['equip-head']}>
              <img className={styles['report-img']} src={BigCam} alt='' />
              <div className={styles['equip-title']}>Camera:</div>
            </div>
            <div className={styles['report-list']}>
              {results && results.cameraResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Successed}
                  alt=''
                />
              )}
              {results && !results.cameraResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Failed}
                  alt=''
                />
              )}
              <div className={styles['report-text']}>
                {results && results.cameraResult.deviceLabel}
              </div>
            </div>
          </div>
          <div className={styles['equip-report']}>
            <div className={styles['equip-head']}>
              <img className={styles['report-img']} src={BigMic} alt='' />
              <div className={styles['equip-title']}>Mic:</div>
            </div>
            <div className={styles['report-list']}>
              {results && results.micResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Successed}
                  alt=''
                />
              )}
              {results && !results.micResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Failed}
                  alt=''
                />
              )}
              <div className={styles['report-text']}>
                {results && results.micResult.deviceLabel}
              </div>
            </div>
          </div>
          <div className={styles['equip-report']}>
            <div className={styles['equip-head']}>
              <img className={styles['report-img']} src={BigSpeaker} alt='' />
              <div className={styles['equip-title']}>Speaker:</div>
            </div>
            <div className={styles['report-list']}>
              {results && results.speakerResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Successed}
                  alt=''
                />
              )}
              {results && !results.speakerResult.result && (
                <img
                  className={styles['report-list-img']}
                  src={Failed}
                  alt=''
                />
              )}
              <div className={styles['report-text']}>
                {results && results.speakerResult.deviceLabel}
              </div>
            </div>
            <div className={styles['speaker-report']} />
          </div>
        </div>
      }
      bottom={
        <div className={styles['retry-bottom']}>
          <div className={styles['bottom-common-text']}>
            Do you want to redetect?
          </div>
          <div className={styles['button-group']}>
            <button
              className={styles['button-no'] + ' ' + styles.btn}
              onClick={() => {
                handleClickRetryYes();
              }}
            >
              Try again
            </button>
            <button
              className={styles['button-yes'] + ' ' + styles.btn}
              onClick={() => {
                handleClickRetryNo();
              }}
            >
              Close
            </button>
          </div>
        </div>
      }
    />
  );
};

export default ReportPage;
