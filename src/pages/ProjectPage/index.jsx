import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Box, Flex, Group, Badge, Title, Table, Spoiler, Text, Image, Skeleton, Avatar, Paper, em, Divider } from '@mantine/core'
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
      {!isMobile && 
        <Header />
      }
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
        <Divider mb={14} className='showOnlyInMobile' />
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
              px={isMobile ? 0 : 16}
              py={isMobile ? 0 : 12}
              className='mublinModule transparentBgInMobile'
            >
              <Flex
                justify='space-between'
                align='center'
                direction='row'
                wrap='nowrap'
              >
                <Group style={{flexGrow:'1'}}>
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
                    <Title order={2} fw={650} className='lhNormal'>
                      {project.name}
                    </Title>
                    <Group gap={4} mt={3}>
                      {project.genre1 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre1 && project.genre1}</Badge>}
                      {project.genre2 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre2}</Badge>}
                      {project.genre3 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre3}</Badge>}
                    </Group>
                  </Box>
                </Group>
                {/* <Box>
                  <Text>Texto</Text>
                </Box> */}
              </Flex>
            </Paper>
            <Grid mt={14}>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                {project.spotifyId && 
                  <iframe 
                    style={{borderRadius:'12px'}} 
                    src={`https://open.spotify.com/embed/artist/${project.spotifyId}?utm_source=generator&theme=0`} 
                    width='100%' 
                    height='152' 
                    frameBorder='0' 
                    allowfullscreen='' 
                    allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' 
                    loading='lazy'
                  />
                }
                {project.bio &&
                  <Paper
                    withBorder={isMobile ? false : true}
                    mt={project.spotifyId ? 14 : 0}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={10}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Title fz='1.0rem' fw='640' mb={6}>Sobre</Title>
                    {/* {project.foundationYear &&
                      <Text size='xs' c='dimmed' mb={3}>
                        {project.foundationYear} ➜ {project.endDate ? project.endDate : 'Atualmente'}
                      </Text>
                    } */}
                    <Spoiler maxHeight={120} showLabel={<Text size='sm' fw={600}>...mais</Text>} hideLabel={<Text size='sm' fw={600}>mostrar menos</Text>}>
                      <Text size='sm' c={!project.bio ? 'dimmed' : undefined}>
                        {project.bio}
                      </Text>
                    </Spoiler>
                  </Paper>
                }
                <Paper
                  withBorder={isMobile ? false : true}
                  mt={14}
                  px={isMobile ? 0 : 16}
                  py={isMobile ? 0 : 12}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={6}>Eventos</Title>
                  <Text size='sm' c='dimmed'>
                    Nenhum evento próximo
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                <Paper
                  withBorder={isMobile ? false : true}
                  px={isMobile ? 0 : 16}
                  pt={isMobile ? 0 : 12}
                  mb={80}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={10}>Integrantes e Equipe</Title>
                  <Table.ScrollContainer minWidth={500}>
                    <Table highlightOnHover withRowBorders={false} variant="vertical">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th fw={500}>Nome</Table.Th>
                          <Table.Th fw={500}>Atividade</Table.Th>
                          <Table.Th fw={500}>Vínculo</Table.Th>
                          <Table.Th fw={500} ta='center'>Desde</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {members.map(member => 
                          <Table.Tr key={member.id}>
                            <Table.Td width='35%'>
                              <Group gap={4} wrap='nowrap'>
                                <Avatar size="md" name={member.name} src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/'+member.id+'/'+member.picture} />
                                <Flex direction='column' gap={2}>
                                  <Text fz={13}>{member.name} {member.lastname}</Text>
                                  {/* <Group gap={2}>
                                    {member.role1 && 
                                      <Badge variant='light' color='mublinColor' radius='sm' size='xs'>{member.role1}</Badge>
                                    }
                                    {member.role2 && 
                                      <Badge variant='light' color='mublinColor' radius='sm' size='xs'>{member.role2}</Badge>
                                    }
                                    {member.role3 && 
                                      <Badge variant='light' color='mublinColor' radius='sm' size='xs'>{member.role3}</Badge>
                                    }
                                  </Group> */}
                                </Flex>
                              </Group>
                            </Table.Td>
                            <Table.Td width='25%' fz={13}>
                              {/* {member.role1} */}
                              {member.role1 && 
                                <Badge color='mublinColor' radius='sm' size='sm'>{member.role1}</Badge>
                              }
                              {member.role2 && 
                                <Badge color='mublinColor' radius='sm' size='sm'>{member.role2}</Badge>
                              }
                              {member.role3 && 
                                <Badge color='mublinColor' radius='sm' size='sm'>{member.role3}</Badge>
                              }
                            </Table.Td>
                            <Table.Td width='20%' fz={13}>
                              <Badge radius='sm' size='sm' variant='light' color={member.statusId === 1 ? 'green' : 'blue'}>
                                {member.statusName}
                              </Badge>
                            </Table.Td>
                            <Table.Td width='20%' fz={13} ta='center'>
                              {member.joinedIn}
                            </Table.Td>
                          </Table.Tr>
                        )}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
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