import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Flex, Title, Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
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
            <Button size="md" variant="transparent" color="violet">Cadastro</Button>
            <Link to={{ pathname: '/login' }}>
              <Button
                size="md"
                color="violet"
                rightSection={<IconArrowRight size={14}/>}
              >
                Login
              </Button>
            </Link>
          </div>
      </Flex>
    </Container>
  );
};

export default Header;