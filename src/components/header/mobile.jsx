import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { useMantineColorScheme, Container, Flex, Image } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import s from './header.module.css';

function Header (props) {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const { colorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  useEffect(() => { 
    if (props.pageType === 'home' && refreshCounter > 0) {
      dispatch(userInfos.getInfo());
      dispatch(userProjectsInfos.getUserProjects(user.id,'all'));
    }
  }, [refreshCounter]);

  return (
    <>
      <Container 
        size={'lg'} 
        mt={8} 
        mb={8} 
        className={s.headerContainer}
      >
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
        >
          <Link 
            to={{ pathname: '/home' }} 
            className='mublinLogo'
            onClick={() => setRefreshCounter(refreshCounter + 1)}
          >
            <Flex align='center'>
              {/* <Image src={colorScheme === 'light' ? PianoLogoBlack : PianoLogoWhite} h={largeScreen ? 43 : 27} /> */}
              <Image src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} h={largeScreen ? 22 : 28} />
            </Flex>
          </Link>
        </Flex>
      </Container>
    </>
  );
};

export default Header;