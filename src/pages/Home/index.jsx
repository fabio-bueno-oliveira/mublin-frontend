import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { userInfos } from '../../store/actions/user'
import { searchInfos } from '../../store/actions/search'
import { Container, Flex, Center, Box, Card, Divider, Title, Badge, Text, Grid, Skeleton, Avatar, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import UserCard from '../../components/userCard'
import FeedCard from './feedCard'
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
    dispatch(miscInfos.getFeed());
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
        <HeaderMobile pageType="home" />
      ) : (
        <Header pageType="home" />
      )}
      <Container size={'lg'} mb={'lg'} mt={largeScreen ? 20 : 0} px={largeScreen ? 20 : 0}>
        <Grid>
          {largeScreen && 
            <Grid.Col span={{ base: 12, md: 12, lg: 2 }} pt={8}>
              {projects.requesting || !user.success ? (
                <>
                  <Skeleton height={56} circle />
                  <Skeleton height={16} width={125} mt={10} radius="md" />
                </>
              ) : (
                <Card 
                  padding={12} 
                  radius={"md"} 
                  withBorder
                  className="mublinModule"
                >
                  <Center>
                    <Link to={{ pathname: `/${user.username}` }}>
                      <Avatar 
                        size="lg"
                        src={user.picture ? 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : null} 
                      />
                    </Link>
                  </Center>
                  <Title fw={500} order={5} mb={1} mt={10} ta="center">
                    Olá, {user?.name}
                  </Title>
                  {user.plan === 'Pro' && 
                    <Center>
                      <Badge size='xs' variant='outline' color="gray">PRO</Badge>
                    </Center>
                  }
                  <Text ta="center" c="dimmed" fw="400" size="13px" mt={13}>
                    {user.roles.map((role, key) => 
                      <span className="comma" key={key}>{role.description}</span>
                    )}
                  </Text>
                  <Text ta="center"  size="xs" mt={9} c="dimmed">
                    {user.bio}
                  </Text>
                </Card>
              )}
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 7 }} mb={isMobile ? 60 : 20}>
            <Card 
              px='md' pt='sm' pb='lg'
              radius='md' 
              withBorder 
              className='mublinModule' 
              id='feed'
            >
              <Flex>
                
              </Flex>
              Meus projetos
            </Card>
            <Divider my="xs" label="Atualizações" labelPosition="center" />
            {feed.requesting ? (
              <Card 
                px='md'
                pt='sm'
                mb='xs'
                radius='md'
                withBorder
                className='mublinModule'
                id='feed'
              >
                <Flex gap={5} align='center'>
                  <Skeleton height={45} circle />
                  <Box>
                    <Skeleton height={13} radius="xl" />
                    <Skeleton height={10} width={200} radius="xl" mt={10} />
                  </Box>
                </Flex>
                <Skeleton height={10} width={300} radius="xl" mt={10} />
              </Card>
            ) : (
              feed.list.map((item, key) => 
                <FeedCard item={item} key={key} />
              )
            )}
          </Grid.Col>
          {largeScreen && 
            <Grid.Col span={3}>
              <Card shadow="sm" px="md" pt="sm" pb="lg" radius="md" withBorder className="mublinModule">
                <Text fw={400} size="lg">Músicos em destaque</Text>
                {search.requesting ? (
                  <Text size="13px" mt={7}>Carregando...</Text>
                ) : (
                  search.suggestedFeaturedUsers.map((user, key) => (
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
      <FooterMenuMobile />
    </>
  );
};

export default Home;