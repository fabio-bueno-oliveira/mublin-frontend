import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Title, Avatar } from '@mantine/core';
import Header from '../../components/header';

function Home () {

  const user = useSelector(state => state.user);

  const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          {user.picture ? (
            <Avatar src={`${imageCDNPath}/users/avatars/${+user.id}/${user.picture}`} alt="Foto de perfil" />
          ) : (
            <Avatar src={`${imageCDNPath}/sample-folder/avatar-undefined_Kblh5CBKPp.jpg`} alt="Foto de perfil" />
          )}
          <Title order={3}>Minha conta</Title>
          <Title order={4}>{user.name} {user.lastname} ({user.username})</Title>
        </Box>
      </Container>
    </>
  );
};

export default Home;