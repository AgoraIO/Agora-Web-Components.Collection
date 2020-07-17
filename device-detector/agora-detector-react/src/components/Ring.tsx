import * as React from 'react';
import styles from '../styles/ring.module.css';
const Ring = () => {
  return (
    <div className={styles['detector-ring']}>
      <div className={styles['ring-inner']} />
    </div>
  );
};

export default Ring;
