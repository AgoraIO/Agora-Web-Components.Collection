import * as React from 'react';
import Ring from '../Ring';
import styles from '../../styles.module.css';

interface Props {
  text: string;
}

const DeviceDetect = ({ text }: Props) => (
  <div className={styles['detecting-bottom']}>
    <div className={styles['detecting-text']}>
      <Ring />
      <span>{text}</span>
    </div>
  </div>
);

export default DeviceDetect;
