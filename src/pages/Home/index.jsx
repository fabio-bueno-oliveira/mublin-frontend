import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Avatar, Tooltip, Text, Grid, Paper, Skeleton } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import ProjectCard from './projectCard';

function Home () {

  let dispatch = useDispatch();

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
  }, [loggedUser.id, dispatch]);

  // const user = useSelector(state => state.user);
  const projects = useSelector(state => state.userProjects);

  const projectsTerminated = projects.list.filter((project) => { return project.yearEnd });

  return (
    <>
      <Header />
      <Container size={'sm'} mb={'md'}>
        {projects.requesting ? (
          <>
            <Skeleton height={110} radius="md" />
            <Skeleton height={58} mt={6} radius="md" />
            <Skeleton height={58} mt={6} width="70%" radius="md" />
          </>
        ) : (
          <>
            <Paper shadow="sm" radius="md" withBorder p='sm' mb='sm'>
              <Text size="sm" mb='sm'>
                Você está cadastrado em {projects?.list.length} projetos
              </Text>
              <Avatar.Group>
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
            </Paper>
            <Grid grow gutter="xs">
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="xs">Principais</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="xs">Temporários</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="xs">Ativo em</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="xs">Encerrados</Text>
                  <Text size="xs" c="dimmed">{projectsTerminated?.length} projetos</Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Container>
      <Container size={'lg'}>
        <Grid mb={74}>
          {projects?.list.map((p) => (
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
          ))}
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default Home;