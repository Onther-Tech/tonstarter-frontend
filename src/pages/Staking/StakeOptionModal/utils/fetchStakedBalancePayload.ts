import {getTokamakContract} from 'utils/contract';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';

import {convertFromWeiToRay, convertNumber} from 'utils/number';

const {UniswapStaking_Address} = DEPLOYED;

export const fetchStakedBalancePayload = async (
  account: string,
  contractAddress: string,
  library: any,
) => {
  const res = await getStakedBalance(account, contractAddress, library);
  return res;
};

const getSwapBalance = (args: any) => {
  const totalStakedAmount = args[0];
  //ray
  const totalStakedAmountL2 = args[1];
  //ray
  const totalPendingUnstakedAmountL2 = args[2];
  //ray
  const stakeContractBalanceWton = args[3];
  const stakeContractBalanceTon = args[4];

  const ray_TotalStakedAmount = convertFromWeiToRay(totalStakedAmount);
  const ray_StakeContractBalanceTon = convertFromWeiToRay(
    stakeContractBalanceTon,
  );

  const totalBalance = totalStakedAmountL2
    .add(totalPendingUnstakedAmountL2)
    .add(stakeContractBalanceWton)
    .add(ray_StakeContractBalanceTon)
    .sub(ray_TotalStakedAmount);

  const tonsBalance = stakeContractBalanceWton.add(ray_StakeContractBalanceTon);

  if (totalBalance.gt(tonsBalance)) {
    return tonsBalance;
  }
  if (totalBalance.lte(tonsBalance)) {
    return totalBalance;
  }
};

const getStakedBalance = async (
  account: string,
  contractAddress: string,
  library: any,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const TON = getTokamakContract('TON', library);
  const WTON = getTokamakContract('WTON', library);
  const depositManager = getTokamakContract('DepositManager', library);
  const seigManager = getTokamakContract('SeigManager', library);
  const StakeUniswap = new Contract(
    UniswapStaking_Address,
    StakeUniswapABI.abi,
    library,
  );
  const basePrice = '1000000000000000000000000000';

  return Promise.all([
    StakeTONContract.totalStakedAmount(),
    //should convert to ray from wei for seigManager
    seigManager.stakeOf(DEPLOYED.TokamakLayer2_ADDRESS, contractAddress),
    depositManager.pendingUnstaked(
      DEPLOYED.TokamakLayer2_ADDRESS,
      contractAddress,
    ),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
    StakeUniswap.getPrice(basePrice),
  ]).then((result) => {
    return {
      totalStakedAmount: convertNumber({
        amount: result[0],
      }),
      totalStakedAmountL2: convertNumber({
        amount: result[1],
        type: 'ray',
      }),
      totalPendingUnstakedAmountL2: convertNumber({
        amount: result[2],
        type: 'ray',
      }),
      stakeContractBalanceWton: convertNumber({
        amount: result[3],
        type: 'ray',
      }),
      stakeContractBalanceTon: convertNumber({
        amount: result[4],
      }),
      seig: '',
      swapBalance: convertNumber({amount: getSwapBalance(result), type: 'ray'}),
      originalBalance: {
        totalStakedAmount: result[0],
        totalStakedAmountL2: result[1],
        totalPendingUnstakedAmountL2: result[2],
        stakeContractBalanceWton: result[3],
        stakeContractBalanceTon: result[4],
        swapBalance: getSwapBalance(result),
        tosPrice: convertNumber({amount: result[5]}),
      },
    };
  });
};
