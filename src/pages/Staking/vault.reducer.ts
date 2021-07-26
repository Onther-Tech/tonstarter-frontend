import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {convertNumber} from 'utils/number';
import {fetchValutURL} from 'constants/index';

type Vault = {
  // address: AddressDetail;
  // tosBalance: string;
  cap: number;
  stakeStartBlock: number;
  stakeEndBlock: number;
  expectedStakeEndBlockTotal: [{block: number; stakedTotalString: string}];
  vault: string;
  saleClosed: boolean;
  stakeInfos: [];
};

type VaultList = [Vault];

interface IStakeDetail {
  data: Vault;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {},
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IStakeDetail;

const getEarningPerBlock = (vaults: VaultList) => {
  const result: any = {};
  vaults.map((vault) => {
    const {
      stakeStartBlock,
      stakeEndBlock,
      cap,
      expectedStakeEndBlockTotal,
      vault: vaultAddress,
      saleClosed,
      stakeInfos,
    } = vault;
    let acc = 0;
    let period: any = {};
    const totalBlocks = stakeEndBlock - stakeStartBlock;
    const totalReward = convertNumber({
      amount: cap.toLocaleString('fullwide', {useGrouping: false}),
    });
    const epb = Number(totalReward) / totalBlocks;

    const res = expectedStakeEndBlockTotal.map(
      (project: any, index: number) => {
        if (index !== 0) {
          const ept =
            ((project.block - expectedStakeEndBlockTotal[index - 1].block) *
              epb) /
            Number(convertNumber({amount: project.stakedTotalString}));
          acc += ept;

          return {
            [project.block]: acc,
          };
        } else {
          const ept =
            ((project.block - stakeStartBlock) * epb) /
            Number(convertNumber({amount: project.stakedTotalString}));
          acc += ept;

          return {
            [project.block]: acc,
          };
        }
      },
    );

    stakeInfos.map((stake: any) => {
      const address = stake.stakeAddress.toLowerCase();
      return (period[address] = stake.memo);
    });

    return (result[vaultAddress] = {res, saleClosed, period});
  });

  return result;
};

export const fetchVaults = createAsyncThunk(
  'app/vaults',
  // @ts-ignore
  async ({chainId}: any, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().vaults;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const vaultReq = await fetch(fetchValutURL)
      .then((res) => res.json())
      .then((result) => result);
    const vaultData = vaultReq.datas;

    const result = getEarningPerBlock(vaultData);
    return result;
  },
);

export const vaultReducer = createSlice({
  name: 'vaults',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchVaults.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchVaults.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchVaults.rejected.type]: (state, action) => {
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
export const selectVaults = (state: RootState) => state.vaults;
