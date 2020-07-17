import * as React from 'react';
import styles from '../../styles.module.css';
import Select from '../Select';
import { DeviceItem } from '../../types';

interface Props {
  handleClickSwitchYes: Function;
  handleClickSwitchNo: Function;
  btnDisabled: boolean;
  deviceItems: DeviceItem[];
  handleSelectChange: Function;
  currentDevice: DeviceItem;
}
const DeviceSwitch = ({
  handleClickSwitchYes,
  handleClickSwitchNo,
  btnDisabled,
  deviceItems,
  handleSelectChange,
  currentDevice
}: Props) => {
  return (
    <React.Fragment>
      <Select
        items={deviceItems}
        currentDevice={currentDevice}
        change={handleSelectChange}
      />
      <div className={styles['button-group']}>
        <button
          className={styles['button-no'] + ' ' + styles.btn}
          onClick={() => {
            handleClickSwitchNo();
          }}
          disabled={btnDisabled}
        >
          Skip
        </button>
        <button
          className={styles['button-yes'] + ' ' + styles.btn}
          onClick={() => {
            handleClickSwitchYes();
          }}
          disabled={btnDisabled}
        >
          Detect
        </button>
      </div>
    </React.Fragment>
  );
};

export default DeviceSwitch;
