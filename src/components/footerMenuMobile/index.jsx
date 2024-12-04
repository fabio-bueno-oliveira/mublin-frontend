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
          <div className={currentPath === '/home' ? 'item active' : 'item'} onClick={() => navigate("/home")}>
            <IconHome />
            <Text size="12px" fw="600">Home</Text>
          </div>
          {/* <div className={currentPath.includes("/career") && 'active'} onClick={() => navigate("/career")}>
            <IconBell />
            <span>Carreira</span>
          </div> */}
          <div className={(currentPath === '/my-projects' || currentPath.includes('/project')) ? 'item active' : 'item'} onClick={() => navigate("/my-projects")}>
            <IconMusic />
            <Text size="12px" fw="600">Projetos</Text>
          </div>
          <div className={currentPath === '/search' ? 'item active' : 'item'} onClick={() => navigate("/search")}>
            <IconSearch />
            <Text size="12px" fw="600">Buscar</Text>
          </div>
          <div className={currentPath === '/new' ? 'item active' : 'item'} onClick={() => navigate("/new")}>
            <IconPlus />
            <Text size="12px" fw="600">Novo</Text>
          </div>
          {/* <div className={currentPath === '/notifications' && 'active'} onClick={() => navigate("/notifications")}>
            <IconBell />
            <span>Notificações</span>
          </div> */}
          <div  
            onClick={() => setMobileMenuOpen(true)}
            className="avatar"
          >
            {/* <IconMenu2 style={{ marginTop: 6 }} /> */}
            <Avatar 
              size="40px"
              src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture}
              alt="Foto de perfil"
            />
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