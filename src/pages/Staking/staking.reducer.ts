import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import {BigNumber} from 'ethers';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import {formatEther} from '@ethersproject/units';

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  cap: string;
  saleStartBlock: string | number;
  stakeStartBlock: string | number;
  stakeEndBlock: string | number;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  defiAddr: string;
  stakeContract: string[];
  balance: BigNumber | string;
  totalRewardAmount: BigNumber | string;
  claimRewardAmount: BigNumber | string;
  totalStakers: number | string;
  token: string;
  staketype: string;
};

interface StakeState {
  data: Stake[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({contract, library}: any, {requestId, getState}) => {
    let stakeVaults: any[] = [];

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      await Promise.all(
        vaults.map(async (vault: any) => {
          const stakeVault = await getContract(vault, StakeVault.abi, library);

          const test = await stakeVault.blockTotalReward();
          console.log(test.toString());

          const stakeType = await stakeVault?.stakeType();
          const token = await stakeVault.paytoken();
          const stakeList: string[] = await stakeVault?.stakeAddressesAll();
          stakeVaults = await Promise.all(
            stakeList.map(async (item, index) => {
              let info = await stakeVault.stakeInfos(item);
              console.log(info);

              const stakeInfo: Partial<Stake> = {
                stakeContract: stakeList,
                name: info[0],
                saleStartBlock: 0,
                stakeStartBlock: info[1],
                stakeEndBlock: info[2],
                balance: formatEther(info[3]),
                totalRewardAmount: formatEther(info[4]),
                claimRewardAmount: formatEther(info[5]),
                totalStakers: 0,
                token,
                stakeType,
              };

              return stakeInfo;
            }),
          );
        }),
      );
    }
    return stakeVaults;
  },
);

export const stakeReducer = createSlice({
  name: 'stakes',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStakes.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStakes.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStakes.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const selectStakes = (state: RootState) => state.stakes;
