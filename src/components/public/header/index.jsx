import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Flex, Title, Button } from '@mantine/core';
import s from './header.module.css';

function Header () {

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
            <Link to={{ pathname: '/login' }}>
              <Button
                size="md"
                color="violet"
                variant="transparent"
              >
                Entrar
              </Button>
            </Link>
            <Link to={{ pathname: '/signup' }}>
              <Button 
                size="md" 
                color="violet"
              >
                Cadastrar grátis
              </Button>
            </Link>
          </div>
      </Flex>
    </Container>
  );
};

export default Header;