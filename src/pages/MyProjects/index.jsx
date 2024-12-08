import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { projectInfos } from '../../store/actions/project';
import { Container, Indicator, Grid, Center, Divider, Group, Flex, NavLink, Box, Table, Avatar, Title, Text, Button, Badge, Select, NativeSelect, Card, Image, Loader, em } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { DatesProvider, Calendar } from '@mantine/dates';
import { IconHome, IconFileDescription, IconUsersGroup, IconEye } from '@tabler/icons-react';
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
    dispatch(userProjectsInfos.getUserProjectsBasicInfo(loggedUser.id));
    if (selectedProjectViaUrl) {
      dispatch(projectInfos.getProjectInfo(selectedProjectViaUrl));
      dispatch(projectInfos.getProjectMembers(selectedProjectViaUrl));
    }
  }, [loggedUser.id, dispatch]);

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
    { value: '3', label: 'Alterar dados do projeto' },
    { value: '4', label: 'Ir para o perfil do projeto' }
  ];

  return (
    <>
      <Header pageType="myProjects" />
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
          <option value="">Selecione o projeto</option>
          {projectsList.map((project, key) =>
            <option key={key} value={project.value}>
              {project.label}
            </option>
          )}
        </NativeSelect>
        {selectedProject ? ( 
          <Grid mb={80}>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Card p={0} h={isMobile ? 160 : 600} className="mublinModule" withBorder radius="md">
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
                {isMobile && 
                  <Select
                    size="sm"
                    mx={20}
                    mt={20}
                    mb={4}
                    data={subPages}
                    value={subPage ? subPage.value : null}
                    onChange={(_value, option) => setSubPage(option)}
                  />
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
                      label="Editar dados do projeto"
                      leftSection={<IconFileDescription size="1rem" stroke={1.5} />}
                    />
                    <Divider />
                  </Box>
                }
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
                        Informações gerais sobre o projeto
                      </Text>
                    </Box>
                  }
                  {/* <Divider mt="md" mb="lg" /> */}
                  <Card p={16} mb={16} className="mublinModule" withBorder>
                    <Flex justify="space-between">
                      <Text fw={400} size="lg" mb={14}>
                        Integrantes
                      </Text>
                      <Button size="xs" color="violet" variant="outline">
                        Gerenciar
                      </Button>
                    </Flex>
                    <Table.ScrollContainer minWidth={500} h={150}>
                      <Table 
                        horizontalSpacing={1} 
                        verticalSpacing={4} 
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Nome</Table.Th>
                            <Table.Th>Função</Table.Th>
                            <Table.Th>Status <br/>participação</Table.Th>
                            <Table.Th>Vínculo</Table.Th>
                            <Table.Th>Período</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {members.map((member, key) =>
                            <Table.Tr key={key} c={member.leftIn ? "dimmed" : undefined}>
                              <Table.Td fz="12px">
                                <Group gap={5}>
                                  <Avatar 
                                    size="26px" 
                                    name={member.name} 
                                    src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-26,w-26,c-maintain_ratio/'+member.id+'/'+member.picture} 
                                  />
                                  {member.name+' '+member.lastname}
                                </Group>
                              </Table.Td>
                              <Table.Td fz="12px">
                                {member.role1}{member.role2 && <><br/>{member.role2}</>}{member.role3 && <><br/>{member.role3}</>}
                              </Table.Td>
                              <Table.Td fz="12px">
                                {member.confirmed === 1 && 
                                  <Badge size="xs" variant="light" color="green">Confirmado</Badge>
                                }
                                {member.confirmed === 2 && 
                                  <Badge size="xs" variant="light" color="yellow">Aguardando</Badge>
                                }
                                {member.confirmed === 0 && 
                                  <Badge size="xs" variant="light" color="red">Recusado</Badge>
                                }
                              </Table.Td>
                              <Table.Td fz="12px">
                                {member.statusName}
                              </Table.Td>
                              <Table.Td fz="12px">
                                {!member.leftIn && !project.endDate && 
                                  <>
                                    {`${member.joinedIn} › Atualmente`} {years(member.joinedIn, currentYear)}
                                  </>
                                }
                                {member.leftIn && 
                                  <>
                                    {project.foundationYear} › {member.leftIn} {years(project.foundationYear, member.leftIn)}
                                  </>
                                }
                                {(project.endDate && !member.leftIn) && 
                                  <>
                                    {member.joinedIn} › {project.endDate} {years(member.joinedIn, project.endDate)}
                                  </>
                                }
                              </Table.Td>
                            </Table.Tr>
                          )}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  </Card>
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
                          Calendário
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
                              static={false}
                              getDayProps={(date) => ({
                                selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
                                onClick: () => handleSelect(date),
                              })}
                              renderDay={(date) => {
                                const day = date.getDate();
                                return (
                                  <Indicator size={6} color="red" offset={-2} disabled={day !== 16}>
                                    <div>{day}</div>
                                  </Indicator>
                                );
                              }}
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