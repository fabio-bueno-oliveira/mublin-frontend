import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, ActionIcon, Box, Title, Table, Grid } from '@mantine/core';
import { IconStarFilled, IconDots, IconList, IconLayoutGrid } from '@tabler/icons-react';
import Header from '../../components/header';
import ProjectCard from './projectCard';

function Home () {

  let dispatch = useDispatch();

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
    dispatch(userInfos.getUserRolesInfoById(loggedUser.id));
    // dispatch(eventsInfos.getUserEvents(user.id));
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

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={14}>
          <Title order={3}>Olá, {user.name}</Title>
          <Title order={4}>Meus projetos ({projects?.list.length})</Title>
        </Box>
        <Box mb={22}>
          <ActionIcon 
            variant={layoutDisplay === "cards" ? "outline" : "light"}
            color="violet"
            onClick={() => setLayoutdisplay('cards')}
            size="lg"
            mr={4} 
          >
            <IconLayoutGrid style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon 
            variant={layoutDisplay === "list" ? "outline" : "light"}
            color="violet"
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
              <Grid.Col span={3} key={p.id}>
                <ProjectCard project={p} />
              </Grid.Col>
            ))}
          </Grid>
        }
      </Container>
    </>
  );
};

export default Home;