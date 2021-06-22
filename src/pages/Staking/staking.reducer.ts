import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract, getSigner} from 'utils/contract';
import {BigNumber, utils, ethers} from 'ethers';
import {toWei} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as TonABI from 'services/abis/TON.json';
import * as FldABI from 'services/abis/TOS.json';
import * as SeigManagerABI from 'services/abis/SeigManager.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import {formatEther} from '@ethersproject/units';
import {period, formatStartTime, formatEndTime} from 'utils/timeStamp';
import axios from 'axios';
import {
  REACT_APP_TON,
  REACT_APP_FLD,
  REACT_APP_SEIG_MANAGER,
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  DEPLOYED,
} from 'constants/index';

const provider = ethers.getDefaultProvider('rinkeby');
const stakeInfos: Array<any> = [];

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
  myton: BigNumber | string;
  myfld: BigNumber | string;
  mystaked: BigNumber | string;
  mywithdraw: BigNumber | string;
  myclaimed: BigNumber | string;
  canRewardAmount: BigNumber | string;
  stakeBalanceTON: BigNumber | string;
  stakeBalanceETH: BigNumber | string;
  stakeBalanceFLD: BigNumber | string;
  tokamakStaked: BigNumber | string;
  tokamakPendingUnstaked: BigNumber | string;
  staketype: string;
  period: string | number;
  startTime: string;
  endTime: string;
};

interface StakeState {
  data: Stake[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

type StakeProps = {
  userAddress: string | null | undefined;
  amount: string;
  payToken: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  stakeStartBlock: string | Number;
};
type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  stakeStartBlock: string | Number;
};

type unstake = {
  userAddress: string | null | undefined;
  stakeEndBlock: string | Number;
  library: any;
  stakeContractAddress: string;
};

type claim = {
  userAddress: string | null | undefined;
  stakeContractAddress: string;
  stakeStartBlock: string | Number;
  library: any;
};

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

const converToWei = (num: string) => toWei(num, 'ether');

export const stakePaytoken = async (args: StakeProps) => {
  const {
    userAddress,
    amount,
    payToken,
    saleStartBlock,
    library,
    stakeContractAddress,
    stakeStartBlock,
  } = args;
  console.log(amount);

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      stakeStartBlock: stakeStartBlock,
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      stakeStartBlock: stakeStartBlock,
    });
  }
};
const stakeTon = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartBlock,
    library,
    stakeContractAddress,
    stakeStartBlock,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();
  if (currentBlock > saleStartBlock && currentBlock < stakeStartBlock) {
    const tonContract = getContract(REACT_APP_TON, TonABI.abi, library);
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = converToWei(amount);
    const abicoder = ethers.utils.defaultAbiCoder;
    const data = abicoder.encode(
      ['address', 'uint256'],
      [stakeContractAddress, tonAmount],
    );

    const signer = getSigner(library, userAddress);

    await tonContract
      .connect(signer)
      ?.approveAndCall(stakeContractAddress, tonAmount, data);
  } else {
    return alert('staking period has ended');
  }
};
const stakeEth = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartBlock,
    library,
    stakeContractAddress,
    stakeStartBlock,
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();

  if (currentBlock > saleStartBlock && currentBlock < stakeStartBlock) {
    const transactionRequest: any = {
      to: stakeContractAddress,
      value: utils.parseEther(amount),
    };

    const signer = getSigner(library, userAddress);
    await signer.sendTransaction(transactionRequest);
  } else {
    return alert('staking period has ended');
  }
};

export const withdraw = async (args: unstake) => {
  const {userAddress, stakeEndBlock, library, stakeContractAddress} = args;
  const currentBlock = await provider.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > stakeEndBlock) {
    const StakeTONContract = await getContract(
      stakeContractAddress,
      StakeTON.abi,
      library,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);

    await StakeTONContract.connect(signer)?.withdraw();
  } else {
    return alert('sale has not ended yet');
  }
};

export const claimReward = async (args: claim) => {
  const {userAddress, stakeContractAddress, stakeStartBlock, library} = args;
  const currentBlock = await provider.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > stakeStartBlock) {
    const StakeTONContract = await getContract(
      stakeContractAddress,
      StakeTON.abi,
      library,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    await StakeTONContract.connect(signer)?.claim();
  }
};

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({contract, library, account}: any, {requestId, getState}) => {
    let projects: any[] = [];
    // let iERC20: any;

    console.log(account);

    console.log('--fetchStakes--');

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      console.log('peding || requestId && currentRequestId');
      return;
    }

    console.log('--contract--');

    // const temp = await axios
    //   .get('http://3.36.66.138:4000/v1/vaults?chainId=4')
    //   .then((result) => result.data);
    // const contracts = await axios
    //   .get('http://3.36.66.138:4000/v1/stakecontracts?chainId=4')
    //   .then((result) => result);
    // console.log(temp);
    // console.log(contracts);

    // const vaults = temp.datas;

    // stakeList = await Promise.all(
    //   vaults.map(async (vault: any) => {
    //     const stakeVault = vault.vault;
    //     const stakeType = vault.stakeType;
    //     const token = vault.paytoken;
    //     const projects = vault.stakeAddresses;
    //     return {
    //       // iERC20: iERC20,
    //       stakeType,
    //       projects,
    //       stakeVault,
    //       token,
    //     };
    //   }),
    // );

    const contracts = await axios
      .get('http://3.36.66.138:4000/v1/stakecontracts?chainId=4')
      .then((result) => result.data);

    const stakeList = contracts.datas;

    console.log(stakeList);

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        console.log(stake);
        // let info = await stake.stakeVault.stakeInfos(item);

        //  console.log(stake);

        // const startTime = await formatStartTime(stake.saleStartBlock);
        // const sendTime = await formatEndTime(
        //   stake.saleStartBlock,
        //   stake.saleStartBlock,
        // );

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          saleStartBlock: 0,
          stakeStartBlock: 0,
          stakeEndBlock: 0,
          // balance: formatEther(info[3]),
          // totalRewardAmount: formatEther(info[4]),
          // claimRewardAmount: formatEther(info[5]),
          totalStakers: formatEther(0),
          myton: formatEther(0),
          myfld: formatEther(0),
          mystaked: formatEther(0),
          mywithdraw: formatEther(0),
          myclaimed: formatEther(0),
          canRewardAmount: formatEther(0),
          stakeBalanceTON: formatEther(String(stake.totalStakedAmount)),
          stakeBalanceETH: formatEther(0),
          stakeBalanceFLD: formatEther(0),
          tokamakStaked: formatEther(0),
          tokamakPendingUnstaked: formatEther(0),
          token: stake.paytoken,
          stakeType: stake.stakeType,
          period: period(stake.startBlock, stake.endBlock),
          startTime: 'MMM DD, YYYY HH:mm:ss',
          endTime: 'MMM DD, YYYY HH:mm:ss',
        };

        if (account) {
          await getMy(stakeInfo, stake, library, account);
          await infoTokamak(stakeInfo, stake, index, library, account);
        }

        projects.push(stakeInfo);
      }),
    );
    console.log(projects);
    // if (account) {
    //   console.log(account);
    // }
    return projects;
  },
);

const getMy = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  library: any,
  account: string,
) => {
  const currentBlock = await provider.getBlockNumber();

  const TON = await getContract(REACT_APP_TON, TonABI.abi, library);
  const myTON = await TON?.balanceOf(account);
  stakeInfo.myton = formatEther(myTON);
  const FLD = await getContract(REACT_APP_FLD, FldABI.abi, library);
  const myFLD = await FLD?.balanceOf(account);
  stakeInfo.myfld = formatEther(myFLD);

  const StakeTONContract = await getContract(
    stakeContractAddress,
    StakeTON.abi,
    library,
  );
  const saleBlock = await StakeTONContract?.saleStartBlock();
  stakeInfo.saleStartBlock = Number(saleBlock);
  const staked = await StakeTONContract?.userStaked(account);

  stakeInfo.mystaked = formatEther(staked.amount);
  stakeInfo.myclaimed = formatEther(staked.claimedAmount);
  stakeInfo.mywithdraw = formatEther(staked.releasedAmount);
  // const total = await StakeTONContract?.totalStakers();
  // stakeInfo.totalStakers = total.toString();

  if (Number(stakeInfo.mystaked) > 0) {
    try {
      let canRewardAmount = await StakeTONContract?.canRewardAmount(
        account,
        currentBlock,
      );
      stakeInfo.canRewardAmount = utils.formatUnits(canRewardAmount, 18);
    } catch (err) {}
  }
  const stakeContractBalanceFLD = await FLD?.balanceOf(stakeContractAddress);
  const stakeContractBalanceTON = await TON?.balanceOf(stakeContractAddress);
  const stakeContractBalanceETH = await provider.getBalance(
    stakeContractAddress,
  );
  stakeInfo.stakeBalanceFLD = formatEther(stakeContractBalanceFLD);
  stakeInfo.stakeBalanceTON = formatEther(stakeContractBalanceTON);
  stakeInfo.stakeBalanceETH = formatEther(stakeContractBalanceETH);
};

const infoTokamak = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  index: number,
  library: any,
  account: string,
) => {
  if (index < stakeInfos.length) {
    try {
      const seigManager = getContract(
        REACT_APP_SEIG_MANAGER,
        SeigManagerABI.abi,
        library,
      );
      const depositManager = getContract(
        REACT_APP_DEPOSIT_MANAGER,
        DepositManagerABI.abi,
        library,
      );
      const staked = await seigManager?.stakeOf(
        REACT_APP_TOKAMAK_LAYER2,
        stakeContractAddress,
      );
      stakeInfo.tokamakStaked = utils.formatUnits(staked, 27);

      const pendingUnstaked = await depositManager?.pendingUnstaked(
        REACT_APP_TOKAMAK_LAYER2,
        stakeContractAddress,
      );
      stakeInfo.tokamakPendingUnstaked = utils.formatUnits(pendingUnstaked, 27);
    } catch (err) {
      console.log('infoTokamak err', err);
    }
  }
};
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
// @ts-ignore
export const selectStakes = (state: RootState) => state.stakes;
