import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Card, Box, Flex, Group, Badge, Alert, Title, Table, Spoiler, Text, Image, Skeleton, Avatar, Paper, Anchor, Button, Indicator, Affix, Modal, ScrollArea, Tabs, em, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconX, IconCheck, IconSettings, IconBrandInstagram, IconBrandSoundcloud, IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconMusic } from '@tabler/icons-react'
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

  const [activeTab, setActiveTab] = useState('first')

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
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          color='primary'
          leftSection={<IconSettings size={16} />}
          rightSection={<Avatar
            size='20'
            fit='contain'
            src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-40,w-40,c-maintain_ratio/'+project.picture : undefined}
          />}
        >
          Painel de Controle
        </Button>
      </Affix>
      <Container size='lg'>
        {project.requesting && 
          <Paper
            withBorder={isMobile ? false : true}
            p={14}
            className='mublinModule transparentBgInMobile projectHeader'
          >
            <Flex
              justify='flex-start'
              align='center'
              direction='row'
              wrap='nowrap'
              columnGap='xs'
              mt={6}
            >
              <Skeleton radius='md' width={80} height={80} />
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
            <Grid mb={60} mt={isMobile ? 18 : 0}>
              <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
                <Card 
                  padding='lg' 
                  style={{paddingBottom:'0px'}} 
                  radius='md' 
                  withBorder 
                  mb={14}
                >
                  <Card.Section>
                    <Image
                      src={project.cover_image ? 'https://ik.imagekit.io/mublin/projects/'+project.cover_image : 'https://ik.imagekit.io/mublin/bg/cover-gradient.jpg'}
                      height={120}
                      alt='Norway'
                    />
                  </Card.Section>
                  <Box style={{marginTop:'-64px'}}>
                    <Image
                      radius={false}
                      h={120}
                      w='auto'
                      fit='contain'
                      src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
                      style={{border:'3px solid white'}}
                    />
                  </Box>
                  <Group gap={0} justify='space-between' mt='sm'>
                    <Title order={1} fz='1.5rem' fw={530} className='lhNormal op90'>
                      {truncateString(project.name, isMobile ? 15 : 120)}
                    </Title>
                  </Group>
                  <Text size='sm'>
                    {project.genre1 &&
                      <Text className='comma' span>
                        {project.genre1}
                      </Text>
                    }
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
                  <Text size='xs' c='dimmed' my={2}>
                    {project.typeName} {project.region && `· ${project.region} · ${project.country}`}
                  </Text>
                  {project.activityStatusId &&
                    <Flex
                      align='center'
                      justify='flex-start'
                      gap={6}
                      mb={isMobile ? 0 : 6}
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
                        size='xs'
                        className='lhNormal'
                        pt='1px'
                      >
                        {project.activityStatus}
                      </Text>
                    </Flex>
                  }
                  <Avatar.Group spacing={8} mt={6}>
                    {members.filter(m => !m.leftIn).map(member =>
                      <Avatar
                        key={member.id}
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
                  {project.endDate && 
                    <Alert mt={10} px={10} py={8} variant='light' color='red'>
                      <Text size='xs'>
                        {project.name} encerrou as atividades em {project.endDate}
                      </Text>
                    </Alert>
                  }
                  <Tabs 
                    mt={10} 
                    value={activeTab} 
                    onChange={setActiveTab} 
                    defaultValue='first'
                    color='mublinColor'
                    className='showOnlyInLargeScreen'
                  >
                    <Tabs.List>
                      <Tabs.Tab value='first'>
                        Geral
                      </Tabs.Tab>
                      {project.spotifyId &&
                        <Tabs.Tab value='second'>
                          Músicas
                        </Tabs.Tab>
                      }
                      {/* <Tabs.Tab value='pictures'>
                        Pessoas
                      </Tabs.Tab> */}
                      <Tabs.Tab value='third'>
                        Oportunidades ({project.opportunities.total})
                      </Tabs.Tab>
                      <Tabs.Tab value='fourth'>
                        Eventos
                      </Tabs.Tab>
                      <Tabs.Tab value='videos'>
                        Videos
                      </Tabs.Tab>
                      <Tabs.Tab value='pictures'>
                        Fotos
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                  <ScrollArea w='100%' h={38} type='never' className='showOnlyInMobile'>
                    <Box className='fitContent'>
                      <Tabs 
                        value={activeTab} 
                        onChange={setActiveTab} 
                        defaultValue='first'
                        color='mublinColor'
                      >
                        <Flex gap={0}>
                          <Tabs.Tab value='first'>
                            Geral
                          </Tabs.Tab>
                          {project.spotifyId &&
                            <Tabs.Tab value='second'>
                              Músicas
                            </Tabs.Tab>
                          }
                          <Tabs.Tab value='third'>
                            Oportunidades
                          </Tabs.Tab>
                          <Tabs.Tab value='fourth'>
                            Eventos
                          </Tabs.Tab>
                          <Tabs.Tab value='videos'>
                            Videos
                          </Tabs.Tab>
                          <Tabs.Tab value='pictures'>
                            Fotos
                          </Tabs.Tab>
                        </Flex>
                      </Tabs>
                    </Box>
                  </ScrollArea>
                </Card>
                {activeTab === 'first' &&
                  <>
                    <Card padding='lg' radius='md' withBorder>
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
                    </Card>
                    {(project.instagram || project.soundcloud) && 
                      <Card mt={14} padding='lg' radius='md' withBorder>
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
                      </Card>
                    }
                    <Card mt={14} padding='lg' radius='md' withBorder>
                      <Title fz='1.0rem' fw='640' mb={3}>Propósito do projeto</Title>
                      <Spoiler maxHeight={120} showLabel={<Text size='sm' fw={600}>...mais</Text>} hideLabel={<Text size='sm' fw={600}>mostrar menos</Text>}>
                        <Text size='sm' c={!project.purpose ? 'dimmed' : undefined}>
                          {project.purpose ? project.purpose : 'Não informado'}
                        </Text>
                      </Spoiler>
                    </Card>
                  </>
                }
                {activeTab === 'second' &&
                  <Box>
                    <iframe style={{borderRadius:'15px'}} src={`https://open.spotify.com/embed/artist/${project.spotifyId}?utm_source=generator&theme=0`} width='100%' height='352' frameBorder='0' allowFullScreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe>
                  </Box>
                }
                {activeTab === 'third' &&
                  <Card padding='lg' radius='md' withBorder>
                    <Title fz='1.0rem' fw='640' className='lhNormal'>
                      Oportunidades em {project.name}
                    </Title>
                    <Text size='sm' c='dimmed' mb={12}>
                      Participações em aberto neste projeto
                    </Text>
                    {project.opportunities.total === 0 ? (
                      <Text size='sm' c='dimmed'>
                        Nenhuma oportunidade no momento
                      </Text>
                    ) : (
                      <Flex direction='column' gap={10}>
                        {project.opportunities.result.map(item => 
                          <>
                            <Card radius='md' withBorder p='xs'>
                              <Flex gap={10}>
                                <Image
                                  radius='md'
                                  h={70}
                                  w='auto'
                                  fit='contain'
                                  src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-140,w-140,c-maintain_ratio/'+project.picture : undefined}
                                  style={{border:'3px solid white'}}
                                />
                                <Flex direction='column'>
                                  <Title 
                                    order={4} 
                                    fz='1rem' 
                                    fw={650} 
                                    className='lhNormal'
                                    c='primary'
                                    component='a'
                                    href={`/job/${item.id}?project=${project.username}`}
                                  >
                                    {item.rolename}
                                  </Title>
                                  <Group gap={4}>
                                    <Text size='xs'>
                                      <strong>Experiência sugerida:</strong> {item.experienceName}
                                    </Text>
                                    <Group gap={1}>
                                      <IconMusic size='15' />
                                      <IconMusic size='15' opacity={item.experienceLevel >= 2 ? 1 : 0.4} />
                                      <IconMusic size='15' opacity={item.experienceLevel === 3 ? 1 : 0.4} />
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
                            {/* <Table.Tr key={item.id} fz={12}>
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
                            </Table.Tr> */}
                          </>
                        )}
                        {/* <Table.ScrollContainer minWidth={500}>
                          <Table withRowBorders={false} variant='vertical'>
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
                        </Table.ScrollContainer> */}
                      </Flex>
                    )}
                  </Card>
                }
                {activeTab === 'fourth' &&
                  <Card padding='lg' radius='md' withBorder>
                    <Title fz='1.0rem' fw='640' mb={3}>Eventos</Title>
                    <Text size='sm' c='dimmed'>
                      Nenhum evento no momento
                    </Text>
                  </Card>
                }
                {activeTab === 'pictures' &&
                  <Card padding='lg' radius='md' withBorder>
                    <Grid gutter={10}>
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
                    </Grid>
                  </Card>
                }
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
                <Card px='md' py='md' radius='md' withBorder>
                  <Flex direction='column' gap={18}>
                    {members.map(member => 
                      <Box key={member.id}>
                        <Group gap={7} align='center' wrap='nowrap'>
                          <Avatar
                            size='45'
                            name={member.name}
                            src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-90,w-90,c-maintain_ratio/'+member.id+'/'+member.picture} 
                            component='a'
                            href={`/${member.username}`}
                            title={member.username}
                          />
                          <Flex direction='column' gap={1}>
                            <Group gap={1}>
                              <Text 
                                component='a' 
                                href={`/${member.username}`} 
                                size='sm' fw={500} style={{lineHeight:'1'}}>
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
                  </Flex>
                </Card>
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