import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Container, Box, Title, Select, Stepper, Button, Group, rem } from '@mantine/core';
import { IconNumber1, IconNumber2, IconNumber3, IconNumber4 } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../../components/header';

function StartThirdStep () {

  document.title = "Passo 3 de 4";

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const user = useSelector(state => state.user);
  const imageCDNPath = 'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/';

  useEffect(() => { 
    dispatch(miscInfos.getMusicGenres());
  }, [dispatch, user.id]);

  const goToStep2 = () => {
    navigate('/start/step2');
  }

  const goToStep4 = () => {
    navigate('/start/step4');
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mt={largeScreen ? 20 : 8}>
        <Stepper color='violet' active={2} size={largeScreen ? "sm" : "xs"} >
          <Stepper.Step icon={<IconNumber1 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber2 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber3 style={{ width: rem(18), height: rem(18) }} />} />
          <Stepper.Step icon={<IconNumber4 style={{ width: rem(18), height: rem(18) }} />} />
        </Stepper>
        <Title order={5} my={14}>Sua ligação com a música</Title>

        <Select
          label="Quais os principais estilos musicais relacionados à sua atuação na música?"
          placeholder="Escolha um País"
          data={['Brasil', 'Estados Unidos']}
        />

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={() => goToStep2()}>Voltar</Button>
          <Button color='violet' onClick={() => goToStep4()}>Avançar</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartThirdStep;