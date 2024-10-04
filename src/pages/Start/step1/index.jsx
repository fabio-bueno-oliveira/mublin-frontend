import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Title, Avatar, Stepper, Button, Group } from '@mantine/core';
import Header from '../../../components/header';

function StartFirstStep () {

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
          <Title order={3}>Intro - Cadastro</Title>
          <Title order={4}>{user.name} {user.lastname} ({user.username})</Title>
        </Box>

        <Stepper active={0}>
          <Stepper.Step label="Passo 1" description="Defina sua foto de perfil">
            Passo 1: Defina sua foto de perfil
          </Stepper.Step>
          <Stepper.Step label="Passo 2" description="Conte um pouco sobre você">
            Passo 2: Conte um pouco sobre você
          </Stepper.Step>
          <Stepper.Step label="Passo 3" description="Sua ligação com a música">
            Passo 3: Sua ligação com a música
          </Stepper.Step>
          <Stepper.Step label="Passo 4" description="Seus projetos musicais">
            Passo 4: Seus projetos musicais
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </Container>
    </>
  );
};

export default StartFirstStep;