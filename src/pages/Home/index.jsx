import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Text, Title, Button, Grid, Image } from '@mantine/core';
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

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Title order={1}>Olá, {user.name}</Title>
        <Title order={3}>Olá, {user.name}</Title>
      </Container>
    </>
  );
};

export default Home;