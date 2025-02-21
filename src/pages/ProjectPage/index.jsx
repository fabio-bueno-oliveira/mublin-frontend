import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Box, Flex, Group, Badge, Alert, Title, Table, Spoiler, Text, Image, Skeleton, Avatar, Paper, Anchor, Divider, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconMapPin, IconMusic, IconSettings, IconBrandInstagram, IconCheck, IconX, IconBrandSoundcloud } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { truncateString } from '../../utils/formatter'
import { Helmet } from 'react-helmet'
import { formatDistance } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
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
  }, [])

  const members = project.members.filter((member) => { return member.confirmed === 1 })

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{project.requesting ? `Mublin` : `${project.name} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/project/${project.name}`} />
      </Helmet>
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
              Painel de Controle do Projeto
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
                align='flex-start'
                wrap='nowrap'
                direction={{ base: 'column', sm: 'row' }}
                gap={{ base: 12, sm: 0 }}
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
                      <Badge variant='light' color='gray' radius='sm' size='sm'>
                        {project.typeName}
                      </Badge>
                      {project.country && 
                        <Flex align='center' gap={3}>
                          <IconMapPin color='gray' size={12} />
                          <Text size='sm' c='gray'>
                            {`${project.region} · ${project.country}`}
                          </Text>
                        </Flex>
                      }
                    </Group>
                    <Title order={2} fw={650} className='lhNormal'>
                      {truncateString(project.name, isMobile ? 15 : 100)}
                    </Title>
                    <Group gap={4} mt={3}>
                      {project.genre1 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre1 && project.genre1}</Badge>}
                      {project.genre2 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre2}</Badge>}
                      {project.genre3 && <Badge variant='filled' color='mublinColor' radius='sm' size='sm'>{project.genre3}</Badge>}
                    </Group>
                  </Box>
                </Group>
                {project.activityStatusId &&
                  <Badge size='md' variant='dot' color={project.activityStatusColor}>
                    {project.activityStatus}
                  </Badge>
                }
              </Flex>
            </Paper>
            {project.endDate && 
              <Alert mt={14} px={14} py={10} variant='light' color='red'>
                <Text size='xs'>
                  {project.name} encerrou as atividades em {project.endDate}
                </Text>
              </Alert>
            }
            <Grid mt={14}>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                {project.spotifyId &&
                  <iframe
                    style={{borderRadius:'12px'}}
                    src={`https://open.spotify.com/embed/artist/${project.spotifyId}?utm_source=generator&theme=0`}
                    width='100%'
                    height='152'
                    frameBorder='0'
                    allowFullScreen={false}
                    allow='autoplay; clipboard-write; encrypted-media; fullscreen;picture-in-picture'
                    loading='lazy'
                  />
                }
                {(project.bio || project.instagram || project.soundcloud) &&
                  <Paper
                    withBorder={isMobile ? false : true}
                    mt={project.spotifyId ? 14 : 0}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={10}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Title fz='1.0rem' fw='640' mb={3}>Sobre</Title>
                    {(project.instagram || project.soundcloud) &&
                      <Group gap={6} mt={6}>
                        {project.instagram &&
                          <Anchor 
                            href={`https://instagram.com/${project.instagram}`}
                            target='_blank'
                            underline='hover'
                            className='websiteLink'
                            mb={4}
                          >
                            <Flex gap={2} align='center'>
                              <IconBrandInstagram size={13} />
                              <Text size='0.83em' className='lhNormal'>
                                Instagram
                              </Text>
                            </Flex>
                          </Anchor>
                        }
                        {project.soundcloud &&
                          <Anchor 
                            href={`https://soundcloud.com/${project.soundcloud}?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing`}
                            target='_blank'
                            underline='hover'
                            className='websiteLink'
                            mb={4}
                          >
                            <Flex gap={2} align='center'>
                              <IconBrandSoundcloud size={13} />
                              <Text size='0.83em' className='lhNormal'>
                                Soundcloud
                              </Text>
                            </Flex>
                          </Anchor>
                        }
                      </Group>
                    }
                    <Spoiler maxHeight={80} showLabel={<Text size='sm' fw={600}>...mais</Text>} hideLabel={<Text size='sm' fw={600}>mostrar menos</Text>}>
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
                  <Title fz='1.0rem' fw='640' mb={6}>Foco Principal</Title>
                  <Text size='sm' c='dimmed'>
                    <Flex gap={4} mx={0} pt={1} wrap='wrap'>
                      <Badge 
                        size='md'
                        pl='4px'
                        pr='7px'
                        leftSection={(project.kind === 1 || project.kind === 3) ? <IconCheck size={12} /> : <IconX size={12} />} 
                        variant={(project.kind === 1 || project.kind === 3) ? 'filled' : 'light'} 
                        color={(project.kind === 1 || project.kind === 3) ? 'mublinColor' : 'gray'} 
                      >
                        Autoral
                      </Badge>
                      <Badge 
                        size='md'
                        pl='4px'
                        pr='7px'
                        leftSection={(project.kind === 2 || project.kind === 3) ? <IconCheck size={12} /> : <IconX size={12} />} 
                        variant={(project.kind === 2 || project.kind === 3) ? 'filled' : 'light'} 
                        color={(project.kind === 2 || project.kind === 3) ? 'mublinColor' : 'gray'} 
                      >
                        Cover
                      </Badge>
                    </Flex>
                  </Text>
                </Paper>
                {project.purpose &&
                  <Paper
                    withBorder={isMobile ? false : true}
                    mt={project.spotifyId ? 14 : 0}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={10}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Title fz='1.0rem' fw='640' mb={3}>Propósito do projeto</Title>
                    <Spoiler maxHeight={120} showLabel={<Text size='sm' fw={600}>...mais</Text>} hideLabel={<Text size='sm' fw={600}>mostrar menos</Text>}>
                      <Text size='sm' c={!project.purpose ? 'dimmed' : undefined}>
                        {project.purpose}
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
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={10}>Oportunidades</Title>
                  {project.opportunities.total === 0 ? (
                    <Text size='sm' c='dimmed' pb={14}>
                      Nenhuma oportunidade no momento
                    </Text>
                  ) : (
                    <Table.ScrollContainer minWidth={500}>
                      <Table withRowBorders={false} variant="vertical">
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th fw={500}>Data Cadastro</Table.Th>
                            <Table.Th fw={500}>Atividade</Table.Th>
                            <Table.Th fw={500}>Experiência</Table.Th>
                            <Table.Th fw={500}>Detalhes</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {project.opportunities.result.map(item => 
                            <Table.Tr key={item.id}>
                              <Table.Td width='20%' fz={13}>
                                há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                              </Table.Td>
                              <Table.Td width='15%' fz={13}>
                                {item.rolename}
                              </Table.Td>
                              <Table.Td width='25%' fz={13}>
                                {item.experienceName}
                              </Table.Td>
                              <Table.Td width='40%' fz={12}>
                                {item.info}
                              </Table.Td>
                            </Table.Tr>
                          )}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  )}
                </Paper>
                <Paper
                  withBorder={isMobile ? false : true}
                  px={isMobile ? 0 : 16}
                  pt={isMobile ? 0 : 12}
                  mt={14}
                  mb={80}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={10}>Integrantes e Equipe</Title>
                  <Table.ScrollContainer minWidth={500}>
                    <Table withRowBorders={false} variant="vertical">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th fw={500}>Nome</Table.Th>
                          <Table.Th fw={500}>Atividade</Table.Th>
                          <Table.Th fw={500} ta='center'>Vínculo</Table.Th>
                          <Table.Th fw={500} ta='center'>Período</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {members.map(member => 
                          <Table.Tr key={member.id}>
                            <Table.Td width='35%'>
                              <Group gap={4} align='center' wrap='nowrap'>
                                <Avatar
                                  size='30'
                                  name={member.name}
                                  src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-60,w-60,c-maintain_ratio/'+member.id+'/'+member.picture} 
                                  component='a'
                                  href={`/${member.username}`}
                                />
                                <Flex direction='column' gap={2}>
                                  <Text fz={13} fw={600} style={{lineHeight:'1'}}>{member.name} {member.lastname}</Text>
                                  <Text fz={11} fw={400} style={{lineHeight:'1'}}>{member.username}</Text>
                                </Flex>
                              </Group>
                            </Table.Td>
                            <Table.Td width='25%' fz={13}>
                              {member.role1 &&
                                <Badge variant="default" color="primary" size="xs" mb={2} mr={2}>{member.role1}</Badge>
                              }
                              {member.role2 &&
                                <Badge variant="default" color="primary" size="xs" mb={2} mr={2}>{member.role2}</Badge>
                              }
                              {member.role3 &&
                                <Badge variant="default" color="primary" size="xs" mb={2} mr={2}>{member.role3}</Badge>
                              }
                            </Table.Td>
                            <Table.Td width='25%' fz={13} ta='center'>
                              <Badge variant="light" size="xs" color={member.statusId === 1 ? 'blue' : 'purple'}>
                                {member.statusName}
                              </Badge>
                            </Table.Td>
                            <Table.Td width='15%' fz={12} ta='center'>
                              {`${member.joinedIn} ➜ `}
                              {project.endDate
                                ? (!member.leftIn) ? project.endDate : member.leftIn
                                : (member.leftIn) ? member.leftIn : 'Atualmente'
                              }
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