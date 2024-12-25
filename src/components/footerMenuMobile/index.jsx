import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Modal, Drawer, Box, Flex, Button, NavLink, Text, Divider, Group, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMusicPlus, IconBulb, IconSend, IconUserPlus, IconChevronRight, IconBox, IconHome, IconSearch, IconUser, IconUserCircle, IconLogout, IconSettings, IconMoon, IconBrightnessUp, IconHexagonPlusFilled, IconMusic } from '@tabler/icons-react';
import './styles.scss';

const FooterMenuMobile = () => {

  let navigate = useNavigate()
  let currentPath = window.location.pathname
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user)
  const [mobilMenuOpen, setMobileMenuOpen] = useState(false)
  const { colorScheme, setColorScheme,  } = useMantineColorScheme()
  const [drawerNewIsOpen, setDrawerNewIsOpen] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  const goToProfile = () => {
    setMobileMenuOpen(false)
    navigate('/'+userInfo.username)
  }

  const goToSettings = () => {
    setMobileMenuOpen(false)
    navigate('/settings')
  }

  const setNewColorTheme = (option) => {
    setColorScheme(option);
    setMobileMenuOpen(false);
  }

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  return (
    <>
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
      <footer className="menuMobile mantine-hidden-from-sm">
        <div>
          <div className={currentPath === '/home' ? 'active' : undefined} onClick={() => navigate("/home")}>
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
      <Modal 
        opened={mobilMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        centered
        title={
          <Group gap={10}>
            <Avatar 
              size="sm" 
              src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture}
              alt="Foto de perfil"
            />
            <Text>{userInfo.username}</Text>
          </Group>
        }
        // withCloseButton={false}
      >
        <NavLink
          label={<Text fz={16}>Ver meu perfil</Text>}
          leftSection={<IconUserCircle size="1.5rem" stroke={1.5} />}
          onClick={goToProfile}
        />
        <Divider my="xs" />
        <NavLink
          label={<Text fz={16}>Configurações</Text>}
          leftSection={<IconSettings size="1.5rem" stroke={1.5} />}
          onClick={goToSettings}
        />
        {colorScheme === 'dark' && 
          <NavLink
            label={<Text fz={16}>Mudar para o tema claro</Text>}
            leftSection={<IconBrightnessUp size="1.5rem" stroke={1.5} />}
            onClick={() => setNewColorTheme('light')}
          />
        }
        {colorScheme === 'light' && 
          <NavLink
            label={<Text fz={16}>Mudar para o tema escuro</Text>}
            leftSection={<IconMoon size="1.5rem" stroke={1.5} />}
            onClick={() => setNewColorTheme('dark')}
          />
        }
        <Divider my="xs" />
        <NavLink
          label={<Text fz={16}>Sair</Text>}
          leftSection={<IconLogout size="1.5rem" stroke={1.5} />}
          onClick={() => logout()}
        />
      </Modal>
    </>
  );
};

export default FooterMenuMobile;