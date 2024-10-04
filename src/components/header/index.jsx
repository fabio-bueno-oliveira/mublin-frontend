import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { Container, Flex, Title, Text, Button } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import s from './header.module.css';

function Header () {

  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, [dispatch]);

  const user = useSelector(state => state.user);

  const logout = () => {
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
        <Link to={{ pathname: '/' }} className={s.mulinLogo}>
          <Title order={3}>Mublin</Title>
        </Link>
          <div>
            <Button 
              size="sm" 
              variant='transparent'
              color="violet"
              leftSection={<IconUser size={14} />}
            >
              {user.username}
            </Button>
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