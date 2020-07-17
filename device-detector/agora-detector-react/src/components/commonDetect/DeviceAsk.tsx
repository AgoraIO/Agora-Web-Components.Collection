import * as React from 'react';
import styles from '../../styles.module.css';

interface Props {
  btnDisabled?: boolean;
  handleClickYes: Function;
  handleClickNo: Function;
  askText: string;
}

const DeviceAsk = ({
  btnDisabled,
  handleClickNo,
  handleClickYes,
  askText
}: Props) => {
  return (
    <div className={styles['ask-bottom']}>
      <div className={styles['bottom-common-text']}>{askText}</div>
      <div className={styles['button-group']}>
        <button
          className={styles.btn + ' ' + styles['button-no']}
          onClick={() => {
            handleClickNo();
          }}
          disabled={btnDisabled}
        >
          No
        </button>
        <button
          className={styles.btn + ' ' + styles['button-yes']}
          onClick={() => {
            handleClickYes();
          }}
          disabled={btnDisabled}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default DeviceAsk;
