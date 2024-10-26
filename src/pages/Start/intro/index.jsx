import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Center, Blockquote, Title, Text, Button, Group } from '@mantine/core';
import { IconBubble } from '@tabler/icons-react';
import Header from '../../../components/header';

function StartFirstStep () {

  let navigate = useNavigate();
  const user = useSelector(state => state.user);

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  return (
    <>
      <Header />
      <Container size={'lg'} mt={70}>
        <Title ta="center" order={3}>Vamos lá, {user.name}!</Title>
        <Text ta="center" order={4}>Você está a alguns passos de tornar sua vida de artista mais produtiva.</Text>

        <Center>
          <Blockquote color="blue" cite="– Fabio Bueno, CTO do Mublin" icon={<IconBubble />} mt="xl" p={23}>
            <Text size={'sm'}>Olá amigos! Fabio aqui. Estamos felizes que tenha dado uma chance de conhecer nossa plataforma! O Mublin não foi desenvolvido para ser apenas mais uma rede social — é uma ferramenta focada na vida de quem trabalha com música. Estamos em fase testes, e por isso ajustes serão necessários. Contamos com seu feedback e esperamos que goste do Mublin. Aproveite!</Text>
          </Blockquote>
        </Center>

        <Group justify="center" mt="lg">
          {/* <Button variant="default" onClick={prevStep}>Back</Button> */}
          <Button onClick={() => goToStep1()}>Avançar</Button>
        </Group>
      </Container>
    </>
  );
};

export default StartFirstStep;