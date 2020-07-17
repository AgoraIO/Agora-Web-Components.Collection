import * as React from 'react';
import styles from '../styles/select.module.css';

interface Item {
  label: string | number;
  value: any;
}

interface SelectProps {
  items: Item[];
  change: Function;
  currentDevice: Item;
}

interface DropdownProps {
  items: Item[];
  change: Function;
  hideDropDown: Function;
}

const SelectDropdown = ({ items, change, hideDropDown }: DropdownProps) => {
  const selectDropdown = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener('click', documentClickListener);
    return () => {
      document.removeEventListener('click', documentClickListener);
    };
  }, []);

  const documentClickListener = (e: MouseEvent) => {
    if (!(e as any).path.includes(selectDropdown.current)) {
      hideDropDown();
    }
  };
  return (
    <div
      className={styles['select-dropdown']}
      ref={selectDropdown}
      v-show='showDropdown'
    >
      {items.map((item) => (
        <div
          className={styles['select-dropdown__item']}
          v-for='item in items'
          key={item.value}
          onClick={(e) => {
            change(e, item);
          }}
        >
          <span className={styles['select-text']}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const Select = ({ items, change, currentDevice }: SelectProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleClickSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    stopPropagation(e);
    setShowDropdown(!showDropdown);
  };
  const handleClickSelectItem = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: Item
  ) => {
    stopPropagation(e);
    setShowDropdown(!showDropdown);
    change(item);
  };

  return (
    <div className={styles.select}>
      <div className={styles['select-container']} onClick={handleClickSelect}>
        <div className={styles['select-text']}>{currentDevice.label}</div>
        <div
          className={
            styles['select-arrow'] +
            ' ' +
            (showDropdown && styles['arrow-reverse'])
          }
        >
          <div className={styles['select-arrow-inner']} />
        </div>
        {showDropdown && (
          <SelectDropdown
            items={items}
            hideDropDown={() => {
              setShowDropdown(false);
            }}
            change={handleClickSelectItem}
          />
        )}
      </div>
    </div>
  );
};

export default Select;
