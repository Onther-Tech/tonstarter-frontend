import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  useTheme,
} from '@chakra-ui/react';
import {MoonIcon, SunIcon} from '@chakra-ui/icons';
import {useRouteMatch} from 'react-router-dom';

type ThemeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = (props) => {
  const {toggleColorMode, colorMode} = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const theme = useTheme();
  const match = useRouteMatch('/');

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="unstyled"
      color={
        colorMode === 'light'
          ? match?.isExact
            ? 'white.100'
            : 'black.200'
          : theme.colors.white[100]
      }
      marginLeft="2"
      onClick={toggleColorMode}
      bg={'transparent'}
      icon={<SwitchIcon w={35} h={35} />}
      _hover={{
        color:
          colorMode === 'light'
            ? match?.isExact
              ? '#ffff07'
              : '#007aff'
            : 'red',
      }}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
