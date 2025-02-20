import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
// import { eventsInfos } from '../../store/actions/events';
import { userActions } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Flex, Center, Box, Card, Title, Badge, Text, Grid, Skeleton, Switch, Button, Avatar, Image, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import UserCard from '../../components/userCard';
import Header from '../../components/header';
import HeaderMobile from '../../components/header/mobile';
import FooterMenuMobile from '../../components/footerMenuMobile';
import ProjectCard from './projectCard';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import { IconPlus } from '@tabler/icons-react';

function Home () {

  document.title = `Home | Mublin`;

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [showEndedProjects, setShowEndedProjects] = useState(true);

  const user = useSelector(state => state.user);
  const projects = useSelector(state => state.userProjects);
  const projectsTerminated = projects.list.filter((project) => { return project.yearEnd });
  // const events = useSelector(state => state.events.list);
  const totalProjects = projects.totalProjects;
  const search = useSelector(state => state.search);

  const projectsToShow = showEndedProjects
    ? projects?.list 
    : projects?.list.filter((project) => { return !project.yearEnd })

  useEffect(() => {
    dispatch(userInfos.getUserRolesInfoById(loggedUserId));
    dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'));
    // dispatch(eventsInfos.getUserEvents(loggedUserId));
    dispatch(searchInfos.getSuggestedFeaturedUsers());
    dispatch(searchInfos.getSuggestedNewUsers());
    if (user.success && user.first_access !== 0) {
      navigate("/start/intro/")
    }
  }, []);

  return (
    <>
      {isMobile ? (
        <HeaderMobile page="home" />
      ) : (
        <Header page="home" />
      )}
      <Container size={'lg'} mb={'lg'} mt={largeScreen ? 20 : 0}>
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
                      <Badge size='sm' variant='light' color="violet">PRO</Badge>
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
          <Grid.Col span={{ base: 12, md: 12, lg: 7 }}>
            {projects.requesting ? ( 
              <Grid mb={largeScreen ? 30 : 86}>
                {Array.apply(null, { length: 2 }).map((e, i) => (
                  <Grid.Col span={{ base: 12, md: 2, lg: 6 }} key={i}>
                    <Card className="mublinModule" h="210px" padding="lg" radius="md" withBorder>
                      <Skeleton height={14} width={"40%"} radius="xl" />
                      <Skeleton height={50} width={50} mt={13} radius="md" />
                      <Skeleton height={14} width={"76%"} mt={13} radius="xl" />
                      <Skeleton height={14} width={"50%"} mt={6} radius="xl" />
                      <Skeleton height={14} width={"50%"} mt={6} radius="xl" />
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Box mb={largeScreen ? 30 : 86}>
                {!!totalProjects && 
                <Card 
                  mb={19} 
                  padding={largeScreen ? "md" : 0} 
                  radius={largeScreen ? "md" : 0} 
                  withBorder={largeScreen ? true : false}
                  style={isMobile ? {backgroundColor: "transparent"} : undefined}
                  className="mublinModule"
                >
                  <Flex justify="space-between" align="center">
                    <div>
                      <Text size="md" mb={projectsTerminated.length ? 3 : 0} fw={500}>
                        Você está cadastrado em {totalProjects} {totalProjects === 1 ? " projeto" : " projetos"}
                      </Text>
                      {!!projectsTerminated.length && 
                        <Switch
                          label="Exibir projetos encerrados"
                          color='violet'
                          checked={showEndedProjects}
                          size="xs"
                          onChange={(event) => setShowEndedProjects(event.currentTarget.checked)}
                          w={"fit-content"}
                        />
                      }
                    </div>
                    {largeScreen && 
                      <Link to={{ pathname: `/new` }}>
                        <Button size="sm" color="violet" leftSection={<IconPlus size={14} />}>
                          Criar ou entrar em um projeto
                        </Button>
                      </Link>
                    }
                  </Flex>
                </Card>
                }
                {totalProjects > 0 ? (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
                    gutterBreakpoints={{350: "10px", 750: "10px", 900: "10px"}}
                  >
                    <Masonry>
                      {projectsToShow.map((p, key) => (
                        <ProjectCard 
                          keyIndex={key}
                          loading={projects.requesting}
                          project={p}
                          activeMembers={
                            projects?.members?.filter(
                              (member) => { 
                                return member.projectId === p.projectid 
                                && !member.leftIn 
                              }
                            ).sort((a, b) => b.leader - a.leader)
                          }
                        />
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                ) : (
                  <>
                    <Center>
                      <Image src={'https://ik.imagekit.io/mublin/misc/astronaut-musician-3.png?updatedAt=1731982735493'} w='240' style={{opacity:'0.3'}} />
                    </Center>
                    {projects.totalProjects === 0 && 
                      <>
                        <Text size="sm" ta="center">
                          Você não está cadastrado em nenhum projeto atualmente.
                        </Text>
                        <Center>
                          <Link to={{ pathname: `/new` }}>
                            <Text size="sm" ta="center" color="violet">
                              Crie ou entre em algum projeto de música!
                            </Text>
                          </Link>
                        </Center>
                      </>
                    }
                  </>
                )}
              </Box>
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