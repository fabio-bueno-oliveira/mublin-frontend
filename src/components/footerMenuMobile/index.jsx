import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Modal, NavLink, Text, Divider, Group, Avatar } from '@mantine/core';
import { IconHome, IconSearch, IconPlus, IconUserCircle, IconLogout, IconSettings, IconMoon, IconBrightnessUp, IconMenu2, IconMusic } from '@tabler/icons-react';
import './styles.scss';

const FooterMenuMobile = () => {

  let navigate = useNavigate();
  let currentPath = window.location.pathname
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user)
  const [mobilMenuOpen, setMobileMenuOpen] = useState(false)
  const { colorScheme, setColorScheme,  } = useMantineColorScheme();

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
      <footer className="menuMobile mantine-hidden-from-sm">
        <div>
          <div className={currentPath === '/home' ? 'active' : undefined} onClick={() => navigate("/home")}>
            <IconHome />
            <Text size="xs">Home</Text>
          </div>
          {/* <div className={currentPath.includes("/career") && 'active'} onClick={() => navigate("/career")}>
            <IconBell />
            <span>Carreira</span>
          </div> */}
          <div className={(currentPath === '/my-projects' || currentPath.includes('/project')) ? 'active' : undefined} onClick={() => navigate("/my-projects")}>
            <IconMusic />
            <Text size="xs">Projetos</Text>
          </div>
          <div className={currentPath === '/search' ? 'active' : undefined} onClick={() => navigate("/search")}>
            <IconSearch />
            <Text size="xs">Buscar</Text>
          </div>
          <div className={currentPath === '/new' ? 'active' : undefined} onClick={() => navigate("/new")}>
            <IconPlus />
            <Text size="xs">Novo</Text>
          </div>
          {/* <div className={currentPath === '/notifications' && 'active'} onClick={() => navigate("/notifications")}>
            <IconBell />
            <span>Notificações</span>
          </div> */}
          <div  
            onClick={() => setMobileMenuOpen(true)}
          >
            <IconMenu2 style={{ marginTop: 6 }} />
          </div>
          {/* <div 
            className='userPicture'
            onClick={() => setMobileMenuOpen(true)}
          >
            {userInfo.picture && 
            <Avatar 
              // variant="filled" 
              // radius="xl" 
              // size="md" 
              src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture}
              alt="Foto de perfil"
            />
            }
          </div> */}
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
          label="Ver meu perfil"
          leftSection={<IconUserCircle size="1rem" stroke={1.5} />}
          onClick={goToProfile}
        />
        <Divider my="xs" />
        <NavLink
          label="Configurações"
          leftSection={<IconSettings size="1rem" stroke={1.5} />}
          onClick={goToSettings}
        />
        {colorScheme === 'dark' && 
          <NavLink
            label="Mudar para o tema claro"
            leftSection={<IconBrightnessUp size="1rem" stroke={1.5} />}
            onClick={() => setNewColorTheme('light')}
          />
        }
        {colorScheme === 'light' && 
          <NavLink
            label="Mudar para o tema escuro"
            leftSection={<IconMoon size="1rem" stroke={1.5} />}
            onClick={() => setNewColorTheme('dark')}
          />
        }
        <Divider my="xs" />
        <NavLink
          label="Sair"
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
          onClick={() => logout()}
        />
      </Modal>
    </>
  );
};

export default FooterMenuMobile;