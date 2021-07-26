import {useState} from 'react';

export const useInput = () => {
  const [value, setValue] = useState<any>();
  const onChange = (event: any) => {
    const {target} = event;
    const {value: inputValue} = target;
    const _val = inputValue;
    if (addComma(_val) === undefined) {
      return;
    }
    setValue(addComma(_val));
  };
  return {value, setValue, onChange};
};

const addComma = (inputVal: any) => {
  const _val = inputVal;

  const checkInputVal = () => {
    if (_val.split('.')[1]?.length >= 3) {
      return;
    }
    if (_val.split('.').length > 2) {
      return;
    }
    if (
      _val.split('.')[0]?.length > 1 &&
      _val.split('.')[0]?.substring(0, 1) === '0'
    ) {
      return _val.split('.')[0].substring(1);
    }

    //   return _val.substring(1, 2);
    // }
    if (_val === '.') {
      return _val;
    } else {
      return _val
        .replace(/[^0-9a-zA-Z.]/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  return checkInputVal();
};

export const onKeyDown = (e: any) => {
  const {target, key} = e;
  //@ts-ignore
  const {selectionStart, value} = target;
  const allowedKeys = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '.',
    'Backspace',
    'Delete',
    'ArrowRight',
    'ArrowLeft',
  ];

  //check number or .
  if (allowedKeys.indexOf(key) === -1) {
    e.preventDefault();
  }

  if (key === 'Delete' && value.split('')[selectionStart] === ',') {
    //@ts-ignore
    return (e.target.selectionStart = selectionStart);
  }
  if (key === 'ArrowRight' && value.split('')[selectionStart + 1] === ',') {
    //@ts-ignore
    e.target.selectionStart += 2;
  }
  if (key === 'ArrowLeft' && value.split('')[selectionStart - 2] === ',') {
    //@ts-ignore
    e.target.selectionStart -= 2;
  }
};
