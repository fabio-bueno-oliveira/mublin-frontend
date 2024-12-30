import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { userInfos } from '../../store/actions/user'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { searchInfos } from '../../store/actions/search'
import { Container, Center, Card, Title, Badge, Text, Grid, Skeleton, Avatar, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import UserCard from '../../components/userCard'
import ProjectCard from '../../components/projectCard'
import FeedCard from './feedCard'
import FeedCardLoading from './feedCardLoading'
import Header from '../../components/header'
import HeaderMobile from '../../components/header/mobile'
import FooterMenuMobile from '../../components/footerMenuMobile'

function Home () {

  document.title = 'Home | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const largeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const loggedUser = JSON.parse(localStorage.getItem('user'))

  const user = useSelector(state => state.user)
  const projects = useSelector(state => state.userProjects)
  const search = useSelector(state => state.search)
  const feed = useSelector(state => state.feed)

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(miscInfos.getFeed());
    dispatch(miscInfos.getFeedLikes());
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
    dispatch(searchInfos.getSuggestedFeaturedUsers());
    dispatch(searchInfos.getSuggestedNewUsers());
    if (user.success && user.first_access !== 0) {
      navigate('/start/intro/')
    }
  }, [])

  return (
    <>
      {isMobile ? (
        <HeaderMobile page='home' reloadUserInfo />
      ) : (
        <Header page='home' reloadUserInfo />
      )}
      <Container size='lg' mb='lg' mt={largeScreen ? 20 : 0}>
        <Grid>
          {largeScreen && 
            <Grid.Col span={{ base: 12, md: 12, lg: 2.5 }} pt='8'>
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
                  >
                    <Center>
                      <Link to={{ pathname: `/${user.username}` }}>
                        <Avatar 
                          size="lg"
                          src={user.picture ? 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : null} 
                        />
                      </Link>
                    </Center>
                    <Title fw='460' fz='1.1rem' mb={1} mt={10} ta='center' className='op80'>
                      Olá, {user?.name}
                    </Title>
                    {user.plan === 'Pro' && 
                      <Center>
                        <Badge size='xs' variant='light' color='gray'>PRO</Badge>
                      </Center>
                    }
                    <Text ta="center" c="dimmed" fw='400' fz='0.8rem' className='lhNormal' mt={13}>
                      {user.roles.map(role => 
                        <span className="comma" key={role.id}>{role.description}</span>
                      )}
                    </Text>
                    {/* <Text ta="center"  size="xs" mt={9} c="dimmed">
                      {user.bio}
                    </Text> */}
                  </Card>
                  <Card 
                    mt='10'
                    padding={12} 
                    radius={"md"} 
                    withBorder
                    className="mublinModule"
                  >
                    {/* <Text fw='400' size='lg'>Meus projetos</Text> */}
                    {projects.list.map(project =>
                      <>
                        <ProjectCard 
                          key={project.projectid}
                          mb={14}
                          picture={project.picture}
                          name={project.name}
                          username={project.username}
                          type={project.ptname}
                          city={project.cityName}
                          region={project.regionName}
                          confirmed={project.confirmed}
                        />
                      </>
                    )}
                  </Card>
                </>
              )}
            </Grid.Col>
          }
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
                <Text fw='400' size='lg'>Músicos em destaque</Text>
                {search.requesting ? (
                  <Text size='13px' mt={7}>Carregando...</Text>
                ) : (
                  search.suggestedFeaturedUsers.map(user => (
                    <UserCard 
                      mt={14}
                      key={user.id}
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
              <Card shadow="sm" px="md" pt="sm" pb="lg" radius="md" withBorder mt={10} className="mublinModule">
                <Text fw={400} size="lg">Novos usuários</Text>
                {search.requesting ? (
                  <Text size="13px" mt={7}>Carregando...</Text>
                ) : (
                  search.suggestedNewUsers.map((user, key) => (
                    <UserCard 
                      mt={14}
                      key={key}
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