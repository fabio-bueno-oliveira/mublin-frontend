import React from 'react';
import { Link } from 'react-router-dom';
import { useMantineColorScheme, Container, Flex, Button, Image } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import MublinLogoBlack from '../../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg';
import PianoLogoBlack from '../../../assets/svg/piano-logo.svg';
import PianoLogoWhite from '../../../assets/svg/piano-logo-w.svg';
import s from './header.module.css';

function Header (props) {

  const page = props.page;
  const { colorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');

  return (
    <Container 
      size={'lg'} 
      mt={14} 
      mb={16} 
      className={s.headerContainer}
    >
      <Flex
        mih={50}
        justify='space-between'
        align='center'
        direction='row'
      >
        <Link to={{ pathname: '/' }} className={s.mublinLogo}>
          <Flex gap={3} align='center'>
            <Image src={colorScheme === 'light' ? PianoLogoBlack : PianoLogoWhite} h={largeScreen ? 43 : 43} />
            <Image src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} h={largeScreen ? 34 : 24} />
          </Flex>
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
            {page !== 'signup' && 
              <Link to={{ pathname: '/signup' }}>
                <Button 
                  size='md' 
                  color='violet'
                >
                  Cadastro
                </Button>
              </Link>
            }
          </div>
      </Flex>
    </Container>
  );
};

export default Header;