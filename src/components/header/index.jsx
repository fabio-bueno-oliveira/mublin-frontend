import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { searchInfos } from '../../store/actions/search'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { authActions } from '../../store/actions/authentication'
import { useMantineColorScheme, Container, Space, Box, Flex, Menu, Button, Avatar, ActionIcon, Text, Input, Group, Badge, Drawer, Image, CloseButton, Anchor, Indicator, rem, em } from '@mantine/core';
import { useMediaQuery, useDebouncedCallback } from '@mantine/hooks'
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
} from '@tabler/icons-react'
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg'
import './styles.scss'

function Header (props) {

  const dispatch = useDispatch()
  let navigate = useNavigate()

  const openMenuDrawerFromProfile = props.openMenuDrawerFromProfile
  const page = props.page

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

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
      genre: project.genre1
    }))

  const projectsActiveILeft = projects?.list
    .filter(p => p.activityStatusId !== 2 && p.activityStatusId !== 6 && p.yearLeftTheProject)
    .map(project => ({ 
      id: project.projectid,
      name: project.name,
      username: project.username,
      picture: project.picture,
      type: project.ptname,
      genre: project.genre1,
    }))

  const projectsInactive = projects?.list
    .filter(p => p.activityStatusId === 2 || p.activityStatusId === 6)
    .map(project => ({ 
      id: project.projectid,
      name: project.name,
      username: project.username,
      picture: project.picture,
      type: project.ptname,
      genre: project.genre1,
    }))

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
      dispatch(userActions.getInfo())
    }
  }, [])

  const [fetchProjects, setFetchProjects] = useState(0)

  useEffect(() => {
    if (fetchProjects === 1) {
      dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
    }
  }, [fetchProjects])

  useEffect(() => {
    if (page === 'home' && refreshCounter > 0) {
      dispatch(userActions.getInfo())
      dispatch(miscInfos.getFeed())
      dispatch(searchInfos.getSuggestedFeaturedUsers())
      dispatch(searchInfos.getSuggestedNewUsers())
    }
  }, [refreshCounter])

  const logout = () => {
    setColorScheme('light')
    dispatch(authActions.logout())
    navigate('/')
  }

  const cdnBaseURL = 'https://ik.imagekit.io/mublin'
  
  const navigateToSearchPage = (query, tab) => {
    navigate({
      pathname: '/search',
      search: createSearchParams({
        keywords: query ? query : '',
        tab: tab ? tab : ''
      }).toString()
    })
  }

  const [searchQuery, setSearchQuery] = useState(searchedKeywords)

  const handleChangeSearch = (e, query, tab) => {
    setSearchQuery(query)
    autoSearch(e, query, tab)
  }

  const autoSearch = useDebouncedCallback(async (e, query, tab) => {
    if (query?.length > 1) {
      handleSearch(e, query, tab)
    }
    navigateToSearchPage(query, tab)
  },470)

  const handleSearch = (e, query, tab) => {
    e.preventDefault()
    navigateToSearchPage(query, tab)
  }

  const [openMenuDrawer, setOpenMenuDrawer] = useState(false)

  const menuTextColor = (colorScheme === 'light') ? '#383b3e' : '#f1f1f1'

  const isProjectsPage = () => {
    switch(currentPath) {
      case '/projects':
        return true;
      case '/new/project':
        return true;
      case '/new/join':
        return true;
      default:
        return false;
    }
  }

  return (
    <>
      <Box
        component='header'
        className='wrapper'
      >
        <Container
          size='lg'
          className='headerContainer'
        >
          <Flex
            mih={42}
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
                      className={(isMobile && page === 'profile') ? 'mublinLogo showOnlyInLargeScreen' : 'mublinLogo'}
                      onClick={() => setRefreshCounter(refreshCounter + 1)}
                    >
                      <Image 
                        src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
                        h={27}
                      />
                    </Link>
                  }
                </Flex>
                {(page === 'profile' && props.profileId) &&
                  <Box w={225} className='showOnlyInMobile'>
                    <Text 
                      mr='10' 
                      className='lhNormal'
                      truncate='end'
                      size={'1.17rem'}
                      fw='600'
                    >
                      {props.username}
                    </Text>
                  </Box>
                }
              </>
              {isLargeScreen && 
                <form
                  onSubmit={(e) => handleSearch(e, searchQuery, null)}
                  // onFocus={() => setShowMobileMenu(false)}
                  // onBlur={() => setShowMobileMenu(true)}
                >
                  <Flex gap={6} align='center'>
                    <Input
                      variant={colorScheme === 'light' ? 'filled' : 'unstyled'}
                      size='md'
                      w={300}
                      placeholder='Pessoa, instrumento, cidade...'
                      value={searchQuery}
                      // leftSection={<IconSearch size={16} />}
                      onChange={(event) => handleChangeSearch(
                        event, event.currentTarget.value, null
                      )}
                      // onFocus={page !== 'search' ? (event) => navigateToSearchPage(event.currentTarget.value, '') : undefined}
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
                    <ActionIcon
                      variant='transparent' 
                      size='lg'
                      color='gray'
                      type='submit'
                      onClick={() => handleChangeSearch(
                        null, searchQuery, null
                      )}
                    >
                      <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                  </Flex>
                </form>
              }
            </Group>
            <Flex align='center' className='menuHeader'>
              <Button 
                size='sm'
                fw={440}
                radius={0}
                variant='transparent'
                color={menuTextColor}
                className={currentPath === '/home' ? 'headerMenuActive' : undefined}
                leftSection={<><IconHome size={16} /></>}
                px='xs'
                mr={10}
                h={50}
                visibleFrom='md'
                onClick={(e) => navigate('/home')}
              >
                Início
              </Button>
              <Menu shadow='md' width={200} position='bottom'>
                <Menu.Target>
                  <Button
                    size='sm'
                    fw={440}
                    radius={0}
                    variant='transparent'
                    color={menuTextColor}
                    className={isProjectsPage() ? 'headerMenuActive' : undefined}
                    leftSection={<IconMusic size={16} />}
                    rightSection={<IconChevronDown size={14} />}
                    py='xs'
                    px={0}
                    mr={10}
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
                      <Menu.Item component='a' href='/new/project'>
                        <Group gap={5}>
                          <IconPlus size='13px' />
                          <Text size='0.8rem' fw='550'>Criar novo projeto</Text>
                        </Group>
                      </Menu.Item>
                      <Menu.Divider />
                      {projects.totalProjects > 0 &&
                        <Menu.Label>
                          Projetos em atividade e que faço parte
                        </Menu.Label>
                      }
                      {projectsActive.length ? ( projectsActive.map(project =>
                        <Menu.Item key={project.id} component='a' href={`/project/${project.username}`}>
                          <Group gap={5}>
                            <Indicator color='lime' size={7} position='bottom-center' processing>
                              <Avatar src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} size='30px' />
                            </Indicator>
                            <Flex direction='column'>
                              <Group gap={2} align='flex-start' w={102}>
                                <Text size='0.85rem' fw='500' truncate="end" title={project.name}>
                                  {project.name}
                                </Text>
                              </Group>
                              <Text size='0.7rem' fw='420' mt={1} c='dimmed'>{project.type} {project.genre && ' • ' + project.genre}</Text>
                            </Flex>
                          </Group>
                        </Menu.Item>
                      )) : (<Text size='0.7rem' fw='500' px='sm' py='xs' c='dimmed'>Nenhum projeto encontrado</Text>)}
                      {!!projectsActiveILeft.length && 
                        <>
                          <Menu.Divider />
                          <Menu width={200} shadow="md" position='right-end' closeOnItemClick={false}>
                            <Menu.Target>
                              <Menu.Item p={0} rightSection={<IconChevronRight size={14}/>}>
                                {/* Projetos encerrados */}
                                <Menu.Label>Projetos ativos que não faço mais parte</Menu.Label>
                              </Menu.Item>
                            </Menu.Target>
                            <Menu.Dropdown>
                              {projectsActiveILeft.map(project =>
                                <Menu.Item key={project.id} component='a' href={`/project/${project.username}`}>
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
                        </>
                      }
                      {projects.totalProjects > 0 && 
                        <>
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
                                <Menu.Item key={project.id} component='a' href={`/project/${project.username}`}>
                                  <Group gap={5}>
                                    <Avatar src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} size='30px' />
                                    <Flex direction='column'>
                                      <Text size='0.85rem' fw='500'>{project.name}</Text>
                                      <Text size='0.7rem' fw='420' mt={1} c='dimmed'>{project.type} {project.genre && ' • ' + project.genre}</Text>
                                    </Flex>
                                  </Group>
                                </Menu.Item>
                              )) : (<Text size='0.7rem' fw='500' px='sm' py='xs'>Nenhum projeto encontrado</Text>)}
                            </Menu.Dropdown>
                          </Menu>
                        </>
                      }
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
              <Button 
                size='sm'
                fw={400}
                radius='xl'
                variant='gradient'
                gradient={{ from: 'mublinColor', to: 'violet', deg: 107 }}
                leftSection={<IconMicrophone2 size={14} />}
                p='xs'
                visibleFrom='md'
                mr='xs'
                onClick={(e) => navigate('/projects')}
              >
                Quero tocar
              </Button>
              {isLargeScreen && 
                <Menu shadow='md' width={200} position='bottom-end' offset={10} withArrow>
                  <Menu.Target>
                    <Avatar
                      // size='md'
                      w={38}
                      h={38}
                      className='point'
                      src={userInfo.picture ? cdnBaseURL+'/tr:h-76,w-76,r-max,c-maintain_ratio/users/avatars/'+userInfo.picture : undefined}
                      alt={userInfo.username}
                      ml={8}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>
                      {userInfo.name} {userInfo.lastname} 
                      {user.plan === 'Pro' && 
                        <Badge 
                          radius='sm' 
                          size='xs' 
                          color='secondary' 
                          variant="gradient"
                          gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                          ml={4}
                        >
                          PRO
                        </Badge>
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
                        Tema claro
                      </Menu.Item>
                    }
                    {colorScheme === 'light' && 
                      <Menu.Item 
                        leftSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />}
                        onClick={() => {setColorScheme('dark')}}
                      >
                        Tema escuro
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
              }
              {(!isLargeScreen && props.showDotsMenu) && 
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
      </Box>
      <Space 
        h={
            isMobile 
              ? (page === 'profile' ? 52 : 60)
              : 86
          } 
      />
      <Drawer 
        opened={openMenuDrawer || openMenuDrawerFromProfile} 
        onClose={() => setOpenMenuDrawer(false)} 
        title={props.username}
        position="bottom"
      >
        {/* <h1>Teste</h1> */}
      </Drawer>
    </>
  )
}

export default Header