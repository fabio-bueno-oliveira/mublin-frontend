import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { miscInfos } from '../../store/actions/misc';
import { searchInfos } from '../../store/actions/search';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { userActions } from '../../store/actions/authentication';
import { useMantineColorScheme, Container, Box, Flex, Menu, Button, Avatar, ActionIcon, Text, Input, Group, Badge, Drawer, Image, CloseButton, Anchor, Select, rem, em } from '@mantine/core';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks';
import { 
  IconMoon,
  IconBrightnessUp,
  IconSearch,
  IconDotsVertical,
  IconSettings,
  IconUserCircle,
  IconHome,
  IconChevronLeft,
  IconMicrophone2,
  IconMusic,
  IconPlus,
  IconLogout,
  IconChevronDown,
  IconChevronRight
} from '@tabler/icons-react';
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg';
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg';
import s from './header.module.css';

function Header (props) {

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const openMenuDrawerFromProfile = props.openMenuDrawerFromProfile;

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)

  const projectsActive = projects?.list
    .filter(p => p.activityStatusId !== 2 && p.activityStatusId !== 6 && !p.yearLeftTheProject)
    .map(project => ({ 
      id: project.projectid,
      name: project.name,
      username: project.username,
      picture: project.picture,
      type: project.ptname,
      genre: project.genre1,

    }));

  const projectsActiveILeft = projects?.list
    .filter(p => p.activityStatusId !== 2 && p.activityStatusId !== 6 && p.yearLeftTheProject)
    .map(project => ({ 
      id: project.projectid,
      name: project.name,
      username: project.username,
      picture: project.picture,
      type: project.ptname,
      genre: project.genre1,
    }));

  const projectsInactive = projects?.list
    .filter(p => p.activityStatusId === 2 || p.activityStatusId === 6)
    .map(project => ({ 
      id: project.projectid,
      name: project.name,
      username: project.username,
      picture: project.picture,
      type: project.ptname,
      genre: project.genre1,
    }));

  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const [searchParams] = useSearchParams()
  const searchedKeywords = searchParams.get('keywords') ? searchParams.get('keywords') : ''
  const [refreshCounter, setRefreshCounter] = useState(0)
  // const [showMobileMenu, setShowMobileMenu] = useState(true)

  let currentPath = window.location.pathname

  useEffect(() => {
    if (props.reloadUserInfo) {
      dispatch(userInfos.getInfo())
    }
  }, [])

  const [fetchProjects, setFetchProjects] = useState(0)

  useEffect(() => {
    if (fetchProjects === 1 && props.page !== 'home') {
      dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
    }
  }, [fetchProjects])

  useEffect(() => {
    if (props.page === 'home' && refreshCounter > 0) {
      dispatch(userInfos.getInfo());
      dispatch(miscInfos.getFeed());
      dispatch(searchInfos.getSuggestedFeaturedUsers());
      dispatch(searchInfos.getSuggestedNewUsers());
    }
  }, [refreshCounter])

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  const cdnBaseURL = 'https://ik.imagekit.io/mublin'
  
  const navigateToSearchPage = (query, tab) => {
    navigate({
      pathname: '/search',
      search: createSearchParams({
        keywords: query ? query : '',
        tab: tab ? tab : ''
      }).toString()
    });
  }

  const [searchQuery, setSearchQuery] = useState(searchedKeywords)

  const handleChangeSearch = (e, query, tab) => {
    setSearchQuery(query);
    autoSearch(e, query, tab);
  }

  const autoSearch = useDebouncedCallback(async (e, query, tab) => {
    if (query?.length > 1) {
      handleSearch(e, query, tab);
    };
    navigateToSearchPage(query, tab);
  },430)

  const handleSearch = (e, query, tab) => {
    e.preventDefault();
    navigateToSearchPage(query, tab);
  }

  const [openMenuDrawer, setOpenMenuDrawer] = useState(false)

  const menuTextColor = (colorScheme === 'light') ? '#383b3e' : '#f1f1f1'

  return (
    <>
      <Container 
        size='lg'
        mt={8} 
        mb={8} 
        className={s.headerContainer}
      >
        <Flex
          mih={50}
          gap='md'
          justify='space-between'
          align='center'
          direction='row'
        >
          <Group>
            <>
              <Flex align='flex-end' gap={7}>
                {(props.showBackIcon && isMobile) && 
                  <IconChevronLeft 
                    style={{width:'21px',height:'21px'}} 
                    onClick={() => navigate(-1)}
                  />
                }
                {!props.hideLogo && 
                  <Link 
                    to={{ pathname: '/home' }} 
                    className={(isMobile && props.page === 'profile') ? 'mublinLogo showOnlyInLargeScreen' : 'mublinLogo'}
                    onClick={() => setRefreshCounter(refreshCounter + 1)}
                  >
                    <Image 
                      src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
                      h={27}
                    />
                  </Link>
                }
              </Flex>
              {(props.page === 'profile' && props.profileId) &&
                <>
                  <Box w={isMobile ? 225 : 130} className='showOnlyInMobile'>
                    <Text 
                      mr='10' 
                      className='lhNormal'
                      truncate='end'
                      size={isMobile ? '1.10rem' : 'md'}
                      fw='600'
                    >
                      {props.username}
                    </Text>
                  </Box>
                </>
              }
            </>
            {isLargeScreen && 
              <form
                onSubmit={(e) => handleSearch(e, searchQuery, null)}
                // onFocus={() => setShowMobileMenu(false)}
                // onBlur={() => setShowMobileMenu(true)}
              >
                <Input
                  variant={colorScheme === 'light' ? 'filled' : 'unstyled'}
                  size='md'
                  w={320}
                  placeholder='Pessoa, instrumento ou cidade...'
                  value={searchQuery}
                  leftSection={<IconSearch size={16} />}
                  onChange={(event) => handleChangeSearch(
                    event, event.currentTarget.value, null
                  )}
                  // onFocus={props.page !== 'search' ? (event) => navigateToSearchPage(event.currentTarget.value, '') : undefined}
                  rightSectionPointerEvents='all'
                  rightSection={
                    <CloseButton
                      aria-label='Apagar'
                      onClick={(event) => handleChangeSearch(
                        event, '', null
                      )}
                      style={{ display: searchQuery ? undefined : 'none' }}
                    />
                  }
                />
              </form>
            }
          </Group>
          <Flex align='center' className='menuHeader'>
            <Link to={{ pathname: '/home' }}>
              <Button 
                size='sm'
                fw='400'
                variant='transparent'
                color={currentPath === '/home' ? 'violet' : menuTextColor}
                leftSection={<><IconHome size={14} /></>}
                p='xs'
                visibleFrom='md'
              >
                Início
              </Button>
            </Link>
            <Link to={{ pathname: '/new' }}>
              <Button 
                size='sm'
                fw='400'
                variant='transparent'
                color={currentPath === '/new' ? 'violet' : menuTextColor}
                leftSection={<><IconPlus size={14} /></>}
                p='xs'
                visibleFrom='md'
              >
                Novo
              </Button>
            </Link>
            <Menu shadow='md' width={200} position='bottom'>
              <Menu.Target>
                <Button
                  size='sm'
                  fw={400}
                  variant='transparent'
                  color={currentPath === '/projects' ? 'violet' : menuTextColor}
                  leftSection={<IconMusic size={14} />}
                  rightSection={<IconChevronDown size={14} />}
                  p='xs'
                  visibleFrom='md'
                  onClick={() => setFetchProjects(fetchProjects + 1)}
                >
                  Meus Projetos
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {projects.requesting ? (
                  <Menu.Label>Carregando meus projetos...</Menu.Label>
                ) : (
                  <>
                    <Menu.Label>Projetos em atividade que faço parte</Menu.Label>
                    {projectsActive.map(project =>
                      <Menu.Item key={project.id}>
                        <Group gap={5}>
                          <Avatar src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} size='30px' />
                          <Flex direction='column'>
                            <Text size='0.85rem' fw='500'>{project.name}</Text>
                            <Text size='0.7rem' fw='420' mt={1} c='dimmed'>{project.type} {project.genre && ' • ' + project.genre}</Text>
                          </Flex>
                        </Group>
                      </Menu.Item>
                    )}
                    <Menu.Divider />
                    {!!projectsActiveILeft.length && 
                      <Menu width={200} shadow="md" position='right-end' closeOnItemClick={false}>
                        <Menu.Target>
                          <Menu.Item p={0} rightSection={<IconChevronRight size={14}/>}>
                            {/* Projetos encerrados */}
                            <Menu.Label>Projetos ativos que não faço mais parte</Menu.Label>
                          </Menu.Item>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {projectsActiveILeft.map(project =>
                            <Menu.Item key={project.id}>
                              <Group gap={5}>
                                <Avatar src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} size='30px' />
                                <Flex direction='column'>
                                  <Text size='0.85rem' fw='500'>{project.name}</Text>
                                  <Text size='0.7rem' fw='420' mt={1} c='dimmed'>{project.type} {project.genre && ' • ' + project.genre}</Text>
                                </Flex>
                              </Group>
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    }
                    <Menu.Divider />
                    <Menu width={200} shadow="md" position='right-end' closeOnItemClick={false}>
                      <Menu.Target>
                        <Menu.Item p={0} rightSection={<IconChevronRight size={14}/>}>
                          {/* Projetos encerrados */}
                          <Menu.Label>Projetos encerrados</Menu.Label>
                        </Menu.Item>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {projectsInactive.length ? ( projectsInactive.map(project =>
                          <Menu.Item key={project.id}>
                            <Group gap={5}>
                              <Avatar src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} size='30px' />
                              <Flex direction='column'>
                                <Text size='0.85rem' fw='500'>{project.name}</Text>
                                <Text size='0.7rem' fw='420' mt={1} c='dimmed'>{project.type} {project.genre && ' • ' + project.genre}</Text>
                              </Flex>
                            </Group>
                          </Menu.Item>
                        )) : (<Text size='0.85rem' fw='500'>Nenhum projeto encontrado</Text>)}
                      </Menu.Dropdown>
                    </Menu>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
            <Link to={{ pathname: '/projects' }}>
              <Button 
                size='sm'
                fw={400}
                variant='outline'
                radius="xl"
                color={menuTextColor}
                leftSection={<IconMicrophone2 size={14} />}
                p={'xs'}
                visibleFrom='md'
                mx='xs'
              >
                Quero tocar
              </Button>
            </Link>
            {isLargeScreen && 
              <>
                {/* {plan === 'Pro' && 
                  <Badge size='sm' variant='light' color="violet" ml={9}>PRO</Badge>
                } */}
                <Menu shadow="md" width={200} position="bottom-end" offset={10} withArrow>
                  <Menu.Target>
                    <Avatar
                      size="md"
                      className="point"
                      src={userInfo.picture ? cdnBaseURL+'/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
                      alt={userInfo.username}
                      ml={8}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>
                      {userInfo.name} {userInfo.lastname} 
                      {user.plan === 'Pro' && 
                        <Badge size='sm' variant='light' color='violet' ml={6}>PRO</Badge>
                      }
                    </Menu.Label>
                    <Anchor 
                      underline='never'
                      style={{lineHeight:'normal'}} 
                      href={`/${userInfo.username}`}
                    >
                      <Menu.Item 
                        leftSection={
                          <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
                        }
                      >
                        Ver perfil
                      </Menu.Item>
                    </Anchor>
                    {/* <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>
                      Mensagens
                    </Menu.Item> */}
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
            {(!isLargeScreen && props.page === 'profile') && 
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