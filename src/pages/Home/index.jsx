import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { userInfos } from '../../store/actions/user'
import { searchInfos } from '../../store/actions/search'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { Container, ScrollArea, Center, Box, Flex, Card, Button, Title, Badge, Text, Grid, Skeleton, Avatar, Anchor, Divider, Modal, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import UserCard from '../../components/userCard'
import FeedCard from './feedCard'
import FeedCardLoading from './feedCardLoading'
import Header from '../../components/header'
import HeaderMobile from '../../components/header/mobile'
import FooterMenuMobile from '../../components/footerMenuMobile'
import UserCardLoading from '../../components/userCard/loading'
import NewPost from '../../pages/New/postStandalone'
import { truncateString } from '../../utils/formatter'

function Home () {

  document.title = 'Home | Mublin'

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

  // Modal New Post
  const [showModalNewPost, setShowModalNewPost] = useState(false)

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
    dispatch(miscInfos.getFeed())
    dispatch(userInfos.getUserRolesInfoById(loggedUserId))
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
                <>
                  <Skeleton height={56} circle />
                  <Skeleton height={16} width={125} mt={10} radius="md" />
                </>
              ) : (
                <>
                  <Card
                    padding={12}
                    radius='lg'
                    withBorder
                    className='mublinModule'
                    mb='10'
                  >
                    <Center>
                      <Link to={{ pathname: `/${userInfo.username}` }}>
                        <Avatar
                          size='lg'
                          src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
                        />
                      </Link>
                    </Center>
                    <Title fw='580' fz='1.04rem' mb={1} mt={10} ta='center' className='op80'>
                      Olá, {userInfo?.name}
                    </Title>
                    {user.plan === 'Pro' ? ( 
                      <Center>
                        <Badge 
                          color='violet' 
                          size='sm'
                          my={5}
                          variant='gradient'
                          gradient={{ from: 'violet', to: 'blue' }}
                        >
                          conta pro
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
                    <Text
                      ta='center'
                      c='dimmed'
                      fw='400'
                      fz='0.77rem'
                      mt='3'
                      className='lhNormal'
                    >
                      {user.roles.map(role => 
                        <span className='comma' key={role.id}>{role.description}</span>
                      )}
                    </Text>
                    {/* <Text ta="center"  size="xs" mt={9} c="dimmed">
                      {user.bio}
                    </Text> */}
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
            <Divider mb="xs" label="Meus projetos" labelPosition="left"  className='showOnlyInMobile' />
            <ScrollArea w='100%' h={100} type='never' className='showOnlyInMobile'>
              <Box className='fitContent'>
                <Flex gap={18}>
                  <Flex
                    direction='column'
                    align='center'
                    gap='10'
                  >
                     <Avatar 
                      size='65px' color='violet' radius='xl'
                      className='point'
                      onClick={() => navigate('/new/')}
                     >
                      <IconPlus size="1.5rem" />
                    </Avatar>
                    <Text size='0.75rem' fw='480'>
                      Criar novo
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
                      gap='10'
                    >
                      <Avatar size='65px' src={'https://ik.imagekit.io/mublin/projects/tr:h-130,w-130,c-maintain_ratio/'+project.picture} />
                      <Text size='0.75rem' fw='480'>
                        {truncateString(project.name, 9)}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6.2 }} mb={isMobile ? 60 : 20}>
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
                  radius="xl"
                  size='md'
                  fw={480}
                  fz='sm'
                  onClick={() => setShowModalNewPost(true)}
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
        opened={showModalNewPost} 
        onClose={() => setShowModalNewPost(false)} 
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