import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Center, Title, Text, Button, Image, Modal, Group } from '@mantine/core';
import { IconArrowRight  } from '@tabler/icons-react';
import HeaderWelcome from '../../../components/header/welcome';

function StartFirstStep () {

  let navigate = useNavigate();
  const user = useSelector(state => state.user);

  const goToStep1 = () => {
    navigate('/start/step1');
  }

  const imageAstronaut = 'https://ik.imagekit.io/mublin/misc/astronaut-musician-3.png?updatedAt=1731982735493';
  
  const [showPreviouslyRegisteredAlert, setShowPreviouslyRegisteredAlert] = useState(false);

  useEffect(() => { 
    if (user.previously_registered || user.bio || user.gender || user.picture) {
      setShowPreviouslyRegisteredAlert(true);
    }
  }, [user.id]);

  return (
    <>
      <HeaderWelcome />
      <Container size={'sm'} mt={70}>
        <Title ta="center" order={3}>Vamos lá, {user.name}!</Title>
        <Text ta="center" order={4}>Estamos prestes a tornar sua vida na música ainda mais produtiva e conectada.</Text>
        {/* <Center>
          <Blockquote color="violet" cite="– Fabio Bueno, CTO do Mublin" mt="xl" p={23}>
            <Text size={'sm'}>Olá! Estamos felizes que tenha dado uma chance de conhecer nossa plataforma. O Mublin foi desenvolvido para ser uma comunidade focada na vida de quem trabalha com música. Estamos em fase inicial de lançamento e buscando evoluir diariamente. Esperamos que goste do Mublin!</Text>
          </Blockquote>
        </Center> */}
        <Center>
          <Image 
            src={imageAstronaut} 
            h={180}
            fit={'contain'}
          />
        </Center>
      </Container>
      <Modal opened={showPreviouslyRegisteredAlert} onClose={() => setShowPreviouslyRegisteredAlert(false)} title="Oba!" centered>
        <Text>Alguns dos seus dados já foram previamente cadastrados por você ou pela nossa equipe para facilitar sua jornada :)</Text>
        <Group justify='flex-end' mt='14'>
          <Button color='violet' onClick={() => setShowPreviouslyRegisteredAlert(false)}>
            Entendi!
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