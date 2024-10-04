import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header';
import { Container } from '@mantine/core';

function Home () {

  const user = useSelector(state => state.user);

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <h1>Olá, {user.name}</h1>
      </Container>
    </>
  );
};

export default Home;