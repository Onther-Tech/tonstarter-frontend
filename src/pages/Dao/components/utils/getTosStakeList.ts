import {Contract} from '@ethersproject/contracts';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import moment from 'moment';
import {convertNumber} from 'utils/number';

export const getTosStakeList = async ({account, library}: any) => {
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const tosStakeList = await LockTOSContract.locksOf(account);

  if (tosStakeList.length === 0) {
    return [];
  }

  const nowTime = moment().unix();

  const res = await Promise.all(
    tosStakeList.map(async (stake: any, index: number) => {
      const lockId = stake.toString();
      const lockedBalance = await LockTOSContract.lockedBalances(
        account,
        lockId,
      );

      const startTime = Number(lockedBalance.start.toString());
      const endTime = Number(lockedBalance.end.toString());
      const unixStartTime = moment.unix(startTime);
      const unixEndTime = moment.unix(endTime);
      const periodWeeks = unixEndTime.diff(unixStartTime, 'weeks');
      const periodDays = unixEndTime.diff(unixStartTime, 'days');
      const end = endTime <= nowTime;

      return {
        lockId,
        periodWeeks,
        periodDays,
        end,
        lockedBalance: convertNumber({amount: lockedBalance.amount.toString()}),
      };
    }),
  );

  return res;
};
