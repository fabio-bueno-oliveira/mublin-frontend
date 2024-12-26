import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineColorScheme, Drawer, Box, Flex, Button, Text } from '@mantine/core';
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus, IconChevronRight, IconBox, IconHome, IconSearch, IconUser, IconHexagonPlusFilled, IconMusic } from '@tabler/icons-react';
import './styles.scss';

const FooterMenuMobile = () => {

  let navigate = useNavigate()
  let currentPath = window.location.pathname
  const { colorScheme } = useMantineColorScheme()
  const [drawerNewIsOpen, setDrawerNewIsOpen] = useState(false)

  return (
    <>
      <footer className="menuMobile mantine-hidden-from-sm">
        <div>
          <div
            className={currentPath === '/home' ? 'active' : undefined} 
            onClick={() => navigate("/home")}
          >
            <IconHome />
          </div>
          <div className={(currentPath === '/projects' || currentPath.includes('/project')) ? 'active' : undefined} onClick={() => navigate("/projects")}>
            <IconMusic />
          </div>
          <div className={currentPath === '/new' ? 'active plus' : 'plus'} onClick={() => setDrawerNewIsOpen(prevCheck => !prevCheck)}>
            <IconHexagonPlusFilled />
          </div>
          <div className={currentPath === '/search' ? 'active' : undefined} onClick={() => navigate("/search")}>
            <IconSearch />
          </div>
          <div className={currentPath === '/menu' ? 'active' : undefined} onClick={() => navigate("/menu")}>
            <IconUser />
          </div>
        </div>
      </footer>
      <Drawer
        offset={8}
        radius='md'
        opened={drawerNewIsOpen}
        onClose={() => setDrawerNewIsOpen(false)}
        title='O que deseja criar?'
        position='bottom'
      >
        <Flex mb={76} mt={4} direction='column' gap={18}>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === 'light' ? 'violet' : 'violet'}
              size='md'
              radius='xl'
              leftSection={<IconMusicPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
              onClick={() => navigate('/new/project')}
            >
              Novo projeto
            </Button>
            <Text ta='center' size='xs' c='dimmed' mt={5} px={10}>
              Cadastre projetos de música (novos ou já em atividade)
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='md'
              radius='xl'
              leftSection={<IconBulb size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Nova ideia de projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={10}>
              Cadastre um projeto ainda em idealização para atrair interessados em participar
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='md'
              radius='xl'
              leftSection={<IconBox size={22} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Novo equipamento
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={10}>
              Cadastre um projeto ainda em idealização para atrair interessados em participar
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='md'
              radius='xl'
              leftSection={<IconUserPlus size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Ingressar em um projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={10}>
              Ingresse em projetos cadastrados no Mublin 
            </Text>
          </Box>
          <Box>
            <Button
              variant='outline'
              color={colorScheme === "light" ? 'violet' : 'violet'}
              size='md'
              radius='xl'
              leftSection={<IconSend size={19} />}
              rightSection={<IconChevronRight size={12} />}
              fullWidth
            >
              Convidar para projeto
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={10}>
              Convide por e-mail músicos que ainda não estão cadastrados no Mublin
            </Text>
          </Box>
        </Flex>
      </Drawer>
    </>
  );
};

export default FooterMenuMobile;