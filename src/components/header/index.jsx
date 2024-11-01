import React, { useEffect, useState } from 'react';
import { Link, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Title, Button, Avatar, ActionIcon, Text, Input, rem, Group, Badge, Divider, Drawer } from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { IconMoon, IconBrightnessUp, IconSearch, IconDotsVertical } from '@tabler/icons-react';
import s from './header.module.css';

function Header (props) {

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const user = useSelector(state => state.user);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  // const [showMobileMenu, setShowMobileMenu] = useState(true)
  let currentPath = window.location.pathname;

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  const cdnBaseURL = 'https://ik.imagekit.io/mublin';

  const [searchQuery, setSearchQuery] = useState(searchedKeywords);

  const handleSearch = (e, query, tab) => {
    e.preventDefault();
    navigate({
      pathname: '/search',
      search: createSearchParams({
        keywords: query ? query : '',
        tab: tab ? tab : ''
      }).toString()
    });
  }

  const [openedDrawer, { open, close }] = useDisclosure(false);

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
        justify="space-between"
        align="center"
        direction="row"
      >
        <Group>
          <>
            <Link to={{ pathname: '/home' }} className='mublinLogo'>
              <Title order={3}>Mublin</Title>
            </Link>
            {props.pageType === 'profile' &&
              <>
                <Divider size="xs" orientation="vertical" />
                <Text mr={34}>{props.username}</Text>
              </>
            }
          </>
          {(largeScreen && user.first_access === 0) &&
            <>
              <form
                onSubmit={(e) => handleSearch(e, searchQuery, null)}
                // onFocus={() => setShowMobileMenu(false)}
                // onBlur={() => setShowMobileMenu(true)}
              >
                <Input 
                  variant="filled" 
                  size="sm"
                  placeholder='Pessoa, instrumento, cidade...'
                  value={searchQuery ? searchQuery : undefined}
                  onChange={(event) => setSearchQuery(event.currentTarget.value)}
                  rightSectionPointerEvents="all"
                />
              </form>
              <ActionIcon 
                c='dimmed' variant="transparent" aria-label="Buscar"
                onClick={(e) => handleSearch(e, searchQuery, null)}
              >
                <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </>
          }
        </Group>
        <Flex align={"center"}>
          {user.first_access === 0 && 
            <Link to={{ pathname: '/home' }}>
              <Button 
                size="sm" 
                variant='transparent'
                color={currentPath === '/home' ? 'violet' : 'dark'}
                p={'xs'}
                visibleFrom="md"
              >
                Início
              </Button>
            </Link>
          }
          {user.first_access === 0 && 
            <Link to={{ pathname: '/my-projects' }}>
              <Button 
                size="sm" 
                variant='transparent'
                color={currentPath === '/my-projects' ? 'violet' : 'dark'}
                p={'xs'}
                visibleFrom="md"
              >
                Meus Projetos
              </Button>
            </Link>
          }
          <Button 
            size="sm" 
            variant='transparent'
            color="dark"
            onClick={() => logout()}
            p={'xs'}
            visibleFrom="md"
          >
            Sair
          </Button>
          {largeScreen && 
            <>
              <Link to={{ pathname: `/${user.username}`}}>
                <Avatar
                  size="md"
                  src={cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture}
                  alt={user.username}
                  ml={8}
                />
              </Link>
              {/* <Text fw={400} size='sm' ml={4} c='dimmed'>
                {user.name}
              </Text> */}
              {user.plan === 'Pro' && 
                <Badge size='xs' variant='light' color="violet" ml={9}>PRO</Badge>
              }
              {colorScheme === 'dark' && 
                <ActionIcon 
                  variant="transparent" size="lg" color="default" 
                  onClick={() => {setColorScheme('light')}}
                  visibleFrom="md"
                  ml={14}
                >
                  <IconBrightnessUp style={{ width: rem(20) }} stroke={1.5} />
                </ActionIcon>
              }
              {colorScheme === 'light' && 
                <ActionIcon variant="transparent" size="lg" color="default" 
                  onClick={() => {setColorScheme('dark')}}
                  visibleFrom="md"
                  ml={14}
                >
                  <IconMoon style={{ width: rem(20) }} stroke={1.5} />
                </ActionIcon>
              }
            </>
          }
          {(!largeScreen && props.pageType === 'profile') && 
            <ActionIcon 
              onClick={open} 
              variant="transparent" 
              size="lg" 
              color='gray'
              aria-label="Menu"
            >
              <IconDotsVertical style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          }
        </Flex>
      </Flex>
    </Container>
    <Drawer 
      opened={openedDrawer} 
      onClose={close} 
      title={props.username}
      position="bottom"
    >
      {/* <h1>Teste</h1> */}
    </Drawer>
    </>
  );
};

export default Header;