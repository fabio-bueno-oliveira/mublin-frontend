import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Flex, Title, Button } from '@mantine/core';
import s from './header.module.css';

function Header (props) {

  const page = props.page;

  return (
    <Container 
      size={'lg'} 
      mt={14} 
      mb={16} 
      className={s.headerContainer}
    >
      <Flex
        mih={50}
        justify="space-between"
        align="center"
        direction="row"
      >
        <Link to={{ pathname: '/' }} className={s.mublinLogo}>
          <Title size="2rem" c="black">Mublin</Title>
        </Link>
          <div>
            {page !== 'login' && 
              <Link to={{ pathname: '/login' }}>
                <Button
                  size="compact-md"
                  color="violet"
                  variant="transparent"
                >
                  Entrar
                </Button>
              </Link>
            }
            <Link to={{ pathname: '/signup' }}>
              <Button 
                size="md" 
                color="violet"
              >
                Cadastro
              </Button>
            </Link>
          </div>
      </Flex>
    </Container>
  );
};

export default Header;