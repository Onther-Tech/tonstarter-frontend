import {FC} from 'react';
import {
  Heading,
  Flex,
  Text,
  Container,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';

type HeadProps = {
  title?: string;
  subtitle?: string;
};

export const PageHeader: FC<HeadProps> = ({title, subtitle}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Container pt={12} maxW={'100%'}>
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Heading
          fontWeight={'bold'}
          fontSize={'38'}
          className={'page-title'}
          color={theme.colors.gray[250]}
          fontFamily={theme.fonts.titil}
          mb="10px">
          {title}
        </Heading>

        <Text
          fontSize={16}
          className={'page-title'}
          color={
            colorMode === 'light' ? theme.colors.gray[400] : 'currentcolor'
          }
          fontFamily={theme.fonts.titil}>
          {subtitle}
        </Text>
      </Flex>
    </Container>
  );
};
