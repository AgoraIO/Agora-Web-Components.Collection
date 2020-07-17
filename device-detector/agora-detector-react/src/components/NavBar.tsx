import * as React from 'react';
import Arrow from './Arrow';
import styles from '../styles/navbar.module.css';

interface Props {
  state: string;
  device: string;
}
export const NavBar = ({ state, device }: Props) => {
  const tabItems = [
    { order: 1, text: 'Camera' },
    { order: 2, text: 'Microphone' },
    { order: 3, text: 'Speaker' }
  ];

  const ShowArrow = ({ order }: { order: number }) => {
    if (order === 3) return null;
    return <Arrow />;
  };

  function currentOrder() {
    if (state !== 'DETECTING') {
      return 0;
    }
    if (device === 'CAMERA') {
      return 1;
    }
    if (device === 'MICROPHONE') {
      return 2;
    }
    if (device === 'SPEAKER') {
      return 3;
    }
    return 0;
  }

  if (state === 'IDLE')
    return (
      <div className={styles['detector-navbar']}>
        <div className={styles['navbar-banner']}>
          Will detect your following devices
        </div>
      </div>
    );
  else if (state === 'FINISH')
    return (
      <div className={styles['detector-navbar']}>
        <div className={styles['navbar-banner']}>Detection Report</div>
      </div>
    );
  else
    return (
      <div className={styles['detector-navbar']}>
        {tabItems.map((item) => (
          <React.Fragment key={item.order}>
            <div
              className={
                styles['detector-navbar-tab'] +
                ' ' +
                (currentOrder() === item.order ? styles.isActive : '')
              }
            >
              <div className={styles['tab-order']}>{item.order}</div>
              <div className={styles['tab-text']}>{item.text}</div>
            </div>
            <ShowArrow order={item.order} />
          </React.Fragment>
        ))}
      </div>
    );
};

export default NavBar;
