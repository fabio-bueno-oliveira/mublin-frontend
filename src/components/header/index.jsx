import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button } from '@mantine/core';
import { IconUser, IconBulb, IconMoon } from '@tabler/icons-react';
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
          <div>
            <Button 
              size="sm" 
              variant={colorScheme === 'light' ? 'outline' : 'transparent'}
              color="violet"
              leftSection={<IconBulb size={14} />}
              onClick={() => setColorScheme('light')}
            >
              Claro
            </Button>
            <Button 
              size="sm" 
              variant={colorScheme === 'dark' ? 'outline' : 'transparent'}
              color="violet"
              leftSection={<IconMoon size={14} />}
              onClick={() => setColorScheme('dark')}
            >
              Escuro
            </Button>
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
          </div>
      </Flex>
    </Container>
  );
};

export default Header;