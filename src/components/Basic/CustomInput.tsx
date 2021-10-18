import {
  Input,
  NumberInput,
  NumberInputField,
  useColorMode,
  Text,
  Box,
} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useEffect} from 'react';

type CustomInputProp = {
  w?: string;
  h?: string;
  border?: any;
  color?: string;
  br?: number;
  tokenName?: string;
  value: any;
  setValue?: Dispatch<SetStateAction<any>>;
  numberOnly?: boolean;
};

export const CustomInput = (prop: CustomInputProp) => {
  const {colorMode} = useColorMode();

  const {w, h, border, value, setValue, numberOnly, br, color, tokenName} =
    prop;

  useEffect(() => {
    if (setValue && value.length > 1 && value.startsWith('0')) {
      setValue(value.slice(1, value.legnth));
    }
  }, [value, setValue]);

  if (numberOnly) {
    return (
      <NumberInput
        w={w}
        h={h}
        border={
          border || colorMode === 'light'
            ? '1px solid #dfe4ee'
            : '1px solid #424242'
        }
        color={color || 'gray.175'}
        value={Number(value) <= 0 ? 0 : value}
        // focusBorderColor="#000000"
        borderRadius={br || 4}
        onChange={(value) => {
          if ((value === '0' || value === '00') && value.length <= 2) {
            return null;
          }
          if (value === '' && setValue) {
            return setValue('0');
          }
          if (value.length > 9) {
            return null;
          }
          return setValue ? setValue(value) : null;
        }}
        pos="relative">
        <Box
          pos="absolute"
          left={`${value.length * 8 + 18.5}px`}
          h={'100%'}
          d="flex"
          pt={'2px'}
          alignItems="center"
          justifyContent="center">
          <Text>{tokenName}</Text>
        </Box>
        <NumberInputField
          // onSelect={(e: any) => {
          //   e.target.style.color = '#3e495c';
          //   e.target.style.border = '1px solid #2a72e5';
          // }}
          border="none"
          fontWeight={'bold'}
          w={'100%'}
          h={'100%'}
          pl={'15px'}
          _focus={{
            borderWidth: 0,
          }}></NumberInputField>
      </NumberInput>
    );
  }
  return (
    <Input
      variant={'outline'}
      borderWidth={0}
      border={border}
      textAlign={'center'}
      fontWeight={'bold'}
      w={w}
      h={h}
      value={value}
      onChange={(e: any) => (setValue ? setValue(e.target.value) : null)}
      _focus={{
        borderWidth: 0,
      }}
    />
  );
};
