import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Title, Text, Input, Stepper, Button, Group, rem } from '@mantine/core';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4 } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../../components/header';

function StartFourthStep () {

  document.title = "Passo 44";

  let navigate = useNavigate();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);
  const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';

  const goToStep3 = () => {
    navigate('/start/step3');
  }

  const goToHome = () => {
    navigate('/home');
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={3} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title order={5} my={14}>Seus projetos musicais</Title>
        <Text order={5} my={14}>De quais projetos ou bandas você participa ou já participou?</Text>
        <Group>
          <Text>Pesquise abaixo</Text>
          <Input w={300} placeholder="Digite o nome do projeto ou banda..." />
          <Button variant='outline' color='violet' size="xs">ou cadastre um novo projeto</Button>
        </Group>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={() => goToStep3()}>Voltar</Button>
          <Button color='violet' onClick={() => goToHome()}>Concluir</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartFourthStep;