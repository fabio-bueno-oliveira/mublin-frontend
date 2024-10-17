import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Modal, NavLink, Text } from '@mantine/core';
import { IconHome, IconSearch, IconPlus, IconUserCircle, IconLogout, IconSettings, IconMoon, IconBrightnessUp, IconMenu2, IconMusic } from '@tabler/icons-react';
import './styles.scss';

const FooterMenuMobile = () => {

  let navigate = useNavigate();
  let currentPath = window.location.pathname
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user)
  const [mobilMenuOpen, setMobileMenuOpen] = useState(false)
  const { colorScheme, setColorScheme,  } = useMantineColorScheme();

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, [dispatch]);

  const goToProfile = () => {
    setMobileMenuOpen(false)
    navigate('/'+userInfo.username)
  }

  const goToSettings = () => {
    setMobileMenuOpen(false)
    navigate('/settings')
  }

  const logout = () => {
    dispatch(userActions.logout());
  }

  return (
    <>
      <footer className="menuMobile mantine-hidden-from-sm">
        <div>
          <div className={currentPath === '/home' && 'active'} onClick={() => navigate("/home")}>
            <IconHome stroke={currentPath === '/home' ? 1.9 : 1.5} />
            <Text size="xs" fw={currentPath === '/home' && 500}>Home</Text>
          </div>
          {/* <div className={currentPath.includes("/career") && 'active'} onClick={() => navigate("/career")}>
            <IconBell stroke={1.5} />
            <span>Carreira</span>
          </div> */}
          <div className={currentPath === '/my-projects' && 'active'} onClick={() => navigate("/my-projects")}>
            <IconMusic stroke={currentPath === '/my-projects' ? 1.9 : 1.5} />
            <Text size="xs" fw={currentPath === '/my-projects' && 500}>Projetos</Text>
          </div>
          <div className={currentPath === '/search' && 'active'} onClick={() => navigate("/search")}>
            <IconSearch stroke={currentPath === '/search' ? 1.9 : 1.5} />
            <Text size="xs" fw={currentPath === '/search' && 500}>Buscar</Text>
          </div>
          <div className={currentPath === '/new' && 'active'} onClick={() => navigate("/new")}>
            <IconPlus stroke={currentPath === '/new' ? 1.9 : 1.5} />
            <Text size="xs" fw={currentPath === '/new' && 500}>Novo</Text>
          </div>
          {/* <div className={currentPath === '/notifications' && 'active'} onClick={() => navigate("/notifications")}>
            <IconBell stroke={1.5} />
            <span>Notificações</span>
          </div> */}
          <div  
            onClick={() => setMobileMenuOpen(true)}
          >
            <IconMenu2 stroke={1.5} style={{ marginTop: 6 }} />
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
        withCloseButton={false}
      >
        <NavLink
          label="Ver meu perfil"
          leftSection={<IconUserCircle size="1rem" stroke={1.5} />}
          onClick={goToProfile}
        />
        <NavLink
          label="Configurações"
          leftSection={<IconSettings size="1rem" stroke={1.5} />}
          onClick={goToSettings}
        />
        {colorScheme === 'dark' && 
          <NavLink
            label="Mudar para o tema claro"
            leftSection={<IconBrightnessUp size="1rem" stroke={1.5} />}
            onClick={() => {setColorScheme('light')}}
          />
        }
        {colorScheme === 'light' && 
          <NavLink
            label="Mudar para o tema escuro"
            leftSection={<IconMoon size="1rem" stroke={1.5} />}
            onClick={() => {setColorScheme('dark')}}
          />
        }
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