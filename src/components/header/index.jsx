import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { Container, Flex, Title, Button } from '@mantine/core';
import s from './header.module.css';

function Header () {

  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, [dispatch]);

  const userInfo = useSelector(state => state.user);

  console.log(19, userInfo);

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
          <Title>Mublin</Title>
        </Link>
          <div>
            <Button 
              size="md" 
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