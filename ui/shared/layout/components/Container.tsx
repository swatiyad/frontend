import { Container as ChakraContainer, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const bgColor = useColorModeValue('white', 'black');

  return (
    <ChakraContainer
      className={className}
      minWidth={{ base: '100vw', lg: '1450px' }}
      m="0 auto"
      bgColor={bgColor}
      padding={0}
      // maxW='1450px' centerContent
    
    >
      {children}
    </ChakraContainer>
  );
};

export default React.memo(chakra(Container));
