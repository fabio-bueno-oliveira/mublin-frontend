import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineColorScheme, Container, Flex, Box, Title, Text, Button } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus, IconChevronRight, IconBox } from '@tabler/icons-react';

function New () {

  document.title = 'Criar novo projeto | Mublin'

  let navigate = useNavigate();

  const { colorScheme } = useMantineColorScheme();

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
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='lg'
              radius='xl'
              leftSection={<IconMusicPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
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
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='lg'
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
              size='lg'
              radius='xl'
              leftSection={<IconBox size={22} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Novo equipamento
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={20}>
              Cadastre um projeto ainda em idealização para atrair interessados em participar
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='lg'
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
              size='lg'
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