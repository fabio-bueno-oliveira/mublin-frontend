import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { projectInfos } from '../../store/actions/project';
import { Container, Center, Group, Flex, Title, Text, Button, NativeSelect, Card, Image, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MyProjects () {

  document.title = 'Meus projetos | Mublin';

  let dispatch = useDispatch();
  const loggedUser = JSON.parse(localStorage.getItem('user'));
  const largeScreen = useMediaQuery('(min-width: 60em)');
  
  const projects = useSelector(state => state.userProjects);
  const project = useSelector(state => state.project);

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUser.id));
  }, [loggedUser.id, dispatch]);

  const cdnProjectPath = 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/';

  const projectsList = projects?.listBasicInfo.map(project => ({
    value: String(project.username),
    label: project.name
  }));

  const [selectedProject, setSelectedProject] = useState(null);

  const selectProject = (username) => {
    setSelectedProject(username);
    dispatch(projectInfos.getProjectInfo(username));
    dispatch(projectInfos.getProjectMembers(username));
  }

  return (
    <>
      <Header />
      <Container 
        size={'lg'} 
        mb={largeScreen ? 30 : 82} 
        pt={largeScreen ? 20 : 0} 
        className='myProjectsPage'
      >
        <NativeSelect
          size="md"
          mb={20}
          placeholder="Escolha um projeto"
          value={selectedProject ? selectedProject : null}
          onChange={(e) => selectProject(e.currentTarget.value)}
          allowDeselect={false}
        >
          <option value="">Selecione o projeto</option>
          {projectsList.map((project, key) =>
            <option key={key} value={project.value}>
              {project.label}
            </option>
          )}
        </NativeSelect>

        {project.requesting && 
          <Center>
            <Loader />
          </Center>
        }
        {(!project.requesting && selectedProject) && 
          <>
            <Card p={20} className="mublinModule" withBorder>
              <Group>
                <Image 
                  src={cdnProjectPath+project.picture}
                  radius="md"
                  h="auto"
                  w={120}
                />
                <Flex direction='column'>
                  <Title>{project.name}</Title>
                  <Text>Tipo do projeto: {project.typeName}</Text>
                </Flex>
              </Group>
              <Flex gap={7} mt={20}>
                <Button fullWidth variant="default" disabled>Visão geral</Button>
                <Button fullWidth variant="default">Integrantes</Button>
                <Button fullWidth variant="default">Eventos</Button>
                <Button fullWidth variant="default">Configurações</Button>
              </Flex>
            </Card>
            <Card mt={10} p={20} className="mublinModule" withBorder>
              <Title order={4}>Ano de fundação:</Title>
              <Text size="sm">{project.foundationYear ? project.foundationYear : "Não informado"}</Text>
              <Title order={4} mt={10}>Propósito</Title>
              <Text size="sm">{project.purpose ? project.purpose : "Não informado"}</Text>
              <Title order={4} mt={10}>Bio</Title>
              <Text size="sm">{project.bio ? project.bio : "Não informado"}</Text>
            </Card>
          </>
        }
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MyProjects;