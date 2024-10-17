import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button, Avatar, ActionIcon, rem } from '@mantine/core';
import { IconMoon, IconBrightnessUp } from '@tabler/icons-react';
import s from './header.module.css';

function Header () {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { colorScheme, setColorScheme,  } = useMantineColorScheme();

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
          <Link to={{ pathname: '/my-account' }}>
            <Avatar
              size="sm"
              src={cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture}
              alt={user.username}
            />
          </Link>
          <Link to={{ pathname: '/my-account' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color="dark"
              p={'xs'}
            >
              Olá, {user.name}!
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