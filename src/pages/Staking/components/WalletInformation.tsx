import {
  Container,
  Center,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import React, {FC, useState, useCallback} from 'react';
import {AppDispatch} from 'store';
import {openModal, closeModal, ModalType} from 'store/modal.reducer';
import {User} from 'store/app/user.reducer';
import {Stake} from '../staking.reducer';
import {fetchManageModalPayload} from '../utils';
import {LoadingComponent} from 'components/Loading';
import {getUserBalance, getUserTonBalance} from 'client/getUserBalance';
import {useEffect} from 'react';
import {closeSale} from '../actions';
import {LoadingDots} from 'components/Loader/LoadingDots';

type WalletInformationProps = {
  dispatch: AppDispatch;
  data: Stake;
  user: User;
  account: string | undefined;
};

export const WalletInformation: FC<WalletInformationProps> = ({
  user,
  data,
  dispatch,
  account,
}) => {
  const {colorMode} = useColorMode();
  const [loading, setLoading] = useState(false);
  const [userTonBalance, setUserTonBalance] = useState<string | undefined>(
    undefined,
  );
  const [stakeBalance, setStakeBalance] = useState<string | undefined>(
    undefined,
  );
  const [tosBalance, setTosBalance] = useState<string | undefined>(undefined);
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [unstakeDisabled, setUnstakeDisabled] = useState(true);
  const [claimDisabled, setClaimDisabled] = useState(true);
  const [manageDisabled, setManageDisabled] = useState(true);
  const {status} = data;
  const currentBlock: number = Number(data.fetchBlock);
  const miningStart: number = Number(data.miningStartTime);
  const miningEnd: number = Number(data.miningEndTime);
  const saleStart: number = Number(data.saleStartTime);
  const endSaleBtnDisabled =
    account === undefined || miningStart >= currentBlock ? true : false;
  const manageBtnDisabled =
    account === undefined || miningEnd <= currentBlock ? true : false;

  const btnDisabledStake = () => {
    return account === undefined ||
      saleStart >= currentBlock ||
      status !== 'sale'
      ? setStakeDisabled(true)
      : setStakeDisabled(false);
  };

  const btnDisabledUnstake = () => {
    return account === undefined ||
      currentBlock <= miningEnd ||
      stakeBalance === undefined ||
      stakeBalance === '0.00'
      ? setUnstakeDisabled(true)
      : setUnstakeDisabled(false);
  };

  const btnDisabledClaim = () => {
    return account === undefined ||
      tosBalance === undefined ||
      tosBalance === '0.00'
      ? setClaimDisabled(true)
      : setClaimDisabled(false);
  };

  const manageDisableClaim = () => {
    return account === undefined || data.saleClosed === false
      ? setManageDisabled(true)
      : setManageDisabled(false);
  };

  useEffect(() => {
    if (user.address !== undefined) {
      getWalletTonBalance();
    }
    btnDisabledStake();
    btnDisabledUnstake();
    btnDisabledClaim();
    manageDisableClaim();
    /*eslint-disable*/
  }, [account, data, dispatch, tosBalance]);

  const modalPayload = async (data: any) => {
    const result = await fetchManageModalPayload(
      data.library,
      data.account,
      data.contractAddress,
      data.vault,
    );

    return result;
  };

  const getWalletTonBalance = async () => {
    const result = await getUserTonBalance({
      account: user.address,
      library: user.library,
    });
    const userBalance = await getUserBalance(data.contractAddress);

    if (result && userBalance) {
      const trimNum = Number(result).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setUserTonBalance(trimNum);
      setStakeBalance(userBalance.totalStakedBalance);
      setTosBalance(userBalance.rewardTosBalance);
    }
  };

  const modalData = useCallback(async (modal: ModalType) => {
    setLoading(true);
    let payload;

    try {
      if (modal === 'manage' || modal === 'claim') {
        const payloadModal = await modalPayload(data);
        payload = {
          ...data,
          ...payloadModal,
          user,
        };
      } else if (modal === 'unstake') {
        const payloadModal = await getUserBalance(data.contractAddress);
        payload = {
          ...data,
          totalStakedBalance: payloadModal?.totalStakedBalance,
        };
      } else {
        payload = {
          ...data,
          user,
        };
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }

    setLoading(false);
    dispatch(openModal({type: modal, data: payload}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();
  const {btnStyle} = theme;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={
        colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
      }>
      <Box w={'100%'} p={0} textAlign={'center'} py={10} px={5}>
        <Heading
          color={'blue.300'}
          display="flex"
          alignItems="center"
          justifyContent="center">
          {userTonBalance === undefined && user.address !== undefined ? (
            <LoadingDots />
          ) : (
            userTonBalance
          )}{' '}
          TON
        </Heading>
        <Box py={5}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            {...(stakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={stakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('stake')}>
            Stake
          </Button>
          <Button
            {...(unstakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={unstakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('unstake')}>
            Unstake
          </Button>
          <Button
            {...(claimDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={claimDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('claim')}>
            Claim
          </Button>
          {manageDisabled === true ? (
            <Button
              {...(endSaleBtnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={endSaleBtnDisabled}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() =>
                data.miningEndTime !== undefined
                  ? closeSale({
                      userAddress: account,
                      vaultContractAddress: data.vault,
                      miningEndTime: data.miningEndTime,
                      library: user.library,
                      handleCloseModal: dispatch(closeModal()),
                    })
                  : null
              }>
              End Sale
            </Button>
          ) : (
            <Button
              {...(manageBtnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={manageBtnDisabled}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalData('manage')}>
              Manage
            </Button>
          )}

          {loading === true ? (
            <Flex
              pos="absolute"
              zIndex={100}
              w="100%"
              h="100%"
              alignItems="cneter"
              justifyContent="center">
              <Center>
                <LoadingComponent></LoadingComponent>
              </Center>
            </Flex>
          ) : null}
        </Grid>
      </Box>
    </Container>
  );
};
