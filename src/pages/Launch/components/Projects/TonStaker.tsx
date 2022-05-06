import {FC, useState, useEffect} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {shortenAddress} from 'utils/address';
import {PublicPageTable} from './PublicPageTable';
import {Contract} from '@ethersproject/contracts';
import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
import {ethers} from 'ethers';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import * as TONStakerAbi from 'services/abis/TONStakerAbi.json';
import * as TONStakerInitializeAbi from 'services/abis/TONStakerInitializeAbi.json';

type TonStaker = {
  vault: any;
  project: any;
};

export const TonStaker: FC<TonStaker> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0)
  const TONStaker = new Contract(
    vault.vaultAddress,
    TONStakerInitializeAbi.abi,
    library,
  );
  // console.log('tonstaker vault: ', vault);

  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const currentRound = await TONStaker.connect(signer).currentRound();
      const amount = await TONStaker.connect(signer).calculClaimAmount(
        currentRound,
      );
      const claimCounts = await TONStaker.connect(signer).totalClaimCounts();
      const claimDate = parseInt(currentRound) === 0? vault.claim[parseInt(currentRound)].claimTime:vault.claim[parseInt(currentRound)-1].claimTime ;
      const amountFormatted = parseInt(amount);
      setClaimTime(claimDate);
      setDistributable(amountFormatted);
      console.log('currentRound',currentRound);
      
    }
    getLPToken();
  }, [account, library]);
  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  return (
    <Flex flexDirection={'column'} w={'1030px'} p={'0px'}>
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'} mb={'30px'}>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            borderTopLeftRadius={'4px'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'15px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              Token
            </Text>
            {vault.isDeployed ? (
              <Text>
                {Number(vault.vaultTokenAllocation).toLocaleString()}
                {` `}
                {project.tokenSymbol}
              </Text>
            ) : (
              <></>
            )}
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'13px'}
              w={'66px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Admin Address
            </Text>
            <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'N/A'}
            </Text>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomLeftRadius={'4px'}>
            <Text
              w={'81px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Contract Address
            </Text>
            <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'N/A'}
            </Text>
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}
            className={'chart-cell'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}
            borderTopEndRadius={'4px'}>
            <Text
              fontSize={'15px'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              Distribute
            </Text>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}>
            <Flex alignItems={'baseline'} fontWeight={'bold'}>
              {' '}
              <Text
                mr={'3px'}
                fontSize={'20px'}
                color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                      {distributable.toLocaleString()}
              </Text>{' '}
              <Text
                color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
                fontSize={'13px'}>
                {project.tokenSymbol}
              </Text>
            </Flex>

            <Button
              fontSize={'13px'}
              w={'100px'}
              h={'32px'}
              bg={'#257eee'}
              color={'#ffffff'}
              disabled={false}
              _disabled={{
                color: colorMode === 'light' ? '#86929d' : '#838383',
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              }}>
              Distribute
            </Button>
          </GridItem>
          <GridItem
            border={themeDesign.border[colorMode]}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomRightRadius={'4px'}>
            <Flex flexDir={'column'}>
              <Text color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}>
                You can distribute on
              </Text>
              <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              {moment.unix(claimTime).format('MMM, DD, yyyy HH:mm:ss')} {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()}
              </Text>
            </Flex>
            
          </GridItem>
        </Flex>
      </Grid>
      {vault.isDeployed ? (
        <PublicPageTable claim={vault.claim} />
      ) : (
        <Flex
          justifyContent={'center'}
          width={'100%'}
          mt={'50px'}
          color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}
          fontFamily={theme.fonts.fld}>
          There are no claim round values
        </Flex>
      )}
    </Flex>
  );
};
