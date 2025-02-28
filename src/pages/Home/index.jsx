import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { userActions } from '../../store/actions/user'
import { eventsActions } from '../../store/actions/events'
import { searchInfos } from '../../store/actions/search'
import { feedActions } from '../../store/actions/feed'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { Container, ScrollArea, Group, Center, Box, Flex, Card, Button, Title, Badge, Text, Grid, Skeleton, Avatar, Image, Anchor, Divider, Modal, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus, IconCalendarEventFilled, IconMapPinFilled, IconHexagonPlus } from '@tabler/icons-react'
import UserCard from '../../components/userCard'
import FeedCard from './FeedCard'
import FeedCardLoading from './FeedCard/loading'
import Header from '../../components/header'
import HeaderMobile from '../../components/header/mobile'
import FooterMenuMobile from '../../components/footerMenuMobile'
import UserCardLoading from '../../components/userCard/loading'
import NewPost from '../../pages/New/postStandalone'
import { Helmet } from 'react-helmet'
import { truncateString } from '../../utils/formatter'

function Home () {

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const largeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)
  const search = useSelector(state => state.search)
  const feed = useSelector(state => state.feed)
  const events = useSelector(state => state.events)

  // Modal New Post
  const openModalNewPost = () => {
    dispatch(feedActions.newPostIsWriting(true))
  }
  const closeModalNewPost = () => {
    dispatch(feedActions.newPostIsWriting(false))
  }

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
    dispatch(miscInfos.getFeed())
    dispatch(userActions.getUserRolesInfoById(loggedUserId))
    dispatch(eventsActions.getUserEvents(loggedUserId))
    dispatch(searchInfos.getSuggestedFeaturedUsers())
    dispatch(searchInfos.getSuggestedNewUsers())
    if (user.success && user.first_access !== 0) {
      navigate('/start/intro/')
    }
  }, [])

  useEffect(() => {
    if (user.success && user.first_access !== 0) {
      navigate('/start/intro/')
    }
  }, [user.success])

  return (
    <>
      <Helmet>
        <title>Home | Mublin</title>
        <link rel='canonical' href='https://mublin.com/home' />
      </Helmet>
      {isMobile ? (
        <HeaderMobile page='home' reloadUserInfo />
      ) : (
        <Header page='home' reloadUserInfo />
      )}
      <Container size='lg' mb='lg' mt={largeScreen ? 20 : 0}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 2.5 }} pt='8'>
            <Box className='showOnlyInLargeScreen'>
              {user.requesting ? (
                <Card
                  padding={12}
                  radius='lg'
                  withBorder
                  className='mublinModule'
                  pb='20'
                >
                  <Flex direction='column' align='center'>
                    <Skeleton height={66} circle mt={10} mb={14} />
                    <Skeleton height={16} width={125} radius='lg' />
                  </Flex>
                </Card>
              ) : (
                <>
                  <Card
                    padding={12}
                    radius='lg'
                    withBorder
                    className='mublinModule'
                    mb='10'
                  >
                    <Card.Section>
                      <Image
                        src={userInfo.picture_cover ? `https://ik.imagekit.io/mublin/tr:h-200,c-maintain_ratio/users/avatars/${userInfo.id}/${userInfo.picture_cover}` : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'} 
                        height={70}
                        alt={`Imagem de capa de ${userInfo.name}`}
                      />
                    </Card.Section>
                    <Center style={{marginTop:'-20px'}}>
                      <Link to={{ pathname: `/${userInfo.username}` }}>
                        <Avatar
                          size='80px'
                          src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-152,w-152,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
                          style={{border:'2px solid white'}}
                        />
                      </Link>
                    </Center>
                    <Text size='lg' fw={600} mt={10} ta='center' className='lhNormal'>
                      {userInfo.name} {userInfo.lastname}
                    </Text>
                    <Text
                      ta='center'
                      c='dimmed'
                      fw='400'
                      fz='xs'
                      mb={8}
                      className='lhNormal'
                    >
                      {user.roles.map(role => 
                        <span className='comma' key={role.id}>{role.description}</span>
                      )}
                    </Text>
                    {user.plan === 'Pro' ? ( 
                      <Center>
                        <Badge
                          title='Usuário PRO'
                          radius='sm'
                          size='sm'
                          variant="gradient"
                          gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                        >
                          PRO
                        </Badge>
                      </Center>
                    ) : (
                      <Center>
                        <Anchor
                          variant='gradient'
                          gradient={{ from: 'violet', to: 'blue' }}
                          fw='420'
                          fz='xs'
                          href='/pro'
                          underline='hover'
                        >
                          Assine o Mublin PRO!
                        </Anchor>
                      </Center>
                    )}
                  </Card>
                  <Group gap={4} mb={8}>
                    <IconCalendarEventFilled size={14} />
                    <Text size='sm' fw={500}>Próximos eventos:</Text>
                  </Group>
                  <Card
                    padding={12}
                    radius='lg'
                    withBorder
                    className='mublinModule'
                    mb='10'
                  >
                    {events.requesting ? (
                      <> 
                        <Skeleton height={12} radius='lg' mb={6} mt={8} />
                        <Skeleton height={12} radius='lg' mb={6} />
                        <Skeleton height={12} radius='lg' mb={6} />
                      </>
                    ) : (
                      <>
                        {events.total === 0 ? (
                          <Text size='sm' c='dimmed'>Nenhum evento próximo</Text>
                        ) : (
                          events.result.map(event =>
                            <Box key={event.eventId}>
                              <Divider 
                                mb={4}
                                labelPosition='left'
                                label={
                                  <Group gap={4}>
                                    <Avatar size={15} src={event.authorPicture ? event.authorPicture : undefined} alt={event.authorName} component='a' href={`/${event.authorUsername}`} />
                                    <Text size='xs' c='dimmed'>
                                      Criado por {event.authorName}
                                    </Text>
                                  </Group>
                                }
                              />
                              <Text size='xs' fw={550}>
                                {event.title}
                              </Text>
                              <Text size='xs'>{event.description}</Text>
                              <Text size='xs' fw={600}>
                                {event.eventDateStart+' às '+event.eventHourStart}
                              </Text>
                              <Group gap={3}>
                                <IconMapPinFilled size={12} color='gray' />
                                <Text size='xs' c='dimmed' fw={500}>
                                  {event.city && ' em '+event.city+'/'+event.region}
                                </Text>
                              </Group>
                              <Divider my={4} />
                              <Group gap={3}>
                                <Avatar src={event.projectPicture} size={30} />
                                <Flex direction='column' gap={0}>
                                  <Text fw={500} size='xs' className='lhNormal'>
                                    {event.projectName}
                                  </Text>
                                  <Text size='xs' c='dimmed' className='lhNormal'>
                                    {event.projectType}
                                  </Text>
                                </Flex>
                              </Group>
                              {event.response === 1 ? <Badge size='xs' color='green'>Presença confirmada</Badge> : null}
                              {event.response === 2 ? <Badge size='xs' color='gray'>Aguardando sua confirmação</Badge> : null}
                              {event.response === 0 ? <Badge size='xs' color='red'>Convite recusado</Badge> : null}
                            </Box>
                          )
                        )}
                      </>
                    )}
                  </Card>
                  {/* <Text fw='400' size='lg'>Compromissos próximos:</Text> */}
                  {/* {projects.list.map(project =>
                    <Card 
                      key={project.projectid}
                      mt='10'
                      padding={12} 
                      radius={"md"} 
                      withBorder
                      className="mublinModule"
                    >
                      Exemplo
                    </Card>
                  )} */}
                </>
              )}
            </Box>
            {/* <Divider 
              mb="xs" 
              label="Meus projetos" 
              labelPosition="center"
              className='showOnlyInMobile' 
            /> */}
            <ScrollArea w='100%' h={130} type='never' className='showOnlyInMobile'>
              <Box className='fitContent'>
                <Flex gap={18}>
                  <Flex
                    direction='column'
                    align='center'
                    gap='10'
                  >
                     <Avatar 
                      // size='65px' 
                      h={98}
                      w={65}
                      color='gray' 
                      radius='md'
                      className='point'
                      variant='light'
                      onClick={() => navigate('/new/project')}
                     >
                      <IconHexagonPlus size="1.5rem" stroke={1} />
                    </Avatar>
                    <Text size='0.65rem' fw='480'>
                      Novo projeto
                    </Text>
                  </Flex>
                  {projects.requesting &&
                    <>
                      <Skeleton height={65} circle />
                      <Skeleton height={65} circle />
                      <Skeleton height={65} circle />
                      <Skeleton height={65} circle />
                      <Skeleton height={65} circle />
                    </>
                  }
                  {!projects.requesting && projects.list.map(project =>
                    <Flex
                      key={project.projectid}
                      direction='column'
                      align='center'
                      gap='8'
                    >
                      <Image
                        radius="md"
                        h={100}
                        w={65}
                        fit="contain"
                        // component='a'
                        // href={`/project/${project.username}`}
                        onClick={() => navigate(`/project/${project.username}`)}
                        src={'https://ik.imagekit.io/mublin/projects/tr:h-100,w-65,c-maintain_ratio/'+project.picture}
                      />
                      <Text size='0.65rem' fw='480'>
                        {truncateString(project.name, 10)}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6.2 }} mb={isMobile ? 60 : 20}>
            {/* <Divider 
              mb="xs" 
              label="Atualizações da sua rede" 
              labelPosition="center"
              className='showOnlyInMobile' 
            /> */}
            <Card
              radius='lg'
              withBorder
              px='15'
              py='11'
              mb='10'
              className='mublinModule mantine-visible-from-sm'
            >
              <Flex gap={12} justify='space-between' align='center'>
                <Link to={{ pathname: `/${userInfo.username}` }}>
                  <Avatar
                    size='40px'
                    src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-80,w-80,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
                  />
                </Link>
                <Button
                  fullWidth variant="light"
                  color="gray"
                  radius="md"
                  size='md'
                  fw={480}
                  fz='sm'
                  onClick={() => openModalNewPost()}
                >
                  Escrever uma publicação
                </Button>
              </Flex>
            </Card>
            {feed.requesting ? (
              <FeedCardLoading />
            ) : (
              feed.list.map((item, key) =>
                <FeedCard
                  key={key}
                  item={item}
                />
              )
            )}
          </Grid.Col>
          {largeScreen && 
            <Grid.Col span={3.3}>
              <Card shadow='sm' px='md' pt='sm' pb='lg' radius='lg' withBorder className='mublinModule'>
                <Title fz='1.03rem' fw='640'>
                  Músicos em destaque
                </Title>
                {search.requesting ? (
                  <UserCardLoading 
                    mt={14}
                  />
                ) : (
                  search.suggestedFeaturedUsers.map(user => (
                    <UserCard 
                      mt={14}
                      key={user.id}
                      size='md'
                      name={user.name}
                      lastname={user.lastname}
                      username={user.username}
                      mainRole={user.role}
                      picture={user.picture}
                      verified={user.verified}
                      legend={user.legend}
                      city={user.city}
                      region={user.region}
                    />
                  ))
                )}
              </Card>
              <Card shadow='sm' px='md' pt='sm' pb='lg' radius='lg' withBorder mt={10} className='mublinModule'> 
                <Title fz='1.03rem' fw='640'>
                  Novos usuários
                </Title>
                {search.requesting ? (
                  <UserCardLoading 
                    mt={14}
                  />
                ) : (
                  search.suggestedNewUsers.map(user => (
                    <UserCard 
                      mt={14}
                      key={user.id}
                      size='md'
                      name={user.name}
                      lastname={user.lastname}
                      username={user.username}
                      mainRole={user.role}
                      picture={user.picture}
                      verified={user.verified}
                      legend={user.legend}
                      city={user.city}
                      region={user.region}
                    />
                  ))
                )}
              </Card>
            </Grid.Col>
          }
        </Grid>
      </Container>
      <Modal
        opened={feed.newPostIsWriting}
        onClose={() => closeModalNewPost()} 
        title='Escrever uma publicação'
        centered
      >
        <NewPost />
      </Modal>
      <FooterMenuMobile page='home' />
    </>
  )
}

export default Home