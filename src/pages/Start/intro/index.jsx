import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Center, Blockquote, Title, Text, Button } from '@mantine/core';
import { IconBubble, IconArrowRight } from '@tabler/icons-react';
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  let navigate = useNavigate();
  const user = useSelector(state => state.user);

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  return (
    <>
      <HeaderWelcome />
      <Container size={'sm'} mt={70}>
        <Title ta="center" order={3}>Vamos lá, {user.name}!</Title>
        <Text ta="center" order={4}>Você está a alguns passos de tornar sua vida de artista mais produtiva.</Text>
        <Center>
          <Blockquote color="blue" cite="– Fabio Bueno, CTO do Mublin" icon={<IconBubble />} mt="xl" p={23}>
            <Text size={'sm'}>Olá! Estamos felizes que tenha dado uma chance de conhecer nossa plataforma. O Mublin foi desenvolvido para ser uma comunidade focada na vida de quem trabalha com música. Estamos em fase inicial de lançamento e buscando evoluir diariamente. Esperamos que goste do Mublin!</Text>
          </Blockquote>
        </Center>
      </Container>
      <footer className='onFooter'>
        <Button 
          color='violet' 
          onClick={() => goToStep1()}
          rightSection={<IconArrowRight size={14} />}  
        >
          Avançar
        </Button>
      </footer>
    </>
  );
};

export default StartFirstStep;