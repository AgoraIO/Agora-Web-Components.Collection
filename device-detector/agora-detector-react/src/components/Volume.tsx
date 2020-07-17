import * as React from 'react';
import styles from '../styles/volume.module.css';
interface Props {
  currentLevel: number;
  length: number;
}
const Volume = ({ currentLevel, length }: Props) => {
  const [barNumArr, setBarNumArr] = React.useState<number[]>([]);
  React.useEffect(() => {
    const barNum = Math.floor(length / 6 + 0.5);
    const arr = [];
    for (let i = 0; i < barNum; i += 1) {
      arr[i] = i;
    }
    setBarNumArr(arr);
  }, []);
  return (
    <div className={styles['detector-volume']}>
      {barNumArr.map((n) => (
        <div
          className={
            styles['volume-block'] +
            ' ' +
            (n / barNumArr.length < currentLevel ? styles['volume-active'] : '')
          }
          key={n}
        />
      ))}
      {/* <div :class="{ 'volume-block': true, 'active': i / barNumArr.length < currentLevel }"
        v-for="(n, i) in barNumArr" :key="i"></div> */}
    </div>
  );
};

export default Volume;
