import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { projectInfos } from '../../store/actions/project';
import { Container, Grid, Center, Divider, Group, Flex, NavLink, Box, Alert, Title, Text, Button, NativeSelect, Card, Image, Loader } from '@mantine/core';
import { IconHome, IconFileDescription, IconUsersGroup, IconRocket, IconEye } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MyProjects () {

  document.title = 'Meus projetos | Mublin';

  let dispatch = useDispatch();
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const [searchParams] = useSearchParams();
  const selectedProjectViaUrl = searchParams.get('p');

  const [selectedProject, setSelectedProject] = useState(selectedProjectViaUrl);
  const [showAlert, setShowAlert] = useState(true);

  const largeScreen = useMediaQuery('(min-width: 60em)');
  
  const projects = useSelector(state => state.userProjects);
  const project = useSelector(state => state.project);

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUser.id));
    if (selectedProjectViaUrl) {
      dispatch(projectInfos.getProjectInfo(selectedProjectViaUrl));
      dispatch(projectInfos.getProjectMembers(selectedProjectViaUrl));
    }
  }, [loggedUser.id, dispatch]);

  useEffect(() => {
    if (!selectedProjectViaUrl && projects.success) {
      dispatch(projectInfos.getProjectInfo(projects?.listBasicInfo[0]?.username));
      dispatch(projectInfos.getProjectMembers(projects?.listBasicInfo[0]?.username));
    }
  }, [projects.success]);

  const cdnProjectPath = 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/';

  const projectsList = projects?.listBasicInfo.map(project => ({
    value: String(project.username),
    label: project.name
  }));

  const selectProject = (username) => {
    setSelectedProject(username);
    dispatch(projectInfos.getProjectInfo(username));
    dispatch(projectInfos.getProjectMembers(username));
  }

  const blurredImageURL = 'https://ik.imagekit.io/mublin/projects/tr:bl-6,o-25,bg-black,fo-middle/';

  return (
    <>
      <Header pageType="myProjects" />
      <Container
        size={'lg'}
        mb={largeScreen ? 30 : 82}
        pt={largeScreen ? 20 : 0}
        className='myProjectsPage'
      >
        <NativeSelect
          size="lg"
          mb={20}
          placeholder="Escolha um projeto"
          value={selectedProject ? selectedProject : undefined}
          onChange={(e) => selectProject(e.currentTarget.value)}
        >
          <option value="">Selecione o projeto</option>
          {projectsList.map((project, key) =>
            <option key={key} value={project.value}>
              {project.label}
            </option>
          )}
        </NativeSelect>

        <Grid mb={80}>
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <Card p={0} h={600} className="mublinModule" withBorder radius="md">
              <Card.Section radius="md">
                <Image
                  src={project?.picture ? blurredImageURL+project?.picture : undefined}
                  height={85}
                />
              </Card.Section>
              <Image 
                src={project?.picture ? cdnProjectPath+project?.picture : undefined }
                radius="md"
                h="auto"
                w={120}
                ml={20}
                style={{ marginTop:'-44px', position:'relative', outline: '2px solid #FFF'}}
              />
              <Box px={20} pt={10}>
                <Title order={3}>{project.name}</Title>
                <Text size="sm" c="dimmed" fw="500">
                  {project.username}
                </Text>
                <Button 
                  mt={10} 
                  mb={4} 
                  size="xs" 
                  color="dark" 
                  fullWidth
                  leftSection={<IconEye size={14} />}
                  component="a"
                  href={`/project/${project.username}`}
                >
                  Ver perfil do projeto
                </Button>
                <NavLink
                  active
                  color='violet'
                  mt={15}
                  href="#required-for-focus"
                  label="Início"
                  leftSection={<IconHome size="1rem" stroke={1.5} />}
                />
                <NavLink
                  href="#required-for-focus"
                  label="Sobre o projeto"
                  leftSection={<IconFileDescription size="1rem" stroke={1.5} />}
                />
                <NavLink
                  href="#required-for-focus"
                  label="Integrantes"
                  leftSection={<IconUsersGroup size="1rem" stroke={1.5} />}
                />
                <Divider />
              </Box>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
            {showAlert && 
              <Alert 
                variant="light" 
                color="violet" 
                withCloseButton 
                onClose={() => setShowAlert(false)}
                withBorder
                title="Este é o painel do projeto"
                icon={<IconRocket />}
                mb={14}
              >
                Aqui você consegue acompanhar informações internas do projeto para se manter sempre informado
              </Alert>
            }
            {project.requesting ? ( 
              <Card p={20} h={100} className="mublinModule" withBorder>
                <Center pt={14}>
                  <Loader />
                </Center>
              </Card>
            ) : (
              <>
                <Card p={16} className="mublinModule" withBorder>
                  <Title order={4} mb={8}>Visao geral do projeto</Title>
                  <Text size="sm">
                    <strong>Tipo de projeto:</strong> {project.typeName}
                  </Text>
                  <Text size="sm">
                    <strong> Ano de fundação:</strong> {project.foundationYear ? project.foundationYear : "Não informado"}
                  </Text>
                </Card>
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MyProjects;