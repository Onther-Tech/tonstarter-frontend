import {Button, useColorMode, useTheme} from '@chakra-ui/react';

type CustomButtonProp = {
  text: string;
  w?: string;
  h?: string;
  fontSize?: number;
  isDisabled?: boolean;
  func?: any;
  bg?: string;
  style?: any;
};

export const CustomButton = (prop: CustomButtonProp) => {
  const {text, w, h, isDisabled, fontSize, func, style} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;
  return (
    <Button
      _hover={{}}
      {...(isDisabled
        ? {...btnStyle.btnDisable({colorMode})}
        : {...btnStyle.btnAble()})}
      {...style}
      w={w || '150px'}
      h={h || '38px'}
      fontSize={fontSize || 14}
      isDisabled={isDisabled}
      onClick={func}>
      {text}
    </Button>
  );
};
