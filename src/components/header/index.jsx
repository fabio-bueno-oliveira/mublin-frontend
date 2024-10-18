import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button, Avatar, ActionIcon, Text, rem } from '@mantine/core';
import { IconMoon, IconBrightnessUp } from '@tabler/icons-react';
import s from './header.module.css';

function Header () {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { colorScheme, setColorScheme,  } = useMantineColorScheme();
  let currentPath = window.location.pathname

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  const cdnBaseURL = 'https://ik.imagekit.io/mublin';

  return (
    <Container 
      size={'lg'} 
      mt={14} 
      mb={16} 
      className={s.headerContainer}
    >
      <Flex
        mih={50}
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
      >
        <Link to={{ pathname: '/home' }} className='mublinLogo'>
          <Title order={3}>Mublin</Title>
        </Link>
        <Flex align={"center"}>
          <Text fw={400} size='sm' ml={6} mr={8} c='dimmed'>Olá, {user.name}!</Text>
          <Link to={{ pathname: '/home' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color={currentPath === '/home' ? 'violet' : 'dark'}
              p={'xs'}
              visibleFrom="md"
            >
              Início
            </Button>
          </Link>
          <Link to={{ pathname: '/my-projects' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color={currentPath === '/my-projects' ? 'violet' : 'dark'}
              p={'xs'}
              visibleFrom="md"
            >
              Meus Projetos
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant='transparent'
            color="dark"
            onClick={() => logout()}
            p={'xs'}
            visibleFrom="md"
          >
            Sair
          </Button>
          <Link to={{ pathname: '/my-account' }}>
            <Avatar
              size="sm"
              src={cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture}
              alt={user.username}
              ml={8}
              mr={10}
            />
          </Link>
          {colorScheme === 'dark' && 
            <ActionIcon 
              variant="transparent" size="lg" color="default" 
              onClick={() => {setColorScheme('light')}}
              visibleFrom="md"
            >
              <IconBrightnessUp style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          }
          {colorScheme === 'light' && 
            <ActionIcon variant="transparent" size="lg" color="default" 
              onClick={() => {setColorScheme('dark')}}
              visibleFrom="md"
            >
              <IconMoon style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          }
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;