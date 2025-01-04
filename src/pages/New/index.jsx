import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineColorScheme, Container, Flex, Box, Text, Button, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import HeaderMobile from '../../components/header/mobile';
import FooterMenuMobile from '../../components/footerMenuMobile';
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus, IconChevronRight, IconBox } from '@tabler/icons-react';

function New () {

  document.title = 'Criar novo | Mublin';

  let navigate = useNavigate();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      {isMobile ? (
        <HeaderMobile page='new' />
      ) : (
        <Header />
      )}
      <Container size={'xs'} mt={18}>
        <Flex mb={24} mt={18} direction="column" gap={18}>
        <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconMusicPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
              onClick={() => navigate('/new/post')}
            >
              Nova postagem
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Crie uma postagem para o feed
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconMusicPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
              onClick={() => navigate('/new/project')}
            >
              Novo projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Cadastre projetos de música (novos ou em atividade)
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconBulb size={19} />}
              rightSection={<IconChevronRight size={12} />}
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
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconBox size={22} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Novo equipamento
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Cadastre um novo produto em sua lista de equipamentos
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconUserPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Ingressar em um projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Ingresse em projetos cadastrados no Mublin 
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='sm'
              radius='xl'
              leftSection={<IconSend size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Convidar para projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Convide por e-mail músicos que ainda não estão cadastrados no Mublin
            </Text>
          </Box>
        </Flex>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default New;