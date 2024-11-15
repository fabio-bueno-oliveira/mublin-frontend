import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { userActions } from '../../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button, Avatar, ActionIcon, rem } from '@mantine/core';
import { IconMoon, IconBrightnessUp } from '@tabler/icons-react';
import s from '../header.module.css';

function HeaderWelcome () {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const { colorScheme, setColorScheme } = useMantineColorScheme();

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
      mt={8} 
      mb={8} 
      className={s.headerContainer}
    >
      <Flex
        mih={50}
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
      >
        <Title order={3} style={{flex:'1', cursor:'default'}}>Mublin</Title>
        <Flex align={"center"} justify="flex-end" style={{flex:'1'}}>   
          <Avatar
            size="md"
            src={user.picture ? cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : undefined}
            alt={user.username}
            ml={8}
          />
          {colorScheme === 'dark' && 
            <ActionIcon 
              variant="transparent" size="lg" color="default" 
              onClick={() => {setColorScheme('light')}}
              ml={14}
            >
              <IconBrightnessUp style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          }
          {colorScheme === 'light' && 
            <ActionIcon variant="transparent" size="lg" color="default" 
              onClick={() => {setColorScheme('dark')}}
              ml={14}
            >
              <IconMoon style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          }
          <Button 
            size="sm" 
            variant='transparent'
            color="dark"
            onClick={() => logout()}
            p={'xs'}
          >
            Sair
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default HeaderWelcome;