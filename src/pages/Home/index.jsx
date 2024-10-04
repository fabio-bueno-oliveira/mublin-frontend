import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Box, Title, Table } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import Header from '../../components/header';

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

  const rows = projects?.list.map((p) => (
    <Table.Tr key={p.id} c={p.yearLeftTheProject ? 'dimmed' : 'black'}>
      <Table.Td>{!!p.featured && <IconStarFilled color='black' height={10} w={0} />}{p.name}</Table.Td>
      <Table.Td>{p.ptname}</Table.Td>
      <Table.Td>{p.joined_in}</Table.Td>
      <Table.Td>{p.genre1}</Table.Td>
      <Table.Td>{p.role1}{p.role2 && ', '+p.role2}{p.role3 && ', '+p.role3}</Table.Td>
      <Table.Td>{p.workTitle}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={3}>Olá, {user.name}</Title>
          <Title order={4}>Meus projetos ({projects?.list.length})</Title>
        </Box>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Projeto</Table.Th>
              <Table.Th>Tipo do projeto</Table.Th>
              <Table.Th>Ano entrada</Table.Th>
              <Table.Th>Estilo/Gênero</Table.Th>
              <Table.Th>Papéis</Table.Th>
              <Table.Th>Atuação</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </>
  );
};

export default Home;