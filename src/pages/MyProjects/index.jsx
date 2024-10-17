import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { Container, Group, Box, Title, Button, Text, Image } from '@mantine/core';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MyProjects () {

  let dispatch = useDispatch();
  const loggedUser = JSON.parse(localStorage.getItem('user'));
  const projects = useSelector(state => state.userProjects);

  console.log(15, projects);

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjects(loggedUser.id,'all'));
  }, [loggedUser.id, dispatch]);

  const cdnBaseURL = 'https://ik.imagekit.io/mublin/';
  const cdnProjectPath = cdnBaseURL+'projects/tr:h-250,w-410,fo-top,c-maintain_ratio/';

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Box mb={24}>
          <Title order={3}>Meus Projetos</Title>
        </Box>
        {projects?.list.map((project) => (
          <Group mb={10}>
            <Image
              src={cdnProjectPath+project?.picture}
              height={160}
              alt={project?.name}
              radius={10}
            />
            <div>
              <Title size="h4">{project.name}</Title>
              <Text size="h4">{project.ptname}</Text>
            </div>
            {/* <Title size="h4">{project.name}</Title>
            <Button variant="default">{project.ptname}</Button> */}
          </Group>
        ))}
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MyProjects;