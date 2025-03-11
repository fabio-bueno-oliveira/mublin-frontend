import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Box, Flex, Group, Badge, Alert, Title, Table, Spoiler, Text, Image, Skeleton, Avatar, Paper, Anchor, Button, Modal, ScrollArea, em, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconMapPin, IconSettings, IconBrandInstagram, IconBrandSoundcloud, IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react'
import Header from '../../components/header'
import HeaderMobile from '../../components/header/mobile'
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

  const [modalBioOpen, setModalBioOpen] = useState(false)
  
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
    dispatch(projectInfos.getProjectOpportunities(username))
  }, [])

  const members = project.members.filter((member) => { return member.confirmed === 1 })

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{project.requesting ? `Mublin` : `${project.name} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/project/${project.name}`} />
      </Helmet>
      <Box className='showOnlyInLargeScreen'>
        <Header page='project' />
      </Box>
      <Container size='lg'>
        {project.requesting && 
          <Paper
            withBorder={isMobile ? false : true}
            p={14}
            className='mublinModule transparentBgInMobile projectHeader'
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
              px={12}
              py={12}
              mt={isMobile ? 20 : 0}
              className='mublinModule transparentBgInMobile projectHeader'
            >
              <Flex gap={10} justify='flex-start'>
                <Image
                  radius='md'
                  h={80}
                  w='auto'
                  fit='contain'
                  src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture : undefined}
                />
                <Box>
                  <Group gap={6}>
                    <Text size='xs' className='op80' c='white'>
                      {project.typeName}
                    </Text>
                    {project.activityStatusId &&
                      <Badge radius='sm' size='sm' variant='light' color={project.activityStatusColor}>
                        {project.activityStatus}
                      </Badge>
                    }
                  </Group>
                  <Group gap={5}>
                    <Title order={2} fw={650} c='white' className='lhNormal'>
                      {truncateString(project.name, isMobile ? 15 : 120)}
                    </Title>
                    <Avatar.Group spacing={12}>
                      {members.filter(m => !m.leftIn).map(member =>
                        <Avatar
                          size='30'
                          name={member.name}
                          title={`${member.name} ${member.lastname} - ${member.role1}`}
                          src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-100,w-100,c-maintain_ratio/'+member.id+'/'+member.picture} 
                          component='a'
                          href={`/${member.username}`}
                        />
                      )}
                      {/* <Avatar size='30'>+5</Avatar> */}
                    </Avatar.Group>
                  </Group>
                  <Group gap={4} mt={4}>
                    {project.genre1 && <Badge variant='filled' color='dark' radius='sm' size='sm'>{project.genre1 && project.genre1}</Badge>}
                    {project.genre2 && <Badge variant='filled' color='dark' radius='sm' size='sm'>{project.genre2}</Badge>}
                    {project.genre3 && <Badge variant='filled' color='dark' radius='sm' size='sm'>{project.genre3}</Badge>}
                  </Group>
                </Box>
              </Flex>
            </Paper>
            {project.endDate && 
              <Alert mt={14} px={14} py={10} variant='light' color='red'>
                <Text size='xs'>
                  {project.name} encerrou as atividades em {project.endDate}
                </Text>
              </Alert>
            }
            <Button
              size='sm'
              color='primary'
              variant='outline'
              leftSection={<IconSettings size={14} />}
              fullWidth
              mt={14}
              mb={isMobile ? 14 : 0}
            >
              Acessar Painel de Controle
            </Button>
            <Grid mt={16}>
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} order={{ base: 2, sm: 2, lg: 1 }}>
                {project.bio &&
                  <Paper
                    withBorder={isMobile ? false : true}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={10}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Title fz='1.0rem' fw='640' mb={3}>Sobre</Title>
                    {project.country && 
                      <Flex align='center' gap={3} my={2}>
                        <IconMapPin color='gray' size={12} />
                        <Text size='xs' c='gray'>
                          {`${project.region} · ${project.country}`}
                        </Text>
                      </Flex>
                    }
                    <Text 
                      size='sm'
                      onClick={
                        () => project.bio?.length > 140 ? setModalBioOpen(true) : undefined
                      }
                    >
                      {truncateString(project.bio, 140)}
                    </Text>
                  </Paper>
                }
                {(project.instagram || project.soundcloud) &&
                  <Paper
                    withBorder={isMobile ? false : true}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={10}
                    mt={14}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Title fz='1.0rem' fw='640' mb={3}>Links</Title>
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
                        size='sm'
                        pl='4px'
                        pr='7px'
                        radius='sm'
                        variant={(project.kind === 1 || project.kind === 3) ? 'filled' : 'light'} 
                        color={(project.kind === 1 || project.kind === 3) ? 'mublinColor' : 'gray'} 
                      >
                        Autoral
                      </Badge>
                      <Badge 
                        size='sm'
                        pl='4px'
                        pr='7px'
                        radius='sm'
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
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }} order={{ base: 1, sm: 1, lg: 2 }}>
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
                <Paper
                  withBorder={isMobile ? false : true}
                  px={isMobile ? 0 : 16}
                  pt={isMobile ? 0 : 12}
                  mt={isMobile ? 8 : 0}
                  className='mublinModule transparentBgInMobile'
                >
                  <Title fz='1.0rem' fw='640' mb={10}>Oportunidades</Title>
                  {project.opportunities.total === 0 ? (
                    <Text size='sm' c='dimmed' pb={isMobile ? 4 : 14}>
                      Nenhuma oportunidade no momento
                    </Text>
                  ) : (
                    <Table.ScrollContainer minWidth={500}>
                      <Table withRowBorders={false} variant="vertical">
                        <Table.Thead>
                          <Table.Tr fz={12}>
                            <Table.Th p={0} fw={500}>Data Cadastro</Table.Th>
                            <Table.Th p={0} fw={500}>Atividade</Table.Th>
                            <Table.Th p={0} fw={500}>Experiência</Table.Th>
                            <Table.Th p={0} fw={500}>Detalhes</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {project.opportunities.result.map(item => 
                            <Table.Tr key={item.id} fz={12}>
                              <Table.Td p={0} width='20%'>
                                há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                              </Table.Td>
                              <Table.Td p={0} width='15%'>
                                {item.rolename}
                              </Table.Td>
                              <Table.Td p={0} width='20%'>
                                {item.experienceName}
                              </Table.Td>
                              <Table.Td p={0} width='45%'>
                                {item.info}
                              </Table.Td>
                            </Table.Tr>
                          )}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  )}
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} order={{ base: 3, sm: 3, lg: 3 }}>
                <Flex direction='column' gap={10} mb={90}>
                  {members.map(member => 
                    <Paper
                      key={member.id}
                      withBorder={true}
                      px={16}
                      py={11}
                      pb={8}
                      className='mublinModule transparentBgInMobile'
                    >
                      <Group gap={5} align='center' wrap='nowrap'>
                        <Avatar
                          size='50'
                          name={member.name}
                          src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-100,w-100,c-maintain_ratio/'+member.id+'/'+member.picture} 
                          component='a'
                          href={`/${member.username}`}
                        />
                        <Flex direction='column' gap={2}>
                          <Group gap={1}>
                            <Text size='sm' fw={500} style={{lineHeight:'1'}}>
                              {member.name} {member.lastname}
                            </Text>
                            {member.verified &&
                              <IconRosetteDiscountCheckFilled
                                color='#0977ff'
                                style={iconVerifiedStyle}
                                title='Verificado'
                              />
                            }
                            {member.legend &&
                              <IconShieldCheckFilled
                                style={iconLegendStyle}
                                title='Lenda da música'
                              />
                            }
                          </Group>
                          {/* <Text c='dimmed' fz='xs' fw={400} style={{lineHeight:'1'}}>
                            @{member.username}
                          </Text> */}
                          <Badge 
                            variant='outline'
                            mt={2}
                            size='xs'
                            radius='sm'
                            color={member.statusId === 1 ? 'mublinColor' : 'purple'}
                          >
                            {member.statusName}
                          </Badge>
                        </Flex>
                      </Group>
                      <Text className='lhNormal' mt={4}>
                        {member.role1 &&
                          <Text className='comma' span size='sm'>
                            {member.role1}
                          </Text>
                        }
                        {member.role2 &&
                          <Text className='comma' span size='sm'>
                            {member.role2}
                          </Text>
                        }
                        {member.role3 &&
                          <Text className='comma' span size='sm'>
                            {member.role3}
                          </Text>
                        }
                      </Text>
                      <Badge size='xs' radius='xs' color={member.leftIn ? 'gray' : 'mublinColor'} variant='light'>
                        {`${member.joinedIn} ➜ `}
                        {project.endDate
                          ? (!member.leftIn) ? project.endDate : member.leftIn
                          : (member.leftIn) ? member.leftIn : 'Atualmente'
                        }
                      </Badge>
                    </Paper>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          </>
        }
      </Container>
      <FooterMenuMobile />
      <Modal 
        centered
        opened={modalBioOpen}
        title={`Sobre ${project.name}`}
        onClose={() => setModalBioOpen(false)} 
        size='md'
        withCloseButton
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Text size='sm'>
          {project.bio}
        </Text>
      </Modal>
    </>
  )
}

export default ProjectPage