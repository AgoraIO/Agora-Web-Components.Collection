import * as React from 'react';
import styles from '../styles.module.css';
interface Props {
  main: JSX.Element;
  bottom: JSX.Element;
}
const PageContainer = ({ main, bottom }: Props) => {
  return (
    <div className={styles['detector-container']}>
      <div className={styles['detector-main']}>{main}</div>
      <div className={styles['detector-bottom']}>{bottom}</div>
    </div>
  );
};

export default PageContainer;
