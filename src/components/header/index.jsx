import React, { useEffect, useState } from 'react';
import { Link, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Flex, Menu, Button, Avatar, ActionIcon, Text, Input, rem, Group, Badge, Divider, Drawer, Image } from '@mantine/core';
import { useMediaQuery, useDisclosure, useDebouncedCallback } from '@mantine/hooks';
import { 
  IconMoon, 
  IconBrightnessUp, 
  IconSearch, 
  IconDotsVertical, 
  IconSettings, 
  IconMessageCircle, 
  IconUserCircle, 
  IconHome,
  IconRocket,
  IconMusic,
  IconLogout
} from '@tabler/icons-react';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import PianoLogoBlack from '../../assets/svg/piano-logo.svg';
import PianoLogoWhite from '../../assets/svg/piano-logo-w.svg';
import s from './header.module.css';

function Header (props) {

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const openMenuDrawerFromProfile = props.openMenuDrawerFromProfile;

  const user = useSelector(state => state.user);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const [searchParams] = useSearchParams();
  const searchedKeywords = searchParams.get('keywords');
  const [refreshCounter, setRefreshCounter] = useState(0);
  // const [showMobileMenu, setShowMobileMenu] = useState(true)

  let currentPath = window.location.pathname;

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  useEffect(() => { 
    if (props.pageType === 'home' && refreshCounter > 0) {
      dispatch(userInfos.getInfo());
      dispatch(userProjectsInfos.getUserProjects(user.id,'all'));
    }
  }, [refreshCounter]);

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  const cdnBaseURL = 'https://ik.imagekit.io/mublin';
  
  const navigateToSearchPage = (query, tab) => {
    navigate({
      pathname: '/search',
      search: createSearchParams({
        keywords: query ? query : '',
        tab: tab ? tab : ''
      }).toString()
    });
  }

  const [searchQuery, setSearchQuery] = useState(searchedKeywords);

  const handleChangeSearch = (e, query, tab) => {
    setSearchQuery(query);
    autoSearch(e, query, tab);
  }

  const autoSearch = useDebouncedCallback(async (e, query, tab) => {
    if (query?.length > 1) {
      handleSearch(e, query, tab);
    };
    navigateToSearchPage(query, tab);
  },430);

  const handleSearch = (e, query, tab) => {
    e.preventDefault();
    navigateToSearchPage(query, tab);
  }

  const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
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
            <Link 
              to={{ pathname: '/home' }} 
              className='mublinLogo'
              onClick={() => setRefreshCounter(refreshCounter + 1)}
            >
              <Flex gap={2} align='center'>
                <Image src={colorScheme === 'light' ? PianoLogoBlack : PianoLogoWhite} h={largeScreen ? 43 : 27} />
                <Image src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} h={largeScreen ? 22 : 24} />
              </Flex>
            </Link>
            {props.pageType === 'profile' &&
              <>
                <Divider size="xs" orientation="vertical" />
                <Text mr={34} style={{lineHeight:'normal'}} pt={largeScreen ? 0 : 5}>
                  {props.username}
                </Text>
              </>
            }
          </>
          {largeScreen && 
            <form
              onSubmit={(e) => handleSearch(e, searchQuery, null)}
              // onFocus={() => setShowMobileMenu(false)}
              // onBlur={() => setShowMobileMenu(true)}
            >
              <Input 
                variant={colorScheme === 'light' ? 'filled' : 'unstyled'} 
                size="md"
                w={320}
                placeholder='Pessoa, instrumento ou cidade...'
                value={searchQuery ? searchQuery : undefined}
                leftSection={<IconSearch size={16} />}
                onChange={(event) => handleChangeSearch(
                  event, event.currentTarget.value, null
                )}
                // onFocus={(event) => navigateToSearchPage(event.currentTarget.value, null)}
                rightSectionPointerEvents="all"
              />
            </form>
          }
        </Group>
        <Flex align={"center"} className="menuHeader">
          <Link to={{ pathname: '/home' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color={currentPath === '/home' ? 'violet' : 'dark'}
              leftSection={<><IconHome size={14} /></>}
              p={'xs'}
              visibleFrom="md"
            >
              Início
            </Button>
          </Link>
          <Link to={{ pathname: '/my-projects' }}>
            <Button
              size="sm"
              variant='transparent'
              color={currentPath === '/my-projects' ? 'violet' : 'dark'}
              leftSection={<><IconMusic size={14} /></>}
              p={'xs'}
              visibleFrom="md"
            >
              Meus Projetos
            </Button>
          </Link>
          <Link to={{ pathname: '/my-projects' }}>
            <Button 
              size="sm" 
              variant='transparent'
              color={currentPath === '/opportunities' ? 'violet' : 'dark'}
              leftSection={<><IconRocket size={14} /></>}
              p={'xs'}
              visibleFrom="md"
            >
              Oportunidades
            </Button>
          </Link>
          {largeScreen && 
            <>
              {/* {user.plan === 'Pro' && 
                <Badge size='sm' variant='light' color="violet" ml={9}>PRO</Badge>
              } */}
              <Menu shadow="md" width={200} position="bottom-end" offset={10} withArrow>
                <Menu.Target>
                  <Avatar
                    size="md"
                    className="point"
                    src={user.picture ? cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : undefined}
                    alt={user.username}
                    ml={8}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>
                    {user.name} {user.lastname} 
                    {user.plan === 'Pro' && 
                      <Badge size='sm' variant='light' color="violet" ml={9}>PRO</Badge>
                    }
                  </Menu.Label>
                  <Menu.Item 
                    leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                    // onClick={() => navigate(`/${user.username}`)}
                    // onClick={() => console.log("foi")}
                    onClick={() => navigate('/'+user.username)}
                  >
                    Ver perfil
                  </Menu.Item>
                  <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>
                    Mensagens
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => navigate('/settings')}
                  >
                    Configurações
                  </Menu.Item>
                  {colorScheme === 'dark' && 
                    <Menu.Item 
                      leftSection={<IconBrightnessUp style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {setColorScheme('light')}}
                    >
                      Modo claro
                    </Menu.Item>
                  }
                  {colorScheme === 'light' && 
                    <Menu.Item 
                      leftSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {setColorScheme('dark')}}
                    >
                      Modo escuro
                    </Menu.Item>
                  }
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => logout()}
                  >
                    Sair
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          {(!largeScreen && props.pageType === 'profile') && 
            <ActionIcon 
              onClick={() => setOpenMenuDrawer(true)} 
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
      opened={openMenuDrawer || openMenuDrawerFromProfile} 
      onClose={() => setOpenMenuDrawer(false)} 
      title={props.username}
      position="bottom"
    >
      {/* <h1>Teste</h1> */}
    </Drawer>
    </>
  );
};

export default Header;