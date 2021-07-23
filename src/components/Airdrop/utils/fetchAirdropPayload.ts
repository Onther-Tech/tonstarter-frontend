import {getTokamakContract} from '../../../utils/contract';
import {convertNumber} from '../../../utils/number';
import store from 'store';
// import { ethers } from "ethers";
// import { Pool } from "@uniswap/v3-sdk";
// import { Token } from "@uniswap/sdk-core";
// import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

export const fetchAirdropPayload = async () => {
  const user = store.getState().user.data;
  const {address: account, library} = user;
  const AirdropVault = getTokamakContract('Airdrop', library);
  let roundInfo: any = [];
  // const poolAddress = "0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf"
  // const poolContract = new ethers.Contract(
  //   poolAddress,
  //   IUniswapV3PoolABI,
  //   library
  // );
  // console.log(poolContract);
  // console.log(await poolContract.to)
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
