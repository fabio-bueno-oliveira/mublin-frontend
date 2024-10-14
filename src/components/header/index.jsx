import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button, ActionIcon, rem } from '@mantine/core';
import { IconUser, IconMoon, IconBrightnessUp } from '@tabler/icons-react';
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
        <Link to={{ pathname: '/home' }} className={s.mulinLogo}>
          <Title order={3}>Mublin</Title>
        </Link>
        <Flex>
          <Link to={{ pathname: '/my-account' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color="violet"
              leftSection={<IconUser size={14} />}
            >
              {user.username}
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant='transparent'
            color="violet"
            onClick={() => logout()}
          >
            Sair
          </Button>
          {colorScheme === 'dark' && 
            <ActionIcon 
              variant="transparent" size="lg" color="violet" 
              onClick={() => {setColorScheme('light')}}
            >
              <IconBrightnessUp style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          }
          {colorScheme === 'light' && 
            <ActionIcon variant="transparent" size="lg" color="violet" 
              onClick={() => {setColorScheme('dark')}}
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