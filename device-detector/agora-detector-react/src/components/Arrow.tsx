import * as React from 'react';
import styles from '../styles/arrow.module.css';

export const Arrow = () => {
  return (
    <div className={styles['detector-arrow']}>
      <div className={styles['arrow-inner']} />
    </div>
  );
};

export default Arrow;
