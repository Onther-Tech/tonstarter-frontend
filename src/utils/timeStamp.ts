import {BASE_PROVIDER} from 'constants/index';
import {BigNumber} from 'ethers';
import moment from 'moment';
let provider = BASE_PROVIDER;

export const period = (startBlockNum: BigNumber, endBlockNum: BigNumber) => {
  let startBlock = Number(startBlockNum);
  let endBlock = Number(endBlockNum);
  let seconds = (endBlock - startBlock) * 13.3;
  const periodHumanized = moment.duration(seconds, 'seconds').humanize();
  return periodHumanized;
};
export const formatStartTime = async (
  blockNum: string | undefined,
  currentBlock: number,
) => {
  const blockNumberBN = BigNumber.from(blockNum);
  const blockNumber = blockNumberBN.toNumber();
  if (currentBlock > blockNumber) {
    const block = await provider.getBlock(blockNumber);
    const timeStamp = block.timestamp;
    return moment.unix(timeStamp).format('MMM DD, YYYY HH:mm:ss');
  } else {
    let seconds = (blockNumber - currentBlock) * 13.3;
    const currentBlk = await provider.getBlock(currentBlock);
    const currentTimeStamp = currentBlk.timestamp;
    const timestamp = currentTimeStamp + seconds;

    return moment.unix(timestamp).format('MMM DD, YYYY HH:mm:ss');
  }
};
export const formatEndTime = async (
  startBlockNum: BigNumber,
  endBlockNum: BigNumber,
  currentBlock: number,
) => {
  let startB = Number(startBlockNum);
  let endB = Number(endBlockNum);
  if (Number(currentBlock > endB)) {
    const endBlock = await provider.getBlock(endB);
    const timeStamp = endBlock.timestamp;
    return moment.unix(timeStamp).format('MMM DD, YYYY HH:mm:ss');
  } else {
    let seconds = (endB - startB) * 13;
    const currentBlk = await provider.getBlock(currentBlock);
    const currentTimeStamp = currentBlk.timestamp;
    let seconds2 = (startB - currentBlock) * 13;
    const startTimeStamp = currentTimeStamp + seconds2;
    // const startBlock = await provider.getBlock(startB);
    // const startTimeStamp = startBlock.timestamp;
    const timestamp = startTimeStamp + seconds;
    return moment.unix(timestamp).format('MMM DD, YYYY HH:mm:ss');
  }
};
