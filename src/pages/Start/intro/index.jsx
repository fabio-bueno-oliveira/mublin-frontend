import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Alert  } from '@mantine/core';
import { IconArrowRight, IconMoodSmile  } from '@tabler/icons-react';
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  let navigate = useNavigate();
  const user = useSelector(state => state.user);

  const goToStep1 = () => {
    navigate('/start/step1');
  }
  
  const [showAlertSavedData, setShowAlertSavedData] = useState(false);

  useEffect(() => { 
    if (user.previously_registered || user.bio || user.gender || user.picture) {
      setShowAlertSavedData(true);
    }
  }, [user.id]);

  return (
    <>
      <HeaderWelcome />
      <Container size={'sm'} mt={70}>
        <Title ta="center" order={3}>Vamos lá, {user.name}!</Title>
        <Text ta="center" order={4}>Você está a alguns passos de tornar sua vida de artista mais produtiva.</Text>
        {/* <Center>
          <Blockquote color="violet" cite="– Fabio Bueno, CTO do Mublin" mt="xl" p={23}>
            <Text size={'sm'}>Olá! Estamos felizes que tenha dado uma chance de conhecer nossa plataforma. O Mublin foi desenvolvido para ser uma comunidade focada na vida de quem trabalha com música. Estamos em fase inicial de lançamento e buscando evoluir diariamente. Esperamos que goste do Mublin!</Text>
          </Blockquote>
        </Center> */}
        {showAlertSavedData && 
          <Alert 
            variant="light" 
            color="violet" 
            title="Identificamos que lguns dados do seu cadastro já foram preenchidos anteriormente"
            icon={<IconMoodSmile />}
            mt={50}
          >
            <Text size='sm' mb={10}>Oba! Você já iniciou os primeiros passos anteriormente, ou alguns dos seus dados foram previamente cadastrados por outro usuário para facilitar sua jornada!</Text>
          </Alert>
        }
      </Container>
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