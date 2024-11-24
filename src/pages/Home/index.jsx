import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eventsInfos } from '../../store/actions/events';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Title, Text, Grid, Skeleton, Switch } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import ProjectCard from './projectCard';

function Home () {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const largeScreen = useMediaQuery('(min-width: 60em)');
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const [showEndedProjects, setShowEndedProjects] = useState(true);

  const user = useSelector(state => state.user);
  const projects = useSelector(state => state.userProjects);
  const projectsTerminated = projects.list.filter((project) => { return project.yearEnd });
  const totalProjects = projects.totalProjects;

  const projectsToShow = showEndedProjects
    ? projects?.list 
    : projects?.list.filter((project) => { return !project.yearEnd })

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(eventsInfos.getUserEvents(loggedUser.id));
    if (user.success && user.first_access !== 0) {
      navigate("/start/intro/")
    }
  }, []);

  return (
    <>
      <Header pageType="home" />
      <Container size={'lg'} mb={'lg'} mt={largeScreen ? 20 : 0}>
        {projects.requesting || !user.success ? (
          <>
            <Skeleton height={34} width={190} radius="md" />
            <Skeleton height={24} width={400} mt={10} radius="md" />
            <Skeleton height={18} width={150} mt={6} radius="md" />
          </>
        ) : (
          <>
            <Title order={3} mb={1}>
              Olá, {user?.name}
            </Title>
            <Text size="md" mb={4}>
              Você está cadastrado em {totalProjects} {totalProjects === 1 ? " projeto" : " projetos"}
            </Text>
            <Switch
              label="Exibir projetos encerrados"
              color='violet'
              checked={showEndedProjects}
              size="xs"
              onChange={(event) => setShowEndedProjects(event.currentTarget.checked)}
            />
          </>
        )}
      </Container>
      <Container size={'lg'}>
        <Grid mb={largeScreen ? 30 : 86}>
          {projects.requesting ? ( 
            Array.apply(null, { length: 3 }).map((e, i) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 4 }} key={i}>
                <>
                  <Skeleton height={8} radius="xl" />
                  <Skeleton height={50} circle mb="xl" mt="lg" />
                  <Skeleton height={8} mt={6} radius="xl" />
                  <Skeleton height={8} mt={6} width="70%" radius="xl" />
                </>
              </Grid.Col>
            ))
          ) : (
            projectsToShow.map((p) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 4 }} key={p.id}>
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