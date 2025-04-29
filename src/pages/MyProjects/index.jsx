import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { projectInfos } from '../../store/actions/project';
import { Container, Grid, Center, Divider, Group, Flex, ScrollArea, NavLink, Box, Avatar, Title, Text, Button, Badge, Select, NativeSelect, Card, Image, Loader, em } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { DatesProvider, Calendar } from '@mantine/dates';
import { IconHome, IconFileDescription, IconUsersGroup, IconCalendar } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MyProjects () {

  document.title = 'Meus projetos | Mublin';

  let dispatch = useDispatch();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const [searchParams] = useSearchParams();
  const selectedProjectViaUrl = searchParams.get('p');

  const [selectedProject, setSelectedProject] = useState(selectedProjectViaUrl);

  //Calendar Functions
  const [selected, setSelected] = useState([]);
  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, 'date'));
    if (isSelected) {
      setSelected((current) => current.filter((d) => !dayjs(d).isSame(date, 'date')));
    } else if (selected.length < 3) {
      setSelected((current) => [...current, date]);
    }
  };

  const isLargeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  
  const projects = useSelector(state => state.userProjects);
  const project = useSelector(state => state.project);
  const members = project.members;

  useEffect(() => {
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUserId));
    if (selectedProjectViaUrl) {
      dispatch(projectInfos.getProjectInfo(selectedProjectViaUrl));
      dispatch(projectInfos.getProjectMembers(selectedProjectViaUrl));
    }
  }, [userInfo.id, dispatch]);

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

  const currentYear = new Date().getFullYear();
  const yearText = (yearSum) => {
    return yearSum === 1 ? " ano" : " anos";
  }
  const years = (yearSmallest, yearBiggest) => {
    let subtraction = (yearBiggest - yearSmallest);
    return subtraction === 0 ? "(menos de 1 ano)" : "("+subtraction + yearText(subtraction)+")";
  }

  const [subPage, setSubPage] = useState({value: "1",label: "Visão geral"});
  const subPages = [
    { value: '1', label: 'Visão geral' },
    { value: '2', label: 'Integrantes' },
    { value: '3', label: 'Eventos' },
    { value: '4', label: 'Alterar dados do projeto' },
    { value: '5', label: 'Ir para o perfil do projeto' }
  ];

  return (
    <>
      <Header page="myProjects" />
      <Container
        size={'lg'}
        mb={isLargeScreen ? 30 : 82}
        pt={isLargeScreen ? 20 : 0}
        className='myProjectsPage'
      >
        <NativeSelect
          size="lg"
          mb={20}
          placeholder="Escolha um projeto"
          value={selectedProject ? selectedProject : undefined}
          onChange={(e) => selectProject(e.currentTarget.value)}
        >
          {projects.requesting ? (
            <option value="">Carregando projetos...</option>
          ) : (
            <option value="">Selecione o projeto</option>
          )}
          {!projects.requesting && projectsList.map((project, key) =>
            <option key={key} value={project.value}>
              {project.label}
            </option>
          )}
        </NativeSelect>
        {selectedProject ? ( 
          <Grid mb={80}>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Card p={0} h={isMobile ? 260 : 600} className="mublinModule" withBorder radius="md">
                {project.requesting ? (
                  <Center pt={38}>
                    <Loader />
                  </Center>
                ) : (
                  <>
                    <Card.Section radius="md">
                      <Image
                        src={project?.picture ? blurredImageURL+project?.picture : undefined}
                        height={85}
                      />
                    </Card.Section>
                    <Group>
                      <Image 
                        src={project?.picture ? cdnProjectPath+project?.picture : undefined }
                        radius="md"
                        h="auto"
                        w={isLargeScreen ? 120 : 60}
                        ml={20}
                        style={
                          { marginTop:'-44px', position:'relative', outline: '2px solid #FFF'}
                        }
                      />
                    </Group>
                    <Text>adad</Text>
                    {isMobile && 
                      <Select
                        size="md"
                        mx={20}
                        mt={20}
                        mb={4}
                        data={subPages}
                        value={subPage ? subPage.value : null}
                        onChange={(_value, option) => setSubPage(option)}
                      />
                    }
                    {isMobile && 
                      <ScrollArea 
                        mx={20}
                        mb={11} 
                        type="always" 
                        w="auto" 
                        h={44}
                      >
                        <Box w={520}>
                        <Flex gap={14}>
                          <Text c="white">Visão geral</Text>
                          <Text c="white">Integrantes</Text>
                          <Text c="white">Eventos</Text>
                          <Text c="white">Notas</Text>
                          <Text c="white">Alterar dados do projeto</Text>
                        </Flex>
                        </Box>
                      </ScrollArea>
                    }
                    {isLargeScreen && 
                      <Box px={20} pt={10}>
                        <NavLink
                          active
                          color='violet'
                          mt={15}
                          href="#required-for-focus"
                          label="Visão geral"
                          leftSection={<IconHome size="1rem" stroke={1.5} />}
                        />
                        <NavLink
                          href="#required-for-focus"
                          label="Integrantes"
                          leftSection={<IconUsersGroup size="1rem" stroke={1.5} />}
                        />
                        <NavLink
                          href="#required-for-focus"
                          label="Eventos"
                          leftSection={<IconCalendar size="1rem" stroke={1.5} />}
                        />
                        <NavLink
                          href="#required-for-focus"
                          label="Editar dados do projeto"
                          leftSection={<IconFileDescription size="1rem" stroke={1.5} />}
                        />
                        <Divider />
                      </Box>
                    }
                  </>
                )}
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
              {project.requesting ? ( 
                <Card p={20} h={100} className="mublinModule" withBorder>
                  <Center pt={14}>
                    <Loader />
                  </Center>
                </Card>
              ) : (
                <>
                  {isLargeScreen && 
                    <Box mb={10}>
                      <Title order={2} fw={400}>
                        Visão Geral
                      </Title>
                      <Text>
                        Informações gerais do projeto
                      </Text>
                    </Box>
                  }
                  {/* <Divider mt="md" mb="lg" /> */}
                  <ScrollArea 
                    h={104} 
                    mt={isLargeScreen ? 16 : 10} 
                    mb={11} 
                    type="always" 
                    scrollbars="x" 
                    offsetScrollbars
                  >
                    <Flex gap={14} px={6}>
                      {members.map((member, key) => 
                        <Flex key={key}  gap={5} justify="center" align="center" direction="column">
                          <Avatar
                            size="50px" 
                            name={member.name} 
                            src={member.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-50,w-50,c-maintain_ratio/'+member.picture : undefined} 
                          />
                          <Text size="12px">
                            {member.name}
                          </Text>
                          <Text size="10px" c="dimmed">
                            {member.role1}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </ScrollArea>
                  <Grid>
                    <Grid.Col mb={isLargeScreen ? 16 : 0} span={{ base: 6, md: 3, lg: 3 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Text size="sm" fw="400" c="dimmed" mb={6}> 
                          Tipo do projeto
                        </Text>
                        <Text size="md">
                          {project.typeName}
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col mb={isLargeScreen ? 16 : 0} span={{ base: 6, md: 3, lg: 3 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Flex direction="column">
                          <Text size="sm" fw="400" c="dimmed" mb={6}> 
                            {(project.endDate) && "Período: " + (project.endDate - project.foundationYear) + " anos"}
                            {(!project.endDate) && "Período: " + (currentYear - project.foundationYear) + " anos"}
                          </Text>
                          <Text size="md">
                            Fundado em {project.foundationYear}
                          </Text>
                          {project.endDate && 
                            <Text size="11px" c="dimmed">
                              {project.endDate && "Encerrado em " + project.endDate}
                            </Text>
                          }
                        </Flex>
                      </Card>
                    </Grid.Col>
                    <Grid.Col mb={isLargeScreen ? 16 : 9} span={{ base: 6, md: 3, lg: 3 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Text size="sm" fw="400" c="dimmed" mb={6}> 
                          Conteúdo principal
                        </Text>
                        <Text size="md">
                          {project.kind === 1 && "Autoral"}
                          {project.kind === 2 && "Cover"}
                          {project.kind === 3 && "Autoral e Cover"}
                          {!project.kind && "Não informado"}
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col mb={isLargeScreen ? 16 : 9} span={{ base: 6, md: 3, lg: 3 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Text size="sm" fw="400" c="dimmed" mb={6}> 
                          Em turnê
                        </Text>
                        {project.currentlyOnTour 
                          ? <Text c="lime" size="md">Sim</Text>
                          : <Text size="md">Não</Text>
                        }
                      </Card>
                    </Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Text fw={400} size="lg" mb={14}>
                          Anotações
                        </Text>
                        <Text size="sm">
                          <strong>Tipo de projeto:</strong> {project.typeName}
                        </Text>
                        <Text size="sm">
                          <strong> Ano de fundação:</strong> {project.foundationYear ? project.foundationYear : "Não informado"}
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
                      <Card p={16} className="mublinModule" withBorder>
                        <Text fw={400} size="lg" mb={14}>
                          Próximos eventos
                        </Text>
                        <Center>
                          <DatesProvider 
                            settings={{ 
                              locale: 'pt-br', 
                              firstDayOfWeek: 1, 
                              weekendDays: [0, 6]
                            }}
                          >
                            <Calendar
                              highlightToday
                              static={true}
                              // getDayProps={(date) => ({
                              //   selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
                              //   onClick: () => handleSelect(date),
                              // })}
                            />
                          </DatesProvider>
                        </Center>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </>
              )}
            </Grid.Col>
          </Grid>
        ) : (
          <>
            <Center mt={94}>
              <Image src='https://ik.imagekit.io/mublin/misc/tr:o-35,h-300,e-grayscale/astronaut-musician-3.png' w={200} />
            </Center>
            <Center>
              <Text c="dimmed">Selecione acima um dos seus projetos</Text>
            </Center>
          </>
        )}
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MyProjects;