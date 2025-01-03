import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { userInfos } from '../../store/actions/user'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { searchInfos } from '../../store/actions/search'
import { Container, ScrollArea, Center, Box, Flex, Card, Title, Badge, Text, Grid, Skeleton, Avatar, Anchor, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import UserCard from '../../components/userCard'
import ProjectCard from '../../components/projectCard'
import FeedCard from './feedCard'
import FeedCardLoading from './feedCardLoading'
import Header from '../../components/header'
import HeaderMobile from '../../components/header/mobile'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { truncateString } from '../../utils/formatter'

function Home () {

  document.title = 'Home | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const largeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;
  const plan = decoded.result.plan;

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)
  const search = useSelector(state => state.search)
  const feed = useSelector(state => state.feed)

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
    dispatch(miscInfos.getFeed());
    dispatch(miscInfos.getFeedLikes());
    dispatch(userInfos.getUserRolesInfoById(loggedUserId));
    dispatch(searchInfos.getSuggestedFeaturedUsers());
    dispatch(searchInfos.getSuggestedNewUsers());
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
                    radius='md'
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
                    <Title fw='460' fz='1.1rem' mb={1} mt={10} ta='center' className='op80'>
                      Olá, {userInfo?.name}
                    </Title>
                    {plan === 'Pro' ? ( 
                      <Center>
                        <Badge size='sm' variant='light' color='gray' mb='6'>
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
                  {/* <Text fw='400' size='lg'>Meus projetos</Text> */}
                  {projects.list.map(project =>
                    <Card 
                      key={project.projectid}
                      mt='10'
                      padding={12} 
                      radius={"md"} 
                      withBorder
                      className="mublinModule"
                    >
                      <ProjectCard 
                        mb={0}
                        size='md'
                        picture={project.picture}
                        name={project.name}
                        username={project.username}
                        type={project.ptname}
                        city={project.cityName}
                        region={project.regionName}
                        confirmed={project.confirmed}
                        genre={project.genre1}
                      />
                    </Card>
                  )}
                </>
              )}
            </Box>
            <ScrollArea w='100%' h={80} type='never'>
              <Box className='fitContent'>
                <Flex gap={14}>
                  {projects.list.map(project =>
                    <Flex 
                      key={project.projectid}
                      direction='column'
                      align='center'
                      gap='10'
                    >
                      <Avatar size='55px' src={'https://ik.imagekit.io/mublin/projects/tr:h-110,w-110,c-maintain_ratio/'+project.picture} />
                      <Text size='0.7rem' fw='500'>
                        {truncateString(project.name, 7)}
                      </Text>
                      {/* <ProjectCard 
                        mb={0}
                        size='md'
                        picture={project.picture}
                        name={project.name}
                        username={project.username}
                        type={project.ptname}
                        city={project.cityName}
                        region={project.regionName}
                        confirmed={project.confirmed}
                        genre={project.genre1}
                      /> */}
                    </Flex>
                  )}
                </Flex>
              </Box>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6.2 }} mb={isMobile ? 60 : 20}>
            {feed.requesting ? (
              <FeedCardLoading />
            ) : (
              feed.list.map((item, key) => 
                <FeedCard 
                  key={key} 
                  item={item} 
                  likes={
                    feed.likes.filter((feed) => { return feed.feedId === item.id })[0]
                  } 
                />
              )
            )}
          </Grid.Col>
          {largeScreen && 
            <Grid.Col span={3.3}>
              <Card shadow='sm' px='md' pt='sm' pb='lg' radius='md' withBorder className='mublinModule'>
                <Title fz='1.03rem' fw='640'>
                  Músicos em destaque
                </Title>
                {search.requesting ? (
                  <Text size='13px' mt={7}>Carregando...</Text>
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
              <Card shadow='sm' px='md' pt='sm' pb='lg' radius='md' withBorder mt={10} className='mublinModule'> 
                <Title fz='1.03rem' fw='640'>
                  Novos usuários
                </Title>
                {search.requesting ? (
                  <Text size='13px' mt={7}>Carregando...</Text>
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
      <FooterMenuMobile page='home' />
    </>
  );
};

export default Home;