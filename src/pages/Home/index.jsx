import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventsInfos } from '../../store/actions/events';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Avatar, Tooltip, Title, Text, Grid, Paper, Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import ProjectCard from './projectCard';

function Home () {

  let dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(eventsInfos.getUserEvents(loggedUser.id));
  }, [loggedUser.id, dispatch]);

  const projects = useSelector(state => state.userProjects);
  const projectsTerminated = projects.list.filter((project) => { return project.yearEnd });

  return (
    <>
      <Header />
      <Container size={'lg'} mb={'md'}>
        {projects.requesting ? (
          <>
            <Skeleton height={110} radius="md" />
            <Skeleton height={58} mt={6} radius="md" />
            <Skeleton height={58} mt={6} width="70%" radius="md" />
          </>
        ) : (
          <>
            <Grid align="center">
              <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
                <Title size="h5" mb={4}>
                  Você está cadastrado em {projects?.list.length} projetos
                </Title>
                <Avatar.Group mb={16}>
                  {projects?.list.slice(0, 5).map((p) => (
                    <Tooltip label={p.name} key={p.id} withArrow>
                      <Avatar 
                        size='lg'
                        src={'https://ik.imagekit.io/mublin/projects/tr:h-80,w-80,c-maintain_ratio/'+p.picture} 
                      />
                    </Tooltip>
                  ))}
                  {projects?.list.length > 5 && 
                    <Avatar size='lg'>+{projects?.list.length - 5}</Avatar>
                  }
                </Avatar.Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
                <Grid grow gutter="xs">
                  <Grid.Col span={6}>
                    <Paper radius="md" withBorder p='sm' style={{ backgroundColor: 'transparent' }}>
                      <Text size="xs" fw={500}>Principais</Text>
                      <Text size="xs" c="dimmed">4 projetos</Text>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Paper radius="md" withBorder p='sm' style={{ backgroundColor: 'transparent' }}>
                      <Text size="xs" fw={500}>Temporários</Text>
                      <Text size="xs" c="dimmed">4 projetos</Text>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Paper radius="md" withBorder p='sm' style={{ backgroundColor: 'transparent' }}>
                      <Text size="xs" fw={500}>Ativo em</Text>
                      <Text size="xs" c="dimmed">4 projetos</Text>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Paper radius="md" withBorder p='sm' style={{ backgroundColor: 'transparent' }}>
                      <Text size="xs" fw={500}>Encerrados</Text>
                      <Text size="xs" c="dimmed">{projectsTerminated?.length} projetos</Text>
                    </Paper>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Container>
      <Container size={'lg'}>
        <Grid mb={largeScreen ? 30 : 86}>
          {projects.requesting ? ( 
            Array.apply(null, { length: 4 }).map((e, i) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 3 }} key={i}>
                <>
                  <Skeleton height={50} circle mb="xl" mt="lg" />
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </>
              </Grid.Col>
            ))
          ) : (
            projects?.list.map((p) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 3 }} key={p.id}>
                <ProjectCard 
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
              </Grid.Col>
            ))
          )}
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default Home;