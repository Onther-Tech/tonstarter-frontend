import {
  addWhiteList,
  calculTier,
  isWhiteList,
  participate,
  openSale,
  deposit,
  claim,
  depositWithdraw,
} from './actions';
import {checkApprove, getAllowance} from './approve';
import {
  getTotalExpectSaleAmount,
  getTimeStamps,
  getTotalExPurchasedAmount,
  getTotalOpenPurchasedAmount,
  getTotalRaise,
  getTotalExpectOpenSaleAmount,
  getTotalDepositAmount,
  getUserDeposit,
  getCalculClaimAmount,
  getStartClaimTime,
  getNextVestingDay,
  getWithdrawAmount,
  getTotalExSaleAmount,
  getCalCulSaleAmount,
  getTotalExpectOpenSaleAmountView,
  getRefundAmount,
  getUserAllocate,
} from './views';

const actions = {
  addWhiteList,
  checkApprove,
  calculTier,
  isWhiteList,
  participate,
  getTotalExpectSaleAmount,
  getTimeStamps,
  getTotalExPurchasedAmount,
  getTotalOpenPurchasedAmount,
  getTotalRaise,
  getAllowance,
  openSale,
  getTotalExpectOpenSaleAmount,
  getTotalDepositAmount,
  getUserDeposit,
  deposit,
  claim,
  getCalculClaimAmount,
  getStartClaimTime,
  getNextVestingDay,
  getWithdrawAmount,
  getTotalExSaleAmount,
  getCalCulSaleAmount,
  getTotalExpectOpenSaleAmountView,
  depositWithdraw,
  getRefundAmount,
  getUserAllocate,
};

export default actions;
