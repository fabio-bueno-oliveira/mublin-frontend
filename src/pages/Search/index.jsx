import React from 'react';
import { Container, Box, Title } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function Search () {

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={3}>Buscar</Title>
        </Box>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default Search;