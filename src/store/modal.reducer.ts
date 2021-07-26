import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

export type ModalType =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'manage'
  | 'stakeL2'
  | 'unstakeL2'
  | 'withdraw'
  | 'swap'
  | 'airdrop';

export type Modal = {
  modal?: ModalType;
  data?: any;
};

type SubModalTypes = 'confirm' | undefined;

type SubModal = {
  type: SubModalTypes;
  data: any;
  isChecked: boolean;
};

interface IModal {
  data: Modal;
  sub: SubModal;
}

type ModalPayload = {
  type: ModalType;
  data?: any;
};

export type SubModalPayload = {
  type: SubModalTypes;
  isChecked?: boolean;
  data?: any;
};

const initialState = {
  data: {
    modal: undefined,
    data: {},
  },
  sub: {
    type: undefined,
    isChecked: false,
    data: {},
  },
} as IModal;

export const modalReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.data.modal = payload.type;
      state.data.data = payload.data;
    },
    closeModal: (state) => {
      state.data.modal = undefined;
      state.data.data = {};
    },
    openConfirm: (state, {payload}: PayloadAction<SubModalPayload>) => {
      state.sub.type = payload.type;
      state.sub.data = payload.data;
    },
    closeConfirmModal: (state) => {
      state.sub.type = undefined;
      state.sub.data = {};
    },
    checkedConfirm: (state) => {
      state.sub.isChecked = true;
    },
    resetConfirm: (state) => {
      state.sub.isChecked = false;
    },
  },
});

export const selectModalType = (state: RootState) => state.modal;
export const {
  openModal,
  closeModal,
  openConfirm,
  closeConfirmModal,
  checkedConfirm,
  resetConfirm,
} = modalReducer.actions;
