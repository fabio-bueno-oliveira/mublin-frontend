import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eventsInfos } from '../../store/actions/events';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Box, Card, Title, Text, Grid, Skeleton, Switch } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import ProjectCard from './projectCard';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

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
            <Skeleton height={21} width={400} mt={6} radius="md" />
            <Skeleton height={14} width={150} mt={6} radius="md" />
          </>
        ) : (
          <>
            <Title order={3} mb={1}>
              Olá, {user?.name}
            </Title>
            <Text size="md" mb={4}>
              Você está cadastrado em {totalProjects} {totalProjects === 1 ? " projeto" : " projetos"}
            </Text>
            {projectsTerminated.length && 
              <Switch
                label="Exibir projetos encerrados"
                color='violet'
                checked={showEndedProjects}
                size="xs"
                onChange={(event) => setShowEndedProjects(event.currentTarget.checked)}
                w={"fit-content"}
              />
            }
          </>
        )}
      </Container>
      <Container size={'lg'}>
        {projects.requesting ? ( 
          <Grid mb={largeScreen ? 30 : 86}>
            {Array.apply(null, { length: 3 }).map((e, i) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 4 }} key={i} mt={20}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
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
            <ResponsiveMasonry
              columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
              <Masonry gutter="10px">
                {projectsToShow.map((p) => (
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
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </Box>
        )}
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default Home;