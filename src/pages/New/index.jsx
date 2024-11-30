import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Flex, Box, Title, Text, Button } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus } from '@tabler/icons-react';

function New () {

  document.title = 'Criar novo projeto | Mublin'

  let navigate = useNavigate();

  return (
    <>
      <Header />
      <Container size={'xs'} mt={32}>
        <Title order={2} ta="center">
          Criar novo
        </Title>
        <Flex mb={24} mt={18} direction="column" gap={18}>
          <Box>
            <Button
              color="violet"
              leftSection={<IconMusicPlus size={14} />}
              fullWidth
              onClick={() => navigate('/new/project')}
            >
              Novo projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Cadastre projetos de música (novos ou já em atividade)
            </Text>
          </Box>
          <Box>
            <Button
              color="violet"
              leftSection={<IconBulb size={14} />}
              fullWidth
            >
              Nova ideia de projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Cadastre um projeto ainda em idealização para atrair interessados em participar
            </Text>
          </Box>
          <Box>
            <Button
              color="violet"
              leftSection={<IconUserPlus size={14} />}
              fullWidth
            >
              Ingressar em projeto já cadastrado
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Ingresse em projetos já cadastrados no Mublin 
            </Text>
          </Box>
          <Box>
            <Button
              color="violet"
              leftSection={<IconSend size={14} />}
              fullWidth
            >
              Convidar alguém para um projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Envie um convite por e-mail para músicos que ainda não estão cadastrados no projeto
            </Text>
          </Box>
        </Flex>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default New;