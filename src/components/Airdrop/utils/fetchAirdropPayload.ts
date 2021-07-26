import {getTokamakContract} from '../../../utils/contract';
import {convertNumber} from '../../../utils/number';
import store from 'store';

export const fetchAirdropPayload = async () => {
  const user = store.getState().user.data;
  const {address: account, library} = user;
  const AirdropVault = getTokamakContract('Airdrop', library);
  
  let roundInfo: any = [];
  let claimedAmount;
  let unclaimed;
  try {
    const currentRound = await AirdropVault.currentRound();
    const totalTgeCount = await AirdropVault.totalTgeCount();
    unclaimed = await AirdropVault.unclaimedInfos(account);
    const tgeCount =
      Number(currentRound.toString()) > Number(totalTgeCount.toString()) ? totalTgeCount : currentRound;
    if (account) {
      for (let i = 1; i <= tgeCount; i++) {
        const result = await AirdropVault.getTgeInfos(i);
        let whitelist;
        let airdropInfo;

        whitelist = await AirdropVault.getWhitelistInfo(i, account);
        if (whitelist[0]) {
          airdropInfo = {
            roundNumber: i,
            allocatedAmount: convertNumber({amount: result.allocatedAmount}),
            amount: convertNumber({amount: result.amount}),
            myAmount: convertNumber({amount: result.amount}),
          };
        } else {
          airdropInfo = {
            roundNumber: i,
            allocatedAmount: convertNumber({amount: result.allocatedAmount}),
            amount: convertNumber({amount: result.amount}),
            myAmount: convertNumber({amount: '0'}),
          };
        }
        roundInfo.push(airdropInfo);
      }
      claimedAmount = await AirdropVault.userClaimedAmount(account);
    } 
  } catch (err) {
    console.log(err)
  }
  return {
    roundInfo: roundInfo,
    claimedAmount: convertNumber({amount: claimedAmount}),
    unclaimedAmount: convertNumber({amount: unclaimed.amount})
  };
};
