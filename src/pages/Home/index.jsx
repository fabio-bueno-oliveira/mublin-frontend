import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, ActionIcon, Box, Avatar, Tooltip, Text, Table, Grid, Paper, Skeleton } from '@mantine/core';
import { IconStarFilled, IconDots, IconList, IconLayoutGrid } from '@tabler/icons-react';
import Header from '../../components/header';
import ProjectCard from './projectCard';

function Home () {

  let dispatch = useDispatch();

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
  }, [loggedUser.id, dispatch]);

  const user = useSelector(state => state.user);
  const projects = useSelector(state => state.userProjects);
  const [layoutDisplay, setLayoutdisplay] = useState('cards');

  const rows = projects?.list.map((p) => (
    <Table.Tr 
      key={p.id} 
      // c={p.yearLeftTheProject ? 'dimmed' : ''}
    >
      <Table.Td>{!!p.featured && <IconStarFilled height={10} w={0} />}{p.name}</Table.Td>
      <Table.Td>{p.ptname} {p.yearEnd && `(encerrado em ${p.yearEnd})`}</Table.Td>
      <Table.Td>{p.joined_in}</Table.Td>
      <Table.Td>{p.genre1}</Table.Td>
      <Table.Td>{p.role1}{p.role2 && ', '+p.role2}{p.role3 && ', '+p.role3}</Table.Td>
      <Table.Td>{p.workTitle} {p.yearLeftTheProject && `até ${p.yearLeftTheProject}`}</Table.Td>
      <Table.Td>
        <ActionIcon variant="transparent" aria-label="Settings">
          <IconDots style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const projectsTerminated = projects.list.filter((project) => { return project.yearEnd });

  return (
    <>
      <Header />
      <Container size={'sm'} mb={'md'}>
        {projects.requesting ? (
          <>
            <Skeleton height={110} radius="xl" />
            <Skeleton height={58} mt={6} radius="xl" />
            <Skeleton height={58} mt={6} width="70%" radius="xl" />
          </>
        ) : (
          <>
            <Paper shadow="sm" radius="md" withBorder p='sm' mb='sm'>
              <Text size="sm" mb='sm'>
                Você está cadastrado em {projects?.list.length} projetos
              </Text>
              <Avatar.Group>
                {projects?.list.map((p) => (
                  <Tooltip label={p.name} key={p.id} withArrow>
                    <Avatar 
                      size='lg'
                      src={'https://ik.imagekit.io/mublin/projects/tr:h-80,w-80,c-maintain_ratio/'+p.picture} 
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Paper>
            <Grid grow gutter="xs">
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="sm">Principais</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="sm">Temporários</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="sm">Ativo em</Text>
                  <Text size="xs" c="dimmed">4 projetos</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper shadow="sm" radius="md" withBorder p='sm'>
                  <Text size="sm">Encerrados</Text>
                  <Text size="xs" c="dimmed">{projectsTerminated?.length} projetos</Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Container>
      <Container size={'lg'}>
        <Box mb={22}>
          <ActionIcon 
            variant={layoutDisplay === "cards" ? "default" : "outline"}
            // color="violet"
            onClick={() => setLayoutdisplay('cards')}
            size="lg"
            mr={4} 
          >
            <IconLayoutGrid style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon 
            variant={layoutDisplay === "list" ? "default" : "outline"}
            // color="violet"
            onClick={() => setLayoutdisplay('list')}
            size="lg"
          >
            <IconList style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Box>
        {layoutDisplay === 'list' && 
          <Table.ScrollContainer minWidth={500} type="native">
            <Table striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Projeto</Table.Th>
                  <Table.Th>Tipo do projeto</Table.Th>
                  <Table.Th>Ano entrada</Table.Th>
                  <Table.Th>Estilo/Gênero</Table.Th>
                  <Table.Th>Papéis</Table.Th>
                  <Table.Th>Atuação</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        }
        {layoutDisplay === 'cards' && 
          <Grid>
            {projects?.list.map((p) => (
              <Grid.Col span={{ base: 12, md: 2, lg: 3 }} key={p.id}>
                <ProjectCard 
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
        }
      </Container>
    </>
  );
};

export default Home;