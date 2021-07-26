import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
  StakeInLayer2Modal,
  UnStakeFromLayer2Modal,
  WithdrawalOptionModal,
  SwapModal,
} from './StakeOptionModal';
import {WalletInformation} from './components/WalletInformation';
import {ManageModal} from './StakeOptionModal/Manage/index';
import {formatStartTime} from 'utils/timeStamp';
import {useState} from 'react';
import {getTotalStakers, getUserBalance} from 'client/getUserBalance';
//@ts-ignore
import {useEffect} from 'react';
import {LoadingDots} from 'components/Loader/LoadingDots';

type GetDateTimeType =
  | 'sale-start'
  | 'sale-end'
  | 'mining-start'
  | 'mining-end';

type GetDateProp = {
  time: string | undefined;
  currentBlock: number;
  contractAddress: string;
  type: GetDateTimeType;
};

const GetDate = ({time, currentBlock, contractAddress, type}: GetDateProp) => {
  const {colorMode} = useColorMode();
  const [date, setDate] = useState('');

  const fetchDate = async () => {
    try {
      const result = await formatStartTime(time, currentBlock);
      setDate(result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDate();
    return () => {
      setDate('');
    };
    /*eslint-disable*/
  }, [time, currentBlock]);

  return (
    <>
      {date === '' ? (
        <LoadingDots />
      ) : (
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}
          w="100%">
          {date}
        </Text>
      )}
    </>
  );
};

export const Staking = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  const {data: user} = useAppSelector(selectUser);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'period',
        accessor: 'period',
      },
      {
        Header: 'total staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per TON',
        accessor: 'earning_per_ton',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );

  const GetTotalStaker = ({contractAddress, library, data}: any) => {
    const {colorMode} = useColorMode();
    const [totalStaker, setTotalStaker] = useState('-');
    const getlInfo = async () => {
      const res = await getTotalStakers(contractAddress, library);
      setTotalStaker(res);
    };

    useEffect(() => {
      if (user.address !== undefined) {
        getlInfo();
      } else {
        setTotalStaker(data);
      }
    }, []);

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          Total Staker
        </Text>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}>
          {totalStaker === '-' ? <LoadingDots></LoadingDots> : totalStaker}
        </Text>
      </Flex>
    );
  };

  const GetBalance = ({title, contractAddress, user, setStakeValance}: any) => {
    const {colorMode} = useColorMode();
    const [balance, SetBalance] = useState('-');

    const getBalance = async () => {
      try {
        const result = await getUserBalance(contractAddress);
        if (title === 'My staked') {
          //@ts-ignore
          return SetBalance(result?.totalStakedBalance);
        }
        //@ts-ignore
        SetBalance(result?.rewardTosBalance);
      } catch (e) {}
    };

    useEffect(() => {
      if (user.address !== undefined) {
        getBalance();
      }
      return () => {
        SetBalance('-');
      };
      /*eslint-disable*/
    }, [user]);

    if (user.address === undefined) {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Text fontSize={'15px'} color="gray.400">
            {title}
          </Text>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance}
          </Text>
        </Flex>
      );
    }

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          {title}
        </Text>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}
          h="30px">
          {balance === '-' ? <LoadingDots></LoadingDots> : balance}
          {balance !== '-' ? (
            title === 'My staked' ? (
              <span> TON</span>
            ) : (
              <span> TOS</span>
            )
          ) : null}
        </Text>
      </Flex>
    );
  };

  const renderRowSubComponent = useCallback(
    ({row}) => {
      const {account, contractAddress, fetchBlock, library} = row.original;
      return (
        <Flex
          w="100%"
          m={0}
          justifyContent={'space-between'}
          alignItems="center"
          p="70px"
          border={'none'}>
          <Flex flexDir={'column'} justifyContent={'space-between'} h={'100%'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                {data[row.id]?.status === 'sale'
                  ? 'Sale Starting Day'
                  : 'Mining Starting Day'}
              </Text>
              <Text w="210px">
                <GetDate
                  time={
                    data[row.id]?.status === 'sale'
                      ? data[row.id]?.saleStartTime
                      : data[row.id]?.miningStartTime
                  }
                  currentBlock={fetchBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale'
                      ? 'sale-start'
                      : 'mining-start'
                  }></GetDate>
              </Text>
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleStartTime
                  : data[row.id]?.miningStartTime}
              </Text>
            </Flex>
            <GetTotalStaker
              contractAddress={contractAddress}
              library={library}
              data={data[row.id]?.totalStakers}></GetTotalStaker>
            <GetBalance
              title={'My staked'}
              contractAddress={contractAddress}
              user={user}></GetBalance>
          </Flex>

          <Box p={0} w={'450px'} borderRadius={'10px'} alignSelf={'flex-start'}>
            <WalletInformation
              dispatch={dispatch}
              data={data[row.id]}
              user={user}
              account={account}
            />
          </Box>

          <Flex flexDir={'column'} h={'100%'} justifyContent={'space-between'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                {data[row.id]?.status === 'sale'
                  ? 'Sale Closing Day'
                  : 'Mining Closing Day'}
              </Text>
              <Text w="220px">
                <GetDate
                  time={
                    data[row.id]?.status === 'sale'
                      ? data[row.id]?.saleEndTime
                      : data[row.id]?.miningEndTime
                  }
                  currentBlock={fetchBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale' ? 'sale-end' : 'mining-end'
                  }></GetDate>
              </Text>
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleEndTime
                  : data[row.id]?.miningEndTime}
              </Text>
            </Flex>

            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                Contract
              </Text>
              <Link
                fontSize={'20px'}
                fontWeight={'bold'}
                // color={GetColor() === 'light' ? 'black.300' : 'white.200'}
                isExternal={true}
                outline={'none'}
                _focus={{
                  outline: 'none',
                }}
                href={`${appConfig.explorerLink}${
                  data[row.id]?.contractAddress
                }`}>
                {shortenAddress(data[row.id]?.contractAddress)}
              </Link>
            </Flex>
            <GetBalance
              title={'Earned'}
              contractAddress={contractAddress}
              user={user}
            />
          </Flex>
        </Flex>
      );
    },
    /* eslint-disable */
    [data, dispatch, user, appConfig.explorerLink],
  );

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Staking'}
            subtitle={
              'Put your tokens into TONStarter and earn reward without losing principal'
            }
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          <StakingTable
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
            isLoading={loading === 'pending' ? true : false}
          />
        </Box>
      </Container>
      <StakeOptionModal />
      <UnstakeOptionModal />
      <ClaimOptionModal />
      <ManageModal />
      <StakeInLayer2Modal />
      <UnStakeFromLayer2Modal />
      <WithdrawalOptionModal />
      <SwapModal />
    </Fragment>
  );
};
