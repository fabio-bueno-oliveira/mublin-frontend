import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Box, Card, Center, Flex, Title, Text, Image, Skeleton, Avatar, Loader, Drawer, Button, Badge, Table, rem, em } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconMenu2, IconX, IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconDotsVertical } from '@tabler/icons-react'
import Header from '../header'
import Navbar from '../navbar'
import MublinLogoBlack from '../../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg'
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

  const members = project.members.filter(
    (member) => { return member.confirmed !== 2 }
  )
  const pendingMembers = project.members.filter(
    (member) => { return member.confirmed === 2 }
  )

  // const pastMembers = project.members.filter(
  //   (member) => { return member.confirmed === 1 && member.leftIn }
  // )

  const [opened, { open, close }] = useDisclosure(false)

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs">
        <Navbar mobile page='team' />
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
            <Navbar desktop page='team' />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          <Header page='Time' />
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
                <Title fz='h2'>Time de {project.name}</Title>
                <Text size='sm' c='dimmed'>Pessoas que participam ou já participaram do projeto</Text>
              </Box>
              <Card withBorder p={10} mt={20} radius='md' className='mublinModule'>
                <Text size='md' mb={6} fw={600}>Pessoas aguardando aprovação:</Text>
                {pendingMembers.length ? (
                  <Flex gap={10}>
                    {pendingMembers.map(member =>
                      <Card key={member.id} withBorder p={10} w='100%' className='mublinModule'>
                        <Group gap={10}>
                          <Avatar
                            size='45'
                            name={member.name}
                            title={`${member.name} ${member.lastname} - ${member.role1}`}
                            src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-82,w-82,c-maintain_ratio/'+member.id+'/'+member.picture} 
                            component='a'
                            href={`/${member.username}`}
                          />
                          <Flex direction='column' gap={5}>
                            <Text size='sm'>
                              <Text span fw={550}>{member.name} {member.lastname}</Text> sugere que atuou com <Text span fw={550}>{member.role1}</Text> a partir de <Text span fw={550}>{member.joinedIn}</Text>
                            </Text>
                            <Group gap={4}>
                              <Button size='compact-xs' color='lime' leftSection={<IconCheck size={14} />}>Aprovar</Button>
                              <Button size='compact-xs' color='red' leftSection={<IconX size={14} />}>Declinar</Button>
                            </Group>
                          </Flex>
                        </Group>
                      </Card>
                    )}
                  </Flex>
                ) : (
                  <Text size='sm' c='dimmed'>Ninguém aguardando aprovação no momento</Text>
                )}
              </Card>
              <Card withBorder p={10} mt={20} radius='md' className='mublinModule'>
                <Text size='md' mb={6} fw={600}>Pessoas deste projeto:</Text>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nome</Table.Th>
                      <Table.Th>Atribuição</Table.Th>
                      <Table.Th>Vínculo</Table.Th>
                      <Table.Th>Período</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {members.map(member =>
                      <Table.Tr key={member.id}>
                        <Table.Td>
                          <Group gap={3}>
                            <Avatar
                              size='35'
                              name={member.name}
                              src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-70,w-70,c-maintain_ratio/'+member.id+'/'+member.picture} 
                              component='a'
                              href={`/${member.username}`}
                              title={member.username}
                            />
                            <Text 
                              component='a' 
                              href={`/${member.username}`} 
                              size='sm' 
                              className='lhNormal'
                            >
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
                        </Table.Td>
                        <Table.Td>
                          <Text size='xs' className='lhNormal'>
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
                            <Badge size='xs' radius='sm' color='dark'>
                              {member.gender === 'f' ? 'Fundadora' : 'Fundador'}
                            </Badge>
                          }
                        </Table.Td>
                        <Table.Td>
                          {member.statusName}
                        </Table.Td>
                        <Table.Td>
                          {`${member.joinedIn} › `}
                          {project.endDate
                            ? (!member.leftIn) ? project.endDate : member.leftIn
                            : (member.leftIn) ? member.leftIn : 'Atualmente'
                          }
                        </Table.Td>
                        <Table.Td>
                          <IconDotsVertical size={13} />
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </Card>
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProjectDashboardTeamPage