import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Box, Flex, Group, Badge, Title, Table, Button, Text, Image, Skeleton, Avatar, Paper, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconMapPin, IconMusic, IconSettings } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import './styles.scss'

function ProjectPage () {

  const params = useParams()
  const username = params?.username
  const project = useSelector(state => state.project)

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
    dispatch(projectInfos.getProjectOpportunities(username))
  }, []);

  document.title = project.name+' | Mublin';

  const members = project.members.filter((member) => { return member.confirmed === 1 });

  return (
    <>
      <Header />
      <Container size={'lg'}>
        <Group mt={14} mb={10}>
          <Flex gap={4} align='center'>
            <IconMusic size={16} />
            <Title fw={500} order={6} style={{cursor:'default'}}>
              Página do Projeto
            </Title>
          </Flex>
          <Flex gap={4} align='center' opacity='0.3'>
            <IconSettings size={16} />
            <Title fw={450} order={6} style={{cursor:'not-allowed'}}>
              Painel de Controle
            </Title>
          </Flex>
        </Group>
        {project.requesting && 
          <Paper
            withBorder={isMobile ? false : true}
            p={14}
            className='mublinModule transparentBgInMobile'
          >
            <Flex
              justify="flex-start"
              align="center"
              direction="row"
              wrap="nowrap"
              columnGap="xs"
              mt={6}
            >
              <Skeleton radius="md" width={80} height={80} />
              <Box>
                <Skeleton height={21} width={180} mb={8} />
                <Skeleton height={17} width={180} mb={8} />
                <Skeleton height={12} width={180} />
              </Box>
            </Flex>
          </Paper>
        }
        {!project.requesting && 
          <>
            <Paper
              withBorder={isMobile ? false : true}
              p={14}
              className='mublinModule transparentBgInMobile'
            >
              <Flex
                justify='space-between'
                align='top'
                direction='row'
                wrap='nowrap'
              >
                <Group>
                  <Image
                    radius='md'
                    h={80}
                    w='auto'
                    fit='contain'
                    src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture : undefined}
                  />
                  <Box>
                    <Group gap={4}>
                      <Badge variant='light' color='gray' radius='sm' size='xs'>
                        {project.typeName}
                      </Badge>
                      {project.country && 
                        <Flex align='center' gap={3}>
                          <IconMapPin color='gray' size={12} />
                          <Text size='xs' c='gray'>
                            {`${project.region} · ${project.country}`}
                          </Text>
                        </Flex>
                      }
                    </Group>
                    <Title order={2} fw={550} className='lhNormal'>
                      {project.name}
                    </Title>
                    <Group gap={4} mt={3}>
                      {project.genre1 && <Badge variant='filled' color='mublinColor' radius='sm' size='xs'>{project.genre1 && project.genre1}</Badge>}
                      {project.genre2 && <Badge variant='filled' color='mublinColor' radius='sm' size='xs'>{project.genre2}</Badge>}
                      {project.genre3 && <Badge variant='filled' color='mublinColor' radius='sm' size='xs'>{project.genre3}</Badge>}
                    </Group>
                  </Box>
                </Group>
              </Flex>
            </Paper>
            <Grid mt={14}>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Paper
                  withBorder={isMobile ? false : true}
                  p={14}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={6}>Sobre</Title>
                  <Text size='sm' c={!project.bio ? 'dimmed' : undefined}>
                    {project.bio ? project.bio : 'Nenhuma bio informada para este projeto'}
                  </Text>
                </Paper>
                <Paper
                  withBorder={isMobile ? false : true}
                  p={14}
                  mt={14}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={6}>Eventos</Title>
                  <Text size='sm' c={!project.bio ? 'dimmed' : undefined}>
                    {project.bio ? project.bio : 'Nenhuma bio informada para este projeto'}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                <Paper
                  withBorder={isMobile ? false : true}
                  p={14}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={6}>Integrantes e Equipe</Title>
                  <Table striped highlightOnHover withRowBorders={true}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th fw={500}>Nome</Table.Th>
                        <Table.Th fw={500}>Atividade</Table.Th>
                        <Table.Th fw={500}>Vínculo</Table.Th>
                        <Table.Th fw={500}>Desde</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {members.map(member => 
                        <Table.Tr key={member.id}>
                          <Table.Td>
                            <Group gap={4}>
                              <Avatar size="md" name={member.name} src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/'+member.id+'/'+member.picture} />
                              <Flex direction='column' gap={2}>
                                <Text fz={13}>{member.name}</Text>
                                <Group gap={2}>
                                  {member.role1 && 
                                    <Badge color='mublinColor' radius='sm' size='xs'>{member.role1}</Badge>
                                  }
                                  {member.role2 && 
                                    <Badge color='purple' radius='sm' size='xs'>{member.role2}</Badge>
                                  }
                                </Group>
                              </Flex>
                            </Group>
                          </Table.Td>
                          <Table.Td fz={13}>{member.role1}</Table.Td>
                          <Table.Td fz={13}>{member.statusName}</Table.Td>
                          <Table.Td fz={13}>{member.joinedIn}</Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Paper>
              </Grid.Col>
            </Grid>
          </>
        }
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default ProjectPage