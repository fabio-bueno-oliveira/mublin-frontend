import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { userActions } from '../../../store/actions/user'
import { projectInfos } from '../../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Box, Card, Center, Flex, Title, Text, Image, Skeleton, Avatar, Loader, Drawer, Button, Badge, Table, rem, em, Modal, NativeSelect, Alert, Divider } from '@mantine/core'
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
  const token = localStorage.getItem('token')

  const user = useSelector(state => state.user)

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(userActions.getInfo())
    dispatch(projectInfos.getProjectAdminAccessInfo(username))
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
    dispatch(projectInfos.getProjectEvents(username))
    dispatch(projectInfos.getProjectNotes(username))
  }, []);

  const { colorScheme } = useMantineColorScheme()
  // const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const project = useSelector(state => state.project)

  const members = project.members.filter(
    (member) => { return member.confirmed !== 2 }
  )
  const pendingMembers = project.members.filter(
    (member) => { return member.confirmed === 2 }
  )
  const membersAdmin = project.members.filter((member) => { return member.admin === 1 })

  // const pastMembers = project.members.filter(
  //   (member) => { return member.confirmed === 1 && member.leftIn }
  // )

  const [opened, { open, close }] = useDisclosure(false)

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  const formatParticipationDates = (joinedIn, leftIn) => {
    if (joinedIn && !leftIn) {
      return 'em '+joinedIn
    } else if (joinedIn && leftIn && (joinedIn !== leftIn)) {
      return 'de '+joinedIn+' a '+leftIn
    } else if (joinedIn && leftIn && (joinedIn === leftIn)) {
      return 'em '+joinedIn
    }
  }

  const [isLoading, setIsLoading] = useState(null)
  const updateMemberRequest = (memberId, responseToRequest) => {
    setIsLoading(responseToRequest)
    fetch(`https://mublin.herokuapp.com/project/${project.id}/updateMemberRequest`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: memberId, requestResponse: responseToRequest})
    }).then((response) => {
        response.json().then((response) => {
          dispatch(projectInfos.getProjectMembers(username))
          setIsLoading(null)
        })
    }).catch(err => {
        setIsLoading(null)
        console.error(err)
        alert('Ocorreu um erro ao tentar responder a solicitação do integrante. Tente novamente em instantes')
      })
  }

  // Member Management
  const [modalMemberManagement, setModalMemberManagementOpen] = useState(false)
  const [modalMemberManagementUserId, setModalMemberManagementUserId] = useState(null)
  const memberInfo = members.filter((member) => { return member.id === modalMemberManagementUserId })

  // const [manageUser, setManageUser] = useState({id: '', admin: '', active: '', leader: ''})
  const [manageUserAdmin, setManageUserAdmin] = useState('')

  const openModalMemberManagement = (userId, admin, active, leader) => {
    // setManageUser({id: userId, admin: admin, active: active, leader: leader})
    setModalMemberManagementUserId(userId)
    setModalMemberManagementOpen(true)
  }

  const updateMemberSettings = (memberId) => {
    setIsLoading(true)
    fetch(`https://mublin.herokuapp.com/project/${project.id}/updateMemberDetails`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: memberId, projectId: project.id, admin: manageUserAdmin, active: 1, leader: 0})
    }).then((response) => {
      response.json().then((response) => {
        dispatch(projectInfos.getProjectMembers(username))
        setIsLoading(false)
        setModalMemberManagementOpen(false)
      })
    }).catch(err => {
      setIsLoading(false)
      console.error(err)
      alert('Ocorreu um erro ao tentar alterar os detalhes do integrante. Tente novamente em instantes')
      setModalMemberManagementOpen(false)
    })
  }

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
          <Header page='Equipe' />
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
                <Title fz='h2'>Equipe de {project.name}</Title>
                <Text size='sm' c='dimmed'>Pessoas que participam ou já participaram do projeto</Text>
              </Box>
              <Card withBorder p={10} mt={20} radius='md' className='mublinModule'>
                <Title fz='h6' fw={450} mb={6}>Pessoas aguardando aprovação:</Title>
                {pendingMembers.length ? (
                  <Flex gap={10}>
                    {pendingMembers.map(member =>
                      <Card key={member.id} radius='md' withBorder p={10} w='100%' className='mublinModule'>
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
                              <Text span fw={550}>{member.name} {member.lastname}</Text> sugere que atuou como <Text tt='lowercase' span fw={550}>{member.role1}</Text> <Text span>{formatParticipationDates(member.joinedIn, member.leftIn)}</Text> <Text span tt='lowercase'>({member.statusName})</Text>
                            </Text>
                            <Group gap={4}>
                              <Button
                                size='compact-xs'
                                color='lime'
                                leftSection={<IconCheck size={14} />}
                                disabled={!project.adminAccess ? true : false}
                                onClick={() => updateMemberRequest(member.id, 1)}
                                loading={isLoading === 1}
                              >
                                Aprovar
                              </Button>
                              <Button
                                size='compact-xs'
                                color='red'
                                leftSection={<IconX size={14} />}
                                disabled={!project.adminAccess ? true : false}
                                onClick={() => updateMemberRequest(member.id, 0)}
                                loading={isLoading === 0}
                              >
                                Declinar
                              </Button>
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
                          <Group gap={4}>
                            {!!member.founder &&
                              <Badge size='xs' radius='sm' color='dark'>
                                {member.gender === 'f' ? 'Fundadora' : 'Fundador'}
                              </Badge>
                            }
                            {!!member.admin && 
                              <Badge size='xs' radius='sm' color='dark'>
                                Admini
                              </Badge>
                            }
                          </Group>
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
                          <IconDotsVertical
                            size={13}
                            className='point'
                            onClick={() =>
                              openModalMemberManagement(member.id, member.admin, member.active, member.leader
                            )}
                          />
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
      <Modal
        centered
        opened={modalMemberManagement}
        onClose={() => setModalMemberManagementOpen(false)}
        title='Gerenciar membro do projeto'
        d
      >
        {memberInfo.map(memberToManage => 
          <Box key={memberToManage.id}>
            <Alert mb={6} variant="light" color='yellow' fz='xs' p={5} ta='center'>
              Apenas administradores podem editar estas opções
            </Alert>
            <Center mb={4}>
              {memberToManage.picture ? (
                <Image radius='md' src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+memberToManage.id+'/'+memberToManage.picture} w={75} h={75} />
              ) : (
                <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' w={100} h={100} />
              )}
            </Center>
            <Text ta='center' size='xs'>
              {memberToManage.name+' '+memberToManage.lastname} {!!memberToManage.admin && '(Administrador)'}
            </Text>
            <Divider my={8} />
            <NativeSelect
              size='sm'
              mb={20}
              label={`${memberToManage.name} é administrador deste projeto?`}
              defaultValue={manageUserAdmin}
              disabled={(!project.adminAccess ? true : false || (membersAdmin.length < 2 && memberToManage.id === user.id))}
              onChange={(e) => 
                setManageUserAdmin(e.target.options[e.target.selectedIndex].value
              )}
            >
              <option value='1' selected={memberToManage.admin ? true : false}>Sim</option>
              <option value='0' selected={!memberToManage.admin ? true : false}>Não</option>
            </NativeSelect>
            {!!(membersAdmin.length === 1 && project.adminAccess && user.id === memberToManage.id) && 
              <Text size='xs' fw={500}>
                É necessário ao menos um administrador por projeto
              </Text>
            }
            <Button 
              fullWidth color='mublinColor' 
              size='sm' mt={4} 
              onClick={() => updateMemberSettings(memberToManage.id)}
              disabled={project.adminAccess ? false : true} 
              loading={isLoading}
            >
              Salvar
            </Button>
            {(memberToManage.id === user.id) && 
              <>
                <Divider my={8} />
                <Button 
                  size='sm' 
                  fullWidth 
                  color='red' 
                  mt={4} 
                  disabled={(membersAdmin.length === 1 && project.adminAccess) ? true : false}
                  onClick={() => updateMemberSettings(memberToManage.id)}
                >
                  Sair deste projeto (me desassociar)
                </Button>
              </>
            }
            {!!(membersAdmin.length === 1 && project.adminAccess && memberToManage.id === user.id) && 
              <Text size='xs' mt={4}>
                É necessário que outro usuário seja administrador para que você possa se desassociar deste projeto
              </Text>
            }
            {memberToManage.id !== user.id && 
              <>
                <Divider mt={22} mb={8} />
                <Button variant='light' fullWidth size='xs' color='red' mt={4} disabled={(project.adminAccess) ? false : true}>
                  Desassociar {memberToManage.name+' '+memberToManage.lastname}
                </Button>
              </>
            }
          </Box>
        )}
      </Modal>
    </>
  )
}

export default ProjectDashboardTeamPage