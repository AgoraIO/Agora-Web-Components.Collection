import * as React from 'react';
import PageContainer from '../components/PageContainer';
import styles from '../styles.module.css';
import CameraImg from '../assets/shadowCam.png';
import MicImg from '../assets/shadowMic.png';
import SpeakerImg from '../assets/shadowSpeaker.png';
import eventBus from '../utils/eventBus';

export const InitialPage = () => {
  const handleClickStart = () => {
    eventBus.emit('click-start');
    eventBus.data.trackManager && eventBus.data.trackManager.createTracks();
  };

  const InitialMain = () => (
    <div className={styles['initial-main']}>
      <img className={styles['start-img']} src={CameraImg} alt='' />
      <img className={styles['start-img']} src={MicImg} alt='' />
      <img className={styles['start-img']} src={SpeakerImg} alt='' />
    </div>
  );

  const InitialBottom = () => (
    <div className={styles['initial-bottom']}>
      <button
        className={styles['start-btn'] + ' ' + styles.btn}
        onClick={handleClickStart}
      >
        Start
      </button>
    </div>
  );
  return <PageContainer main={<InitialMain />} bottom={<InitialBottom />} />;
};

export default InitialPage;
