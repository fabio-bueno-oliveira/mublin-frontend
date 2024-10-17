import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Avatar, Modal, NavLink } from '@mantine/core';
import { IconHome, IconBell, IconRocket, IconSearch, IconPlus, IconUserCircle, IconLogout, IconSettings, IconMoon, IconBrightnessUp } from '@tabler/icons-react';
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
            <IconHome stroke={1.5} />
            <span>Home</span>
          </div>
          {/* <div className={currentPath.includes("/career") && 'active'} onClick={() => navigate("/career")}>
            <IconBell stroke={1.5} />
            <span>Carreira</span>
          </div> */}
          <div className={currentPath === '/search' && 'active'} onClick={() => navigate("/search")}>
            <IconSearch stroke={1.5} />
            <span>Buscar</span>
          </div>
          <div className={currentPath === '/new' && 'active'} onClick={() => navigate("/new")}>
            <IconPlus stroke={1.5} />
            <span>Novo</span>
          </div>
          <div className={currentPath === '/notifications' && 'active'} onClick={() => navigate("/notifications")}>
            <IconBell stroke={1.5} />
            <span>Notificações</span>
          </div>
          <div 
            className='userPicture'
            onClick={() => setMobileMenuOpen(true)}
          >
            {/* {userInfo.picture ? (
              <Image size='mini' circular src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} alt="Foto de perfil" />
            ) : (
              <Image size='mini' circular src='https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' alt="Foto de perfil" />
            )} */}
            {userInfo.picture && 
            <Avatar 
              // variant="filled" 
              // radius="xl" 
              // size="md" 
              src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture}
              alt="Foto de perfil"
            />
            }
          </div>
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