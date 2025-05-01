import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { miscInfos } from '../../store/actions/misc'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Card, Box, Flex, Group, Badge, Alert, Title, Spoiler, Text, Image, Skeleton, Avatar, Anchor, Button, Indicator, ScrollArea, Tabs, em, rem, Drawer, Divider, Center, Radio, NativeSelect, NumberInput, Checkbox } from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'
import { useMediaQuery, useScrollIntoView } from '@mantine/hooks'
import { IconSettings, IconBrandInstagram, IconBrandSoundcloud, IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconMusic, IconMail, IconPhone, IconLockSquareRounded, IconClock, IconUserUp, IconIdBadge2 } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { truncateString } from '../../utils/formatter'
import { formatDistance } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import ProjectAdminEditInfos from './editInfos'
import ProjectDashboardAdminTeamPage from './members'
import './styles.scss'

function ProjectPage () {

  const token = localStorage.getItem('token')
  const params = useParams()
  const username = params?.username
  const project = useSelector(state => state.project)
  const user = useSelector(state => state.user)
  const roles = useSelector(state => state.roles)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
    dispatch(projectInfos.getProjectOpportunities(username))
    dispatch(projectInfos.getProjectAdminAccessInfo(username))
    dispatch(miscInfos.getRoles())
  }, [])

  const members = project.members.filter((member) => { return member.confirmed === 1 && !member.leftIn })
  const pastMembers = project.members.filter((member) => { return member.confirmed === 1 && member.leftIn })
  const adminMembers = project.members.filter((member) => { return member.admin === 1 })

  const userHasSomeParticipation = project.members.some(member => member.id === user.id)

  const userHasRequestedParticipation = project.members.some(member => member.id === user.id && member.confirmed === 2)

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  const [activeTab, setActiveTab] = useState('about')

  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 60,
  });

  const cancelMyParticipationRequest = () => {
    fetch(`https://mublin.herokuapp.com/project/${project.id}/removeParticipationRequest`, {
      method: 'DELETE',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        dispatch(projectInfos.getProjectMembers(username))
      }).catch(err => {
        console.error(err)
      })
  }

  const rolesListMusicians = roles?.list
    .filter(e => e.instrumentalist && e.appliesToProject)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
    }))
  const rolesListManagement = roles?.list
    .filter(e => !e.instrumentalist && e.appliesToProject)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
    }))

  // Request participation/association
  const [modalParticipationOpen, setModalParticipationOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    mode: 'controlled',
    initialValues: { 
      status: '',
      mainRole: '',
      joinedIn: '',
      leftIn: '',
      active: '',
      featured: false,
    },
    validate: {
      status: isNotEmpty('Informe o seu vínculo no projeto'),
      mainRole: isNotEmpty('Informe sua principal função'),
      joinedIn: isNotEmpty('Informe sua data de entrada')
    }
  })

  useEffect(() => {
    if (project.success && project.name) {
      form.setInitialValues({ 
        joinedIn: project.foundationYear,
        leftIn: project.endDate,
        active: project.endDate ? 0 : 1
      })
      form.setValues({ 
        joinedIn: project.foundationYear,
        leftIn: project.endDate,
        active: project.endDate ? 0 : 1
      })
    }
  }, [project.success])

  const handleSubmitParticipation = (values) => {
    setIsSubmitting(true)
    fetch('https://mublin.herokuapp.com/user/add/project', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ userId: user.id, projectId: project.id, active: values.active, status: values.status, main_role_fk: Number(values.mainRole), joined_in: values.joinedIn, left_in: values.leftIn ? Number(values.leftIn) : '', leader: '0', featured: values.featured, confirmed: adminMembers.length > 0 ? '2' : '1', admin: adminMembers.length > 0 ? '0' : '1', portfolio: '0' })
    }).then((response) => {
      dispatch(projectInfos.getProjectInfo(username))
      dispatch(projectInfos.getProjectMembers(username))
      setIsSubmitting(false)
      setModalParticipationOpen(false)
    }).catch(err => {
      console.error(err)
      setIsSubmitting(false)
      alert("Ocorreu um erro ao solicitar associação a este projeto. Tente novamente em alguns minutos.")
    })
  }

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{project.requesting ? `Mublin` : `${project.name} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/project/${project.name}`} />
      </Helmet>
      <Box className='showOnlyInLargeScreen'>
        <Header page='project' reloadUserInfo />
      </Box>
      <Container size='lg' px={isMobile ? 0 : undefined}>
        {!project.requesting && 
          <>
            <Grid mb={100} mt={0} gutter={isMobile ? 0 : undefined}>
              <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
                {project.requesting ? (
                  <Card
                    padding='lg'
                    radius='md'
                    withBorder
                    mb={14}
                    className='mublinModule'
                  >
                    <Skeleton height={120} width='100%' radius='lg' />
                    <Skeleton height={34} mt={10} width='55%' radius='lg' />
                    <Skeleton height={16} mt={10} width='70%' radius='lg' />
                  </Card>
                ) : (
                  <Card 
                    padding='lg' 
                    style={{paddingBottom:'0px'}} 
                    radius={isMobile ? false : 'md'}
                    mb={14}
                    withBorder={isMobile ? false : true}
                    px={isMobile ? 0 : 16}
                    pt={isMobile ? 0 : 12}
                    pb={isMobile ? 3 : 0}
                    className='mublinModule transparentBgInMobile'
                  >
                    <Card.Section>
                      <Image
                        src={project.cover_image ? 'https://ik.imagekit.io/mublin/projects/'+project.cover_image : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'}
                        height={120}
                        alt={`Imagem de capa de ${project.picture}`}
                      />
                    </Card.Section>
                    <Flex gap={10} align='end' style={{marginTop:'-64px'}}>
                      <Image
                        radius={false}
                        h={120}
                        ml={isMobile ? 14 : 0}
                        w='auto'
                        fit='contain'
                        src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
                        style={{border:'3px solid white'}}
                      />
                      {!!project.loggedUserIsAdmin && 
                        <Button
                          size='xs'
                          hiddenFrom='sm'
                          mb={2}
                          variant='filled'
                          color='primary'
                          onClick={() => {
                            setActiveTab('dashboard');
                            scrollIntoView({alignment: 'start'})
                          }}
                          leftSection={<IconSettings size={12} />}
                        >
                          Painel de Controle
                        </Button>
                      }
                      {!!userHasRequestedParticipation && 
                        <Button
                          size='xs'
                          mb={2}
                          variant='light'
                          color='mublinColor'
                          onClick={() => cancelMyParticipationRequest()}
                          leftSection={<IconClock size={16} />}
                        >
                          Cancelar solicitação
                        </Button>
                      }
                      {!userHasSomeParticipation && 
                        <Button
                          size='xs'
                          mb={2}
                          color='mublinColor'
                          onClick={() => setModalParticipationOpen(true)}
                          leftSection={<IconUserUp size={16} />}
                        >
                          Solicitar associação
                        </Button>
                      }
                    </Flex>
                    <Box ml={isMobile ? 18 : 0}>
                      <Group gap={0} justify='space-between' mt='sm'>
                        <Title order={1} fz='1.5rem' fw={650} className='lhNormal op90'>
                          {truncateString(project.name, isMobile ? 15 : 120)}
                        </Title>
                      </Group>
                      {project.genre1 && 
                        <Group gap={3}>
                          <IconMusic size={13} />
                          <Text size='md'>
                            <Text className='comma' span>
                              {project.genre1}
                            </Text>
                            {project.genre2 &&
                              <Text className='comma' span>
                                {project.genre2}
                              </Text>
                            }
                            {project.genre3 &&
                              <Text className='comma' span>
                                {project.genre3}
                              </Text>
                            }
                          </Text>
                        </Group>
                      }
                      {project.activityStatusId &&
                        <Flex
                          align='center'
                          justify='flex-start'
                          gap={6}
                          mb={isMobile ? 0 : 4}
                        >
                          <Indicator
                            inline
                            processing={project.activityStatusId === 1 || project.activityStatusId === 3}
                            color={project.activityStatusColor}
                            size={7}
                            ml={5}
                            mr={4}
                          />
                          <Text
                            size='sm'
                            className='lhNormal'
                            pt='1px'
                          >
                            {project.activityStatus}
                          </Text>
                        </Flex>
                      }
                      <Text size='sm' c='dimmed' mb={2}>
                        {project.typeName} {project.region && `· ${project.region} · ${project.country}`}
                      </Text>
                      {project.instagram &&
                        <Button 
                          size='xs' 
                          variant='light'
                          color='pink' 
                          mt={6} 
                          mb={2} 
                          leftSection={<IconBrandInstagram size={18} stroke={1.6} />}
                          component='a'
                          href={`https://instagram.com/${project.instagram}`}
                          target='_blank'
                        >
                          Instagram
                        </Button>
                      }
                      {project.soundcloud &&
                        <Button 
                          size='xs' 
                          variant='light'
                          color='orange' 
                          mt={6}
                          mb={2}
                          ml={4}
                          leftSection={<IconBrandSoundcloud size={18} stroke={1.6} />}
                          component='a'
                          href={`https://soundcloud.com/${project.soundcloud}`}
                          target='_blank'
                        >
                          Soundcloud
                        </Button>
                      }
                      <Avatar.Group spacing={8} mt={8} mb={6}>
                        {members.filter(m => !m.leftIn).map(member =>
                          <Avatar
                            key={member.id}
                            size='40'
                            name={member.name}
                            title={`${member.name} ${member.lastname} - ${member.role1}`}
                            src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-80,w-80,c-maintain_ratio/'+member.picture} 
                            component='a'
                            href={`/${member.username}`}
                          />
                        )}
                        {/* <Avatar size='30'>+5</Avatar> */}
                      </Avatar.Group>
                      {project.endDate && 
                        <Alert mt={10} px={10} py={8} variant='light' color='primary'>
                          <Text size='xs'>
                            {project.name} encerrou as atividades em {project.endDate}
                          </Text>
                        </Alert>
                      }
                    </Box>
                    <Tabs 
                      mt={10} 
                      value={activeTab} 
                      onChange={setActiveTab} 
                      defaultValue='about'
                      color='mublinColor'
                      className='showOnlyInLargeScreen'
                    >
                      <Tabs.List>
                        <Tabs.Tab value='about'>
                          Geral
                        </Tabs.Tab>
                        {project.spotifyId &&
                          <Tabs.Tab value='music'>
                            Músicas
                          </Tabs.Tab>
                        }
                        {/* <Tabs.Tab value='pictures'>
                          Pessoas
                        </Tabs.Tab> */}
                        <Tabs.Tab value='opportunities'>
                          Oportunidades ({project.opportunities.total})
                        </Tabs.Tab>
                        {/* <Tabs.Tab value='events'>
                          Eventos
                        </Tabs.Tab> */}
                        {/* <Tabs.Tab value='videos'>
                          Videos
                        </Tabs.Tab> */}
                        {/* <Tabs.Tab value='pictures'>
                          Fotos
                        </Tabs.Tab> */}
                        {!!(project.loggedUserIsActive && project.loggedUserIsAdmin) &&
                          <Tabs.Tab 
                            value='dashboard'
                          >
                            Painel de Controle
                          </Tabs.Tab>
                        }
                      </Tabs.List>
                    </Tabs>
                    <ScrollArea w='100%' h={38} type='never' className='showOnlyInMobile'>
                      <Box className='fitContent' ref={targetRef}>
                        <Tabs
                          value={activeTab}
                          onChange={setActiveTab}
                          defaultValue='about'
                          color='mublinColor'
                        >
                          <Flex gap={0}>
                            <Tabs.Tab value='about'>
                              Geral
                            </Tabs.Tab>
                            <Tabs.Tab value='people'>
                              Pessoas
                            </Tabs.Tab>
                            {project.spotifyId &&
                              <Tabs.Tab value='music'>
                                Músicas
                              </Tabs.Tab>
                            }
                            <Tabs.Tab value='opportunities'>
                              Oportunidades ({project.opportunities.total})
                            </Tabs.Tab>
                            {/* <Tabs.Tab value='events'>
                              Eventos
                            </Tabs.Tab> */}
                            {/* <Tabs.Tab value='videos'>
                              Videos
                            </Tabs.Tab> */}
                            {/* <Tabs.Tab value='pictures'>
                              Fotos
                            </Tabs.Tab> */}
                            {(project.loggedUserIsActive && project.loggedUserIsAdmin) &&
                              <Tabs.Tab
                                value='dashboard'
                                leftSection={<IconSettings size={12} />}
                              >
                                Painel de Controle
                              </Tabs.Tab>
                            }
                          </Flex>
                        </Tabs>
                      </Box>
                    </ScrollArea>
                  </Card>
                )}
                {activeTab === 'about' &&
                  <>
                    <Card padding='lg' radius='md' withBorder className='mublinModule'>
                      <Group justify='space-between' align='center'>
                        <Title fz='1.1rem' fw='580' mb={6}>Sobre</Title>
                        <Flex align='center' gap={4} mx={0} wrap='wrap'>
                          <Text size='xs'>Foco Principal:</Text>
                          <Badge 
                            size='sm'
                            px='6px'
                            radius='sm'
                            variant={(project.kind === 1 || project.kind === 3) ? 'filled' : 'light'} 
                            color={(project.kind === 1 || project.kind === 3) ? 'lime' : 'gray'} 
                          >
                            Autoral
                          </Badge>
                          <Badge 
                            size='sm'
                            px='6px'
                            radius='sm'
                            variant={(project.kind === 2 || project.kind === 3) ? 'filled' : 'light'} 
                            color={(project.kind === 2 || project.kind === 3) ? 'lime' : 'gray'} 
                          >
                            Cover
                          </Badge>
                        </Flex>
                      </Group>
                      <Text 
                        size='sm'
                        c={project.bio ? undefined : 'dimmed'}
                        mt={8}
                      >
                        {project.bio ? project.bio : 'Bio não informada'}
                      </Text>
                      <Box mt={30} mb={10}>
                        <Title fz='0.9rem' fw='550' mb={3}>Contato</Title>
                        <Group gap={3} align='center' mt={8}>
                          <IconMail size={14} color='gray' />
                          <Text 
                            size='sm'
                            c={project.email ? undefined : 'dimmed'}
                          >
                            {project.email ? project.email : 'Email não informado'}
                          </Text>
                        </Group>
                        <Group gap={3} align='center' mt={6}>
                          <IconPhone size={14} color='gray' />
                          <Text 
                            size='sm'
                            c={project.phone ? undefined : 'dimmed'}
                          >
                            {project.phone ? project.phone : 'Telefone não informado'}
                          </Text>
                        </Group>
                      </Box>
                      {(project.instagram || project.soundcloud) && 
                        <Box my={10}>
                          <Title fz='0.9rem' fw='550' mb={3}>Links</Title>
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
                        </Box>
                      }
                      <Box my={10}>
                        <Title fz='0.9rem' fw='550' mb={3}>Propósito do projeto</Title>
                        <Spoiler maxHeight={120} showLabel={<Text size='sm' fw={600}>...mais</Text>} hideLabel={<Text size='sm' fw={600}>mostrar menos</Text>}>
                          <Text size='sm' c={!project.purpose ? 'dimmed' : undefined}>
                            {project.purpose ? project.purpose : 'Não informado'}
                          </Text>
                        </Spoiler>
                      </Box>
                    </Card>
                  </>
                }
                {activeTab === 'music' &&
                  <Box px={isMobile ? 10 : 0}>
                    <iframe 
                      style={{borderRadius:'15px'}} 
                      src={`https://open.spotify.com/embed/artist/${project.spotifyId}?utm_source=generator&theme=0`} 
                      width='100%' 
                      height='352' 
                      frameBorder='0' 
                      allowFullScreen='' 
                      allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' 
                      loading='lazy'
                    ></iframe>
                  </Box>
                }
                {activeTab === 'opportunities' &&
                  <Card padding='lg' radius='md' withBorder className='mublinModule'>
                    <Title fz='1.0rem' fw='640' className='lhNormal'>
                      Oportunidades em {project.name}
                    </Title>
                    <Text size='sm' mb={18}>
                      Vagas em aberto para participar de gigs com este projeto
                    </Text>
                    {project.opportunities.total === 0 ? (
                      <Text size='sm' c='dimmed'>
                        Nenhuma oportunidade no momento
                      </Text>
                    ) : (
                      <Flex direction='column' gap={8}>
                        {project.opportunities.result.map(item => 
                          <Card 
                            key={item.id} 
                            radius='md' 
                            withBorder 
                            p='xs' 
                            bg='transparent'
                            component='a'
                            href={`/job?id=${item.id}`}
                          >
                            <Flex gap={6}>
                              <Image
                                radius='md'
                                h={50}
                                w='auto'
                                fit='contain'
                                src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-100,w-100,c-maintain_ratio/'+project.picture : undefined}
                                style={{border:'3px solid white'}}
                              />
                              <Flex direction='column'>
                                <Title 
                                  order={4} 
                                  fz='1rem' 
                                  fw={650} 
                                  className='lhNormal'
                                  c='primary'
                                  // component='a'
                                  // href={`/job/${item.id}?project=${project.username}`}
                                >
                                  {item.rolename}
                                </Title>
                                <Group gap={4}>
                                  <Text size='xs'>
                                    <strong>Experiência:</strong> {item.experienceName}
                                  </Text>
                                  <Group gap={1}>
                                    <IconMusic size='15' color='blue' />
                                    <IconMusic size='15' color='blue' opacity={item.experienceLevel >= 2 ? 1 : 0.3} />
                                    <IconMusic size='15' color='blue' opacity={item.experienceLevel === 3 ? 1 : 0.3} />
                                  </Group>
                                </Group>
                                <Text size='xs'>
                                  <strong>Vínculo:</strong> Contrato
                                </Text>
                                <Text size='xs' c='dimmed'>
                                  publicado há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                </Text>
                                <Text size='sm'>
                                  {item.info}
                                </Text>
                              </Flex>
                            </Flex>
                          </Card>
                        )}
                      </Flex>
                    )}
                  </Card>
                }
                {activeTab === 'events' &&
                  <Card padding='lg' radius='md' withBorder className='mublinModule'>
                    <Title fz='1.0rem' fw='640' mb={3}>Eventos</Title>
                    <Text size='sm' c='dimmed'>
                      Nenhum evento no momento
                    </Text>
                  </Card>
                }
                {activeTab === 'videos' &&
                  <Card padding='lg' radius='md' withBorder className='mublinModule'>
                    <Title fz='1.0rem' fw='640' mb={3}>Vídeos</Title>
                    <Text size='sm' c='dimmed'>
                      Nenhum vídeo no momento
                    </Text>
                  </Card>
                }
                {activeTab === 'pictures' &&
                  <Card padding='lg' radius='md' withBorder className='mublinModule'>
                    <Title fz='1.0rem' fw='640' mb={3}>Fotos</Title>
                    <Text size='sm' c='dimmed'>
                      Nenhuma foto no momento
                    </Text>
                    {/* <Grid gutter={10}>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Image
                          radius='md'
                          h='auto'
                          w='100%'
                          fit='contain'
                          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
                        />
                      </Grid.Col>
                    </Grid> */}
                  </Card>
                }
                {(
                  activeTab === 'dashboard' 
                  && (project.loggedUserIsActive && project.loggedUserIsAdmin)
                ) &&
                  <Card mih={400} padding='lg' radius='md' withBorder className='mublinModule'>
                    <Group gap={3} mb={8}>
                      <Title fz='0.9rem' fw='620'>
                        Painel de Controle
                      </Title>
                      <IconLockSquareRounded size={28} stroke={1.5} /> 
                    </Group>
                    <Tabs mt={12} variant='outline' defaultValue='settings'>
                      <Tabs.List>
                        <Tabs.Tab value='settings'>
                          Dados
                        </Tabs.Tab>
                        <Tabs.Tab value='members'>
                          Equipe
                        </Tabs.Tab>
                        <Tabs.Tab value='pictures'>
                          Foto
                        </Tabs.Tab>
                        <Tabs.Tab value='other'>
                          Outros
                        </Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value='settings' pt={12}>
                        <ProjectAdminEditInfos username={username} />
                      </Tabs.Panel>

                      <Tabs.Panel value='members' pt={12}>
                        <ProjectDashboardAdminTeamPage username={username} />
                      </Tabs.Panel>

                      <Tabs.Panel value='pictures' pt={12}>
                        <Text size='sm' c='dimmed' mt={12}>
                          Não é possível atualizar a foto de perfil no momento
                        </Text>
                      </Tabs.Panel>

                      <Tabs.Panel value='other' pt={12}>
                        <Text size='sm' c='dimmed' mt={12}>
                          Outras configurações:
                        </Text>
                      </Tabs.Panel>
                    </Tabs>
                  </Card>
                }
              </Grid.Col>
              {(isLargeScreen || activeTab === 'people') &&
                <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
                  <Card px='md' py='md' radius='md' withBorder className='mublinModule'>
                    <Title fz='1.0rem' fw='640' mb={16}>Pessoas neste projeto</Title>
                    {members.length > 0 ? ( 
                      <Flex direction='column' gap={18}>
                        {members.map(member => 
                          <Box key={member.id}>
                            <Group gap={7} align='center' wrap='nowrap'>
                              <Avatar
                                size='45'
                                name={member.name}
                                src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-90,w-90,c-maintain_ratio/'+member.picture} 
                                component='a'
                                href={`/${member.username}`}
                                title={member.username}
                              />
                              <Flex direction='column' gap={1}>
                                <Group gap={1}>
                                  <Text 
                                    component='a' 
                                    href={`/${member.username}`} 
                                    size='0.96rem' fw={570} style={{lineHeight:'1'}}>
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
                                <Text size='xs' className='lhNormal'>
                                  {member.statusName}
                                  {` · ${member.joinedIn} › `}
                                  {project.endDate
                                    ? (!member.leftIn) ? project.endDate : member.leftIn
                                    : (member.leftIn) ? member.leftIn : 'Atualmente'
                                  }
                                </Text>
                                <Text c='dimmed'  size='xs' className='lhNormal'>
                                  {member.role1 &&
                                    <Text className='comma' span>
                                      {member.role1}
                                    </Text>
                                  }
                                  {member.role2 &&
                                    <Text className='comma' span>
                                      {member.role2}
                                    </Text>
                                  }
                                  {member.role3 &&
                                    <Text className='comma' span>
                                      {member.role3}
                                    </Text>
                                  }
                                </Text>
                                {!!member.founder &&
                                  <Badge size='xs' radius='sm' color='mublinColor'>
                                    {member.gender === 'f' ? 'Fundadora' : 'Fundador'}
                                  </Badge>
                                }
                              </Flex>
                            </Group>
                          </Box>
                        )}
                        {pastMembers.length > 0 && 
                          <>
                            <Text size='xs'>Já participaram anteriormente:</Text>
                            {pastMembers.map(member => 
                              <Box key={member.id}>
                                <Group gap={7} align='center' wrap='nowrap'>
                                  <Avatar
                                    size='45'
                                    name={member.name}
                                    src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-90,w-90,c-maintain_ratio/'+member.picture} 
                                    component='a'
                                    href={`/${member.username}`}
                                    title={member.username}
                                  />
                                  <Flex direction='column' gap={1}>
                                    <Group gap={1}>
                                      <Text 
                                        component='a' 
                                        href={`/${member.username}`} 
                                        size='0.96rem' fw={570} style={{lineHeight:'1'}}>
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
                                    <Text size='xs' className='lhNormal'>
                                      {member.statusName}
                                      {` · ${member.joinedIn} › `}
                                      {project.endDate
                                        ? (!member.leftIn) ? project.endDate : member.leftIn
                                        : (member.leftIn) ? member.leftIn : 'Atualmente'
                                      }
                                    </Text>
                                    <Text c='dimmed' size='xs' className='lhNormal'>
                                      {member.role1 &&
                                        <Text className='comma' span>
                                          {member.role1}
                                        </Text>
                                      }
                                      {member.role2 &&
                                        <Text className='comma' span>
                                          {member.role2}
                                        </Text>
                                      }
                                      {member.role3 &&
                                        <Text className='comma' span>
                                          {member.role3}
                                        </Text>
                                      }
                                    </Text>
                                    {!!member.founder &&
                                      <Badge size='xs' radius='sm' variant='light' color='mublinColor'>
                                        Fundador
                                      </Badge>
                                    }
                                  </Flex>
                                </Group>
                              </Box>
                            )}
                          </>
                        }
                      </Flex>
                    ) : (
                      <Text size='sm' c='dimmed'>
                        Nenhum usuário cadastrado neste projeto no momento 
                      </Text>
                    )}
                  </Card>
                </Grid.Col>
              }
            </Grid>
          </>
        }
      </Container>
      <FooterMenuMobile />
      <Drawer  
        position='left'
        opened={modalParticipationOpen} 
        onClose={() => setModalParticipationOpen(true)} 
        title={`Me associar a ${project.name}`}
      >
        <Center mb={7}>
          <Image
            radius='md'
            h={100}
            w='auto'
            fit='contain'
            src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture : undefined}
          />
        </Center>
        <Text size='xs' ta='center' c='dimmed' mb={8} mt={4}>
          {project.typeId && project.typeName + ' · '} {'Formada em '+project.foundationYear}{project.endDate && ' ・ Encerrada em '+project.endDate}
        </Text>
        <Divider mb={6} label='Pessoas associadas:' labelPosition='left' />
        {project.requestingMembers ? ( 
          <Group justify='flex-start' gap={7} mb={7}>
            <Skeleton height={26} circle mb="sm" />
            <Skeleton height={26} circle mb="sm" />
            <Skeleton height={26} circle mb="sm" />
          </Group>
        ) : (
          <Group justify='flex-start' gap={7} mb={7}>
            {members.map((member, key) => 
              <Flex key={key} direction='column' align='center'>
                <Avatar 
                  size='sm' 
                  src={`https://ik.imagekit.io/mublin/users/avatars/tr:h-56,w-56,c-maintain_ratio/${member.picture}`}
                />
                <Text size='10px' mt={5}>{member.name}</Text>
              </Flex>
            )}
          </Group>
        )}
        <Divider mb={7} />
        <form onSubmit={form.onSubmit(handleSubmitParticipation)}>
          <Radio.Group
            name='status'
            label={project.endDate ? 'Qual foi sua ligação com este projeto?' : 'Qual é sua ligação com este projeto?'}
            key={form.key('status')}
            {...form.getInputProps('status')}
          >
            <Group>
              <Radio color='mublinColor' value="1" label='Integrante oficial' />
              <Radio color='mublinColor' value="2" label={<Group gap={2}><IconIdBadge2 style={{ width: rem(18), height: rem(18) }} /> Contratado</Group>} />
            </Group>
          </Radio.Group>
          <NativeSelect
            mt={8}
            withAsterisk
            label='Sua principal função neste projeto'
            key={form.key('mainRole')}
            {...form.getInputProps('mainRole')}
            data={[
              { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
              { group: 'Gestão, produção e outros', items: rolesListManagement },
              { group: 'Instrumentos', items: rolesListMusicians },
            ]}
          />
          <Grid mt={8}>
            <Grid.Col span={6}>
              <NumberInput
                label='Entrei em:'
                description={'Entre ' + project.foundationYear + ' e ' + (project.endDate ? project.endDate : currentYear)}
                min={project.foundationYear} 
                max={project.endDate ? project.endDate : currentYear}
                key={form.key('joinedIn')}
                {...form.getInputProps('joinedIn')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label='Deixei o projeto em:'
                description={project.endDate ? <>Até {project.endDate}</> : <>Entre {form.getValues().joinedIn} e {currentYear}</>}
                min={form.getValues().joinedIn || project.foundationYear}
                max={project.endDate ? project.endDate : currentYear}
                key={form.key('leftIn')}
                {...form.getInputProps('leftIn')}
              />
            </Grid.Col>
          </Grid>
          <Checkbox
            mt={4}
            color='mublinColor'
            label={
              project.endDate 
              ? 'Estive ativo até o final do projeto' 
              : 'Estou ativo atualmente neste projeto'
            }
            key={form.key('active')}
            {...form.getInputProps('active', { type: 'checkbox' })}
          />
          <Checkbox
            mt={8}
            color='mublinColor'
            label='Definir como um dos meus projetos principais'
            key={form.key('featured')}
            {...form.getInputProps('featured', { type: 'checkbox' })}
          />
          <Alert variant="light" color="yellow" mt={16} p={'xs'}>
            <Text size="xs">Sua participação ficará pendente até que um dos administradores do projeto aprove sua solicitação</Text>
          </Alert>
          <Group justify="flex-end" mt="md">
            <Button 
              variant='default' 
              onClick={() => setModalParticipationOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              type='submit' 
              color='mublinColor'
              loading={isSubmitting}
            >
              Solicitar aprovação
            </Button>
          </Group>
        </form>
      </Drawer>
    </>
  )
}

export default ProjectPage