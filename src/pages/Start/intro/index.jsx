import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Title, Avatar, Stepper, Button, Group } from '@mantine/core';
import Header from '../../../components/header';

function StartFirstStep () {

  const user = useSelector(state => state.user);

  const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';

  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
          <Title order={3}>Opa, {user.name} {user.lastname}!</Title>
          <Title order={4}>Você está a alguns passos de tornar sua vida de artista mais produtiva. Aproveite!</Title>
        </Box>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartFirstStep;