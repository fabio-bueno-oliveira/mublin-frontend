import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../../store/actions/user';
import { Container, Modal, Center, Blockquote, Title, Text, Group, Button } from '@mantine/core';
import { IconArrowRight, IconMessage } from '@tabler/icons-react';
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  let navigate = useNavigate();
  const user = useSelector(state => state.user);

  const goToStep1 = () => {
    navigate('/start/step1');
  }
  
  const [modalOpen, setModaOpen] = useState(false);

  useEffect(() => { 
    if (user.previously_registered || user.bio || user.gender || user.picture) {
      setModaOpen(true);
    }
  }, [user.id]);

  return (
    <>
      <HeaderWelcome />
      <Container size={'sm'} mt={70}>
        <Title ta="center" order={3}>Vamos lá, {user.name}!</Title>
        <Text ta="center" order={4}>Você está a alguns passos de tornar sua vida de artista mais produtiva.</Text>
        <Center>
          <Blockquote color="violet" cite="– Fabio Bueno, CTO do Mublin" mt="xl" p={23}>
            <Text size={'sm'}>Olá! Estamos felizes que tenha dado uma chance de conhecer nossa plataforma. O Mublin foi desenvolvido para ser uma comunidade focada na vida de quem trabalha com música. Estamos em fase inicial de lançamento e buscando evoluir diariamente. Esperamos que goste do Mublin!</Text>
          </Blockquote>
        </Center>
      </Container>
      <Modal 
        opened={modalOpen} 
        onClose={() => setModaOpen(false)} 
        title="Você já possui alguns dados salvos" 
        centered
        size={'md'}
      >
        <IconMessage /> 
        <Title order={5} mb={10}>Alguns dados do seu cadastro já foram preenchidos anteriormente.</Title>
        <Title order={5} mb={10}>Isto pode ocorrer por dois motivos:</Title>
        <Text size='sm'>1) Você iniciou os primeiros passos mas não concluiu</Text>
        <Text size='sm'>2) Alguns dos seus dados foram previamente cadastrado por outro usuário para facilitar sua jornada</Text>
        <Group mt="lg" justify="flex-end">
          <Button onClick={() => setModaOpen(false)}  color="violet">
            Entendi
          </Button>
        </Group>
      </Modal>
      <footer className='onFooter'>
        <Button 
          color='violet' 
          size='lg'
          onClick={() => goToStep1()}
          rightSection={<IconArrowRight size={14} />}
          disabled={user.requesting}
        >
          Avançar
        </Button>
      </footer>
    </>
  );
};

export default StartFirstStep;