import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Box, Card, Center, Flex, Title, Text, Image, Skeleton, Avatar, Loader, Indicator, Drawer, Button, em } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconMenu2, IconPlus } from '@tabler/icons-react'
import Header from '../header'
import Navbar from '../navbar'
import MublinLogoBlack from '../../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import '../styles.scss'

function ProjectDashboardTeamPage () {

  const params = useParams()
  const username = params?.username

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
    dispatch(projectInfos.getProjectEvents(username))
    dispatch(projectInfos.getProjectNotes(username))
  }, []);

  const { colorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const project = useSelector(state => state.project)

  const activeMembers = project.members.filter(
    (member) => { return member.confirmed === 1 && !member.leftIn }
  )
  // const pendingMembers = project.members.filter(
  //   (member) => { return member.confirmed === 2 }
  // )
  // const pastMembers = project.members.filter(
  //   (member) => { return member.confirmed === 1 && member.leftIn }
  // )

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs">
        <Navbar mobile />
      </Drawer>
      <Grid id='dashboard' gutter={0}>
        <Grid.Col span={{ base: 12, md: 2.5, lg: 2.5 }} id='desktopSidebar' p={14}>
          <Group align='center' gap={6} className='showOnlyInMobile'>
            <Image
              radius='md'
              h={30}
              w='auto'
              fit='contain'
              src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
              ml={6}
            />
            <IconMenu2 size={26} onClick={open} />
          </Group>
          <Box className='showOnlyInLargeScreen'>
            <Navbar desktop />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          <Header />
          {project.requesting ? (
            <>
              <Skeleton w={280} h={26} radius='xl' />
              <Skeleton w={190} h={18} radius='xl' mt={6} />
              <Center mt={140}>
                <Loader color='mublinColor' type='bars' />
              </Center>
            </>
          ) : (
            <>
              <Box>
                <Title fz='h2'>Painel de {project.name}</Title>
                <Text size='sm' c='dimmed'>Informações sobre o projeto</Text>
              </Box>
              <Grid mt={34}>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Card withBorder p={10} radius='md' className='mublinModule'>
                    <Text size='md' mb={6} fw={600}>Status do projeto</Text>
                    {project.activityStatusId &&
                      <>
                        <Flex
                          align='center'
                          justify='flex-start'
                          gap={6}
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
                      </>
                    }
                  </Card>
                  <Card withBorder p={10} mt={14} radius='md' className='mublinModule'>
                    <Flex justify='space-between'>
                      <Text size='md' mb={12} fw={600}>
                        Recados do time ({project.notes.total})
                      </Text>
                      <Button leftSection={<IconPlus size={14} />} size='xs' variant='subtle' color='primary'>
                        Novo recado
                      </Button>
                    </Flex>
                    {project.notes.total === 0 ? (
                      <Text size='sm' c='dimmed'>
                        Nenhum recado no momento
                      </Text>
                    ) : (
                      <Flex direction='column' gap={10}>
                        {project.notes.result.map(item =>
                          <Box key={item.id}>
                            <Group gap={6} mb={5}>
                              <Avatar size={25} src={item.authorPicture} />
                              <Flex direction='column' gap={0}>
                                <Text size='xs' fw={400} className='lhNormal'>
                                  <strong>{item.authorName} {item.authorLastname}</strong> há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                </Text>
                                <Text size='xs' c='dimmed'>@{item.authorUsername}</Text>
                              </Flex>
                            </Group>
                            <Text size='sm'>{item.note}</Text>
                            <Text size='10px' c='dimmed' mt={6}>
                              {format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}
                            </Text>
                          </Box>
                        )}
                      </Flex>
                    )}
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }} pr={isMobile ? 0 : 100}>
                  <Box>
                    <Image
                      radius='lg'
                      h={120}
                      w='auto'
                      fit='contain'
                      src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
                      mb={14}
                    />
                  </Box>
                  <Text mb={6} size='sm'>
                    <strong>Tipo:</strong> {project.typeName}
                  </Text>
                  <Text mb={6} size='sm'>
                    <strong>Ano de fundação:</strong> {project.foundationYear} {!!project.endDate && <Text span c='dimmed'>(encerrado em {project.endDate})</Text>}
                  </Text>
                  <Text mb={6} size='sm'>
                    <strong>Propósito do projeto:</strong> {project.purpose ? project.purpose : 'Não informado'}
                  </Text>
                  <Avatar.Group spacing={10} mt={6}>
                    {activeMembers.map(member =>
                      <Avatar
                        key={member.id}
                        size='45'
                        name={member.name}
                        title={`${member.name} ${member.lastname} - ${member.role1}`}
                        src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-82,w-82,c-maintain_ratio/'+member.id+'/'+member.picture} 
                        component='a'
                        href={`/${member.username}`}
                      />
                    )}
                    {/* <Avatar size='30'>+5</Avatar> */}
                  </Avatar.Group>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProjectDashboardTeamPage