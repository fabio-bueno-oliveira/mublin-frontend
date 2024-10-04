import React from 'react';
import { useLocation  } from 'react-router';
import {
  Space,
  Title,
  Text,
  Container
} from '@mantine/core';
import Header from '../../components/header/public';;

function NotFoundPage () {

  document.title = 'Ops! Página não encontrada! - Mublin';

  return (
      <>
      <Header />
      <Container size={420} my={40}>
        <Title ta="center" order={1}>
          Ops!
        </Title>
        <Text c="dimmed" size="md" ta="center" mt={24} mb={7}>
          Página não encontrada
        </Text>
        <Space h="lg" />
      </Container>
    </>
    );
};

export default NotFoundPage;