import React from 'react';
import { Container, Box, Title } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function New () {

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={3}>Criar novo</Title>
        </Box>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default New;