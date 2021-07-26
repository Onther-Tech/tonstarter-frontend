import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import * as ERC20 from 'services/abis/ERC20.json';
import {DEPLOYED} from 'constants/index';
import {convertNumber} from 'utils/number';

// const {TON_ADDRESS} = DEPLOYED;

export type User = {
  balance: string;
  address: string;
  library: any;
  // tosBalance: string;
};

interface IUser {
  data: User;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    balance: '0',
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IUser;

export const fetchUserInfo = createAsyncThunk(
  'app/user',
  // @ts-ignore
  async ({address, library, reset}, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    if (reset) {
      return initialState;
    }

    // let tonBalance;
    // let tosBalance;

    const contract = getContract(DEPLOYED.TON_ADDRESS, ERC20.abi, library);
    // const TOS = getTokamakContract('TOS');
    // const TosBalance = await TOS.balanceOf(address);

    // await Promise.all([
    //   contract.balanceOf(address),
    //   TOS.balanceOf(address),
    // ]).then((res) => {
    //   tonBalance = res[0];
    //   tosBalance = res[1];
    // });

    const contractIserBalance = await contract.balanceOf(address);
    const balance = convertNumber({amount: String(contractIserBalance)});

    const user: User = {
      address,
      library,
      //@ts-ignore
      balance,
      // balance: tonBalance !== undefined ? formatEther(tonBalance) : '0',
      // tosBalance: tosBalance !== undefined ? formatEther(tosBalance) : '0',
    };

    return user;
  },
);

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUserInfo.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchUserInfo.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchUserInfo.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

// @ts-ignore
export const selectUser = (state: RootState) => state.user;
// @ts-ignore
export const selectBalance = (state: RootState) => state.user.data.balance;
