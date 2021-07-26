import {getTokamakContract} from 'utils/contract';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';

export const fetchStakedBalancePayload = async (
  account: string,
  contractAddress: string,
  library: any,
) => {
  const res = await getStakedBalance(account, contractAddress, library);
  return res;
}

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

  return Promise.all([
    StakeTONContract.totalStakedAmount(),
    seigManager.stakeOf(DEPLOYED.TokamakLayer2_ADDRESS, contractAddress),
    depositManager.pendingUnstaked(DEPLOYED.TokamakLayer2_ADDRESS, contractAddress),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
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
    };
  });
};