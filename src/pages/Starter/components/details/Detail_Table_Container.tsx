import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';

type DetailTableContainerProp = {
  title: string;
  data: {key: string; value: string}[];
  breakPoint: number;
  w?: number;
  itemPx?: string;
  itemPy?: string;
  isUserTier?: boolean;
};

const fontSize = 15;

export const DetailTableContainer = (prop: DetailTableContainerProp) => {
  const {title, data, breakPoint, w, itemPx, itemPy, isUserTier} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  return (
    <Box
      {...STATER_STYLE.containerStyle({colorMode})}
      w={w || 582}
      h={'100%'}
      _hover=""
      cursor=""
      fontSize={15}
      p={0}
      border={isUserTier && '1px solid #0070ED'}>
      <Text
        {...STATER_STYLE.subText({colorMode, fontSize})}
        {...STATER_STYLE.table.container({colorMode})}
        px={itemPx || '35px'}
        py={itemPy || '21px'}
        bg={isUserTier && 'blue.100'}
        color={isUserTier && 'white.100'}
        borderTopRadius={13}
        textAlign="center">
        {title}
      </Text>
      {data.map((item, index) => {
        return (
          <Flex
            {...STATER_STYLE.table.container({
              colorMode,
              isLast: index >= breakPoint - 1 ? true : false,
            })}
            px={itemPx || '35px'}
            py={itemPy || '21px'}
            justifyContent="space-between">
            <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
              {item.key}
            </Text>
            <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
              {item.value}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
};
