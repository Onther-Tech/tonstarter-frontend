import {ethers, BigNumber} from 'ethers';
import Decimal from 'decimal.js';
import {toWei} from 'web3-utils';

// eslint-disable-next-line
type RoundFunc = {
  r_amount: string;
  r_maxDecimalDigits: number;
  r_opt?: 'up' | 'down';
};

type ConverNumberFunc = {
  type?: 'ray' | 'wei';
  amount: string;
  round?: boolean;
  decimalPlaces?: number;
};

export const convertToWei = (num: string) => toWei(num, 'ether');

function roundNumber(args: RoundFunc): string {
  const {r_amount, r_maxDecimalDigits, r_opt} = args;
  const number = new Decimal(r_amount);
  if (r_opt === 'up') {
    return number.toFixed(r_maxDecimalDigits, Decimal.ROUND_UP);
  } else if (r_opt === 'down') {
    return number.toFixed(r_maxDecimalDigits, Decimal.ROUND_DOWN);
  }
  return number.toFixed(r_maxDecimalDigits, Decimal.ROUND_HALF_UP);
}

export function convertNumber(args: ConverNumberFunc): string | undefined {
  try {
    const {type, amount, round, decimalPlaces} = args;
    const utils = ethers.utils;

    if (amount === '0' || amount === undefined || amount === '') {
      return '0.00';
    }

    const numAmount = BigNumber.from(amount);
    const numberType: string = type ? type : 'wei';
    const optRound = round ? round : false;
    const decimalPoint: number = decimalPlaces ? decimalPlaces : 2;
    if (amount === undefined) {
      throw new Error(`amount is undefined`);
    }
    if (decimalPoint <= 0) {
      throw new Error(`decimalPoint must be positive number`);
    }
    switch (numberType) {
      case 'wei':
        const weiAmount = utils.formatUnits(numAmount, 18);
        const weiAmountStr: string = weiAmount.toString();
        if (optRound === true) {
          return roundNumber({
            r_amount: weiAmountStr,
            r_maxDecimalDigits: decimalPoint,
            r_opt: 'up',
          });
        }
        return roundNumber({
          r_amount: weiAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'down',
        });
      case 'ray':
        const rayAmount = utils.formatUnits(numAmount, 27);
        const rayAmountStr: string = rayAmount.toString();
        if (optRound === true) {
          return roundNumber({
            r_amount: rayAmountStr,
            r_maxDecimalDigits: decimalPoint,
            r_opt: 'up',
          });
        }
        return roundNumber({
          r_amount: rayAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'down',
        });
      default:
        throw new Error(`this type is not valid. It must be "WTON" or "TON"`);
    }
  } catch (e) {
    // console.log(e);
  }
}
