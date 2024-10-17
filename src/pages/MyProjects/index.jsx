import React from 'react';
import { Container, Box, Title } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MyProjects () {

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={3}>Meus Projetos</Title>
        </Box>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MyProjects;