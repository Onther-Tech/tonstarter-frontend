import {FC, useState, useRef} from 'react';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  chakra,
  Text,
  Flex,
  // IconButton,
  Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
  Center,
  useTheme,
  Image,
} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
// import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import './staking.css';
import {checkTokenType} from 'utils/token';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {selectTableType} from 'store/table.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
import {setTimeout} from 'timers';
import {LoadingComponent} from 'components/Loading';

type StakingTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

const getTextColor = (type: string, colorMode: string) => {
  if (colorMode === 'light') {
    if (type === 'name') {
      return '#304156';
    }
    return '#3a495f';
  } else if (colorMode === 'dark') {
    if (type === 'name') {
      return 'white.100';
    }
    return '#f3f4f1';
  }
};

const getCircle = (type: 'loading' | 'sale' | 'start' | 'end') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'loading'
            ? '#C0C0C0'
            : type === 'sale'
            ? '#f95359'
            : type === 'start'
            ? '#ffdc00'
            : '#2ea2f8'
        }></Box>
    </Flex>
  );
};

const getStatus = (
  type: 'sale' | 'start' | 'end',
  colorMode: 'light' | 'dark',
) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'20px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'sale' ? '#f95359' : type === 'start' ? '#ffdc00' : '#2ea2f8'
        }
        mr={'7px'}
        mt={'2px'}></Box>
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'sale' ? 'On sale' : type === 'start' ? 'started' : 'ended'}
      </Text>
    </Flex>
  );
};

export const StakingTable: FC<StakingTableProps> = ({
  columns,
  data,
  renderDetail,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    page,
    nextPage,
    // previousPage,
    // setPageSize,
    // state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const focusTarget = useRef<any>([]);

  const {
    data: {contractAddress, index},
  } = useAppSelector(selectTableType);

  useEffect(() => {
    if (index) {
      let loop = Math.floor(index / 10);
      while (loop) {
        nextPage();
        loop = loop - 1;
        if (loop === 0) {
          setTimeout(() => {
            focusTarget.current[
              index - Math.floor(index / 10) * 10
            ].scrollIntoView({
              block: 'start',
            });
          }, 200);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isOpen, setIsOpen] = useState(
    contractAddress === undefined ? '' : contractAddress,
  );

  // const goPrevPage = () => {
  //   setIsOpen('');
  //   previousPage();
  // };

  // const goNextPage = () => {
  //   setIsOpen('');
  //   nextPage();
  // };

  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        if (e.Header === 'Earning Per TON') {
          return e.toggleSortBy();
        }
        e.toggleSortBy(true);
      }
      return null;
    });
  };

  const clickOpen = (contractAddress: string, index: number) => {
    setIsOpen(contractAddress);
    setTimeout(() => {
      focusTarget.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const renderBtn = (contractAddress: string, index: number) => {
    if (isOpen === contractAddress)
      return (
        <Flex w={'100%'} justifyContent="flex-end" _hover={{cursor: 'pointer'}}>
          <TriangleUpIcon color="blue.100" _hover={{cursor: 'pointer'}} />
        </Flex>
      );
    return (
      <Flex
        w={'100%'}
        justifyContent="flex-end"
        // onClick={() => clickOpen(contractAddress, index)}
        _hover={{cursor: 'pointer'}}>
        <TriangleDownIcon
          color="blue.100"
          _hover={{cursor: 'pointer'}}></TriangleDownIcon>
      </Flex>
    );
  };

  if (isLoading === true || data.length === 0) {
    return (
      <Center>
        <LoadingComponent />
      </Center>
    );
  }

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'23px'}>
        <Flex>
          {getStatus('sale', colorMode)}
          {getStatus('start', colorMode)}
          {getStatus('end', colorMode)}
        </Flex>
        <Select
          w={'137px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          placeholder="On Sale Sort"
          onChange={onChangeSelectBox}>
          <option value="name">Name</option>
          <option value="period">Period</option>
          <option value="total staked">Total Staked</option>
          <option value="Earning Per TON">Earning Per TON</option>
        </Select>
      </Flex>
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column">
          {/* <chakra.thead textAlign={'justify'}>
            {console.log(headerGroups)}
            {headerGroups.map((headerGroup) => (
              <chakra.tr h={16} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <chakra.th
                    px={3}
                    py={3}
                    {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                  </chakra.th>
                ))}
              </chakra.tr>
            ))}
          </chakra.thead> */}
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column">
            {page.map((row: any, i) => {
              const {contractAddress} = row.original;
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={
                    colorMode === 'light'
                      ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)'
                      : ''
                  }
                  ref={(el) => (focusTarget.current[i] = el)}
                  h={16}
                  key={i}
                  onClick={() => {
                    if (isOpen === contractAddress) {
                      setIsOpen('');
                    } else {
                      clickOpen(contractAddress, i);
                    }
                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  borderBottomRadius={
                    isOpen === contractAddress ? '0px' : '10px'
                  }
                  borderBottom={isOpen === contractAddress ? '1px' : ''}
                  borderBottomColor={
                    isOpen === contractAddress ? '#f4f6f8' : ''
                  }
                  mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const {token, status, name, period, stakeBalanceTON, ept} =
                      cell.row.original;
                    const type = cell.column.id;
                    const tokenType = checkTokenType(token);
                    return (
                      <chakra.td
                        px={3}
                        py={3}
                        key={index}
                        m={0}
                        w={
                          type === 'name'
                            ? '280px'
                            : type === 'period'
                            ? '150px'
                            : type === 'stakeBalanceTON'
                            ? '200px'
                            : type === 'earning_per_ton'
                            ? ''
                            : '200px'
                        }
                        display="flex"
                        alignItems="center"
                        color={getTextColor(type, colorMode)}
                        fontSize={type === 'name' ? '15px' : '13px'}
                        fontWeight={type === 'name' ? 600 : 0}
                        {...cell.getCellProps()}>
                        {type === 'name' ? getCircle(status) : ''}
                        {type === 'name' ? (
                          <>
                            <Avatar
                              src={tokenType.symbol}
                              backgroundColor={tokenType.bg}
                              bg="transparent"
                              color="#c7d1d8"
                              name="T"
                              h="48px"
                              w="48px"
                              ml="10px"
                              mr="12px"
                            />
                            <Text>{name}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'period' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Period
                            </Text>
                            <Text>{period.split('.')[1]}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'stakeBalanceTON' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Total Staked
                            </Text>
                            <Text>{stakeBalanceTON}</Text>
                          </>
                        ) : (
                          ''
                        )}

                        {type === 'earning_per_ton' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Earning Per TON
                            </Text>
                            <Text w={120}>
                              {ept === undefined ? null : ept}{' '}
                              {ept === undefined ? null : 'TOS'}{' '}
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              label="This estimator could be change depending on the situation"
                              color={theme.colors.white[100]}
                              bg={theme.colors.gray[375]}>
                              <Image src={tooltipIcon} />
                            </Tooltip>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'expander'
                          ? renderBtn(contractAddress, i)
                          : null}
                        {/* {isLoading ? <Skeleton h={5} /> : cell.render('Cell')} */}
                      </chakra.td>
                    );
                  })}
                </chakra.tr>,
                // If the row is in an expanded state, render a row with a
                // column that fills the entire length of the table.
                isOpen === contractAddress ? (
                  <chakra.tr
                    boxShadow="0 1px 1px 0 rgba(96, 97, 112, 0.16)"
                    w={'100%'}
                    h={'430px'}
                    key={i}
                    m={0}
                    mb={'14px'}
                    mt={-5}
                    bg={colorMode === 'light' ? 'white.100' : ''}
                    border={colorMode === 'light' ? '' : 'solid 1px #373737'}
                    borderTopWidth={0}
                    borderBottomRadius="10px">
                    <chakra.td
                      display={'flex'}
                      w={'100%'}
                      margin={0}
                      colSpan={visibleColumns.length}>
                      {/*
                    Inside it, call our renderRowSubComponent function. In reality,
                    you could pass whatever you want as props to
                    a component like this, including the entire
                    table instance. But for this example, we'll just
                    pass the row
                  */}
                      {renderDetail({
                        row,
                      })}
                    </chakra.td>
                  </chakra.tr>
                ) : null,
              ];
            })}
          </chakra.tbody>
        </chakra.table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}

        {/* 
        PAGENATION FOR LATER
        <Flex justifyContent="flex-end" my={4} alignItems="center">
          <Flex>
            <Tooltip label="Previous Page">
              <IconButton
                w={'24px'}
                h={'24px'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #424242'
                }
                color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                borderRadius={4}
                aria-label={'Previous Page'}
                onClick={goPrevPage}
                isDisabled={!canPreviousPage}
                size={'sm'}
                mr={4}
                _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex
            alignItems="center"
            p={0}
            fontSize={'13px'}
            fontFamily={theme.fonts.roboto}
            color={colorMode === 'light' ? '#3a495f' : '#949494'}
            pb={'3px'}>
            Page{' '}
            <Text fontWeight="bold" as="span" color={'blue.300'}>
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <Center>
                <IconButton
                  w={'24px'}
                  h={'24px'}
                  border={
                    colorMode === 'light'
                      ? 'solid 1px #e6eaee'
                      : 'solid 1px #424242'
                  }
                  color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                  bg={colorMode === 'light' ? 'white.100' : 'none'}
                  borderRadius={4}
                  aria-label={'Next Page'}
                  onClick={goNextPage}
                  isDisabled={!canNextPage}
                  size={'sm'}
                  ml={4}
                  mr={'1.5625em'}
                  _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                  icon={<ChevronRightIcon h={6} w={6} />}
                />
              </Center>
            </Tooltip>
            <Select
              w={'117px'}
              h={'32px'}
              mr={1}
              color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
              bg={colorMode === 'light' ? 'white.100' : 'none'}
              boxShadow={
                colorMode === 'light'
                  ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)'
                  : ''
              }
              border={colorMode === 'light' ? '' : 'solid 1px #424242'}
              borderRadius={4}
              size={'sm'}
              value={pageSize}
              fontFamily={theme.fonts.roboto}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex> */}
      </Box>
    </Flex>
  );
};

// @todo (isaac): add mobile table
// const MobileTable = () => {
//   return;
// };
