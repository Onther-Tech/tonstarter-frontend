import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Avatar,
  Text,
} from '@chakra-ui/react';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {checkTokenType} from 'utils/token';
import {ExclusiveSale} from './components/details/ExclusiveSale';
import {DetailIcons} from './components/details/Detail_Icons';
import {StarterStatus} from './types';
import {DetailTable} from './components/details/Detail_Table';

export const StarterDetail = () => {
  const {id}: {id: string} = useParams();
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const [status, setStatus] = useState<StarterStatus | undefined>(undefined);

  const {STATER_STYLE} = theme;
  const tokenType = checkTokenType(
    '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  );

  return (
    <Flex mt={'122px'} justifyContent="center" mb={'100px'}>
      <Flex w="1194px" flexDir="column" mb={'10px'}>
        <Flex
          {...STATER_STYLE.containerStyle({colorMode})}
          w={'100%'}
          h={'367px'}
          px={35}
          py={'30px'}
          _hover={''}
          cursor="">
          <Box d="flex" flexDir="column" w={'562px'} pr={35}>
            <Flex justifyContent="space-between" mb={15}>
              <Avatar
                src={tokenType.symbol}
                backgroundColor={tokenType.bg}
                bg="transparent"
                color="#c7d1d8"
                name="T"
                h="48px"
                w="48px"
              />
            </Flex>
            <Text {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
              Genesis Shards Public
            </Text>
            <Text
              {...STATER_STYLE.subText({colorMode})}
              letterSpacing={'1.4px'}
              mb={'14px'}>
              DESCRIPTION
            </Text>
            <Text
              {...STATER_STYLE.subText({colorMode, fontSize: 15})}
              mb={'11px'}>
              Co-ordinate campaigns and product launches, with improved overall
              communication and collaboration for your whole team. Hardware,
              tech, make announcements and build awareness among some of the
              hardest consumers in the world to reach.
            </Text>
            <Box>
              <DetailIcons
                linkInfo={[
                  {sort: 'website', url: 'go'},
                  {sort: 'telegram', url: 'go'},
                  {sort: 'medium', url: 'go'},
                  {sort: 'twitter', url: 'go'},
                  {sort: 'discord', url: 'go'},
                ]}></DetailIcons>
            </Box>
          </Box>
          <Box
            w={'1px'}
            bg={colorMode === 'light' ? '#f4f6f8' : '#323232'}
            boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}></Box>
          <Box d="flex" flexDir="column" pt={'70px'} pl={'45px'}>
            {status === 'active' && <ExclusiveSale></ExclusiveSale>}
            {status === 'upcoming' && <ExclusiveSale></ExclusiveSale>}
            {status === 'past' && <ExclusiveSale></ExclusiveSale>}
          </Box>
        </Flex>
        <Flex>
          <DetailTable></DetailTable>
        </Flex>
      </Flex>
    </Flex>
  );
};
