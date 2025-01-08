import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { Grid, Container, Modal, Card, NativeSelect, Skeleton, Group, Radio, Box, Flex, Badge, Button, Title, Text, Anchor, Divider } from '@mantine/core'
import { IconChevronLeft, IconPlus, IconX } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'

function SettingsMusicalPreferences () {

  document.title = 'Preferências musicais | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const user = useSelector(state => state.user)
  const genresCategories = useSelector(state => state.musicGenres.categories)
  const genres = useSelector(state => state.musicGenres)
  const roles = useSelector(state => state.roles)
  const availabilityOptions = useSelector(state => state.availabilityOptions)

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const [isAddingGenre, setIsAddingGenre] = useState(false)
  const [isDeletingGenre,setIsDeletingGenre] = useState(false)

  const [isAddingRole, setIsAddingRole] = useState(false)
  const [isDeletingRole,setIsDeletingRole] = useState(false)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const xIconStyle = { width: '10px', height: '10px', cursor:'pointer' }

  useEffect(() => { 
    dispatch(userInfos.getInfo());
    dispatch(miscInfos.getMusicGenresCategories());
    dispatch(userInfos.getUserGenresInfoById(loggedUserId));
    dispatch(userInfos.getUserRolesInfoById(loggedUserId));
    dispatch(userInfos.getUserAvailabilityItemsById(loggedUserId));
    dispatch(miscInfos.getMusicGenres());
    dispatch(miscInfos.getRoles());
    dispatch(miscInfos.getAvailabilityStatuses());
    dispatch(miscInfos.getAvailabilityItems());
    dispatch(miscInfos.getAvailabilityFocuses());
  }, [dispatch, loggedUserId]);

  const userSelectedGenres = user.genres?.map(e => { return e.idGenre });
  const musicGenresList = genres?.list
    // .filter(e => !userSelectedGenres.includes(e.id))
    .map(genre => ({ 
      label: genre.name,
      value: String(genre.id),
      disabled: userSelectedGenres.includes(genre.id),
      categoryId: genre.categoryId
    }));

  const [modalGenresIsOpen, setModalGenresIsOpen] = useState(false)

  const userSelectedRoles = user.roles.map(item => item.idRole);
  const rolesListMusicians = roles?.list
    .filter(e => e.instrumentalist)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
      disabled: userSelectedRoles.includes(role.id)
    }));
  const rolesListManagement = roles?.list
    .filter(e => !e.instrumentalist)
    .map(role => ({ 
      label: role.name,
      value: String(role.id),
      disabled: userSelectedRoles.includes(role.id)
    }));

  const [modalRolesIsOpen, setModalRolesIsOpen] = useState(false)

  const availabilityStatuses = availabilityOptions.statuses.map(status => ({ 
    label: status.title,
    value: status.id
  }));

  const availabilityItems = availabilityOptions.items.map(status => ({ 
    label: status.name,
    value: status.id
  }));

  const userSelectedAvailabilityItems = user.availabilityItems.map(item => ({ 
    id: item.idItem
  })).map(function (obj) {
      return obj.id;
  })

  const [modalWorkIsOpen, setModalWorkIsOpen] = useState(false)

  const addGenre = (value) => {
    setIsAddingGenre(true)
    let setMainGenre
    if (!user.genres[0].idGenre) { setMainGenre = 1 } else { setMainGenre = 0 }
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/add/musicGenre', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          userId: loggedUserId, musicGenreId: value, musicGenreMain: setMainGenre
        })
      }).then((response) => {
        console.log(response)
        dispatch(userInfos.getUserGenresInfoById(loggedUserId))
        setIsAddingGenre(false)
        setModalGenresIsOpen(false)
        notifications.show({
          autoClose: 1000,
          title: 'Boa!',
          message: 'O gênero foi adicionado aos seus estilos musicais',
          color: 'lime',
          position: 'top-center'
        })
      }).catch(err => {
        console.error(err);
        setIsAddingGenre(false)
        notifications.show({
          autoClose: 1000,
          title: 'Desculpe...',
          message: 'Ocorreu um erro ao adicionar o gênero. Tente novamente em instantes',
          color: 'red',
          position: 'top-center'
        })
      })
    }, 400)
  }

  const deleteGenre = (value) => {
    setIsDeletingGenre(true)
    fetch('https://mublin.herokuapp.com/user/delete/musicGenre', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userGenreId: value})
    }).then((response) => {
      //console.log(response);
      dispatch(userInfos.getUserGenresInfoById(loggedUserId))
      setIsDeletingGenre(false)
      notifications.show({
        autoClose: 1000,
        title: 'Certo!',
        message: 'O gênero foi removido com sucesso',
        color: 'lime',
        position: 'top-center'
      })
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao remover o gênero")
      setIsDeletingGenre(false)
    })
  }

  const addRole = (value) => {
    setIsAddingRole(true)
    let setMainActivity
    if (!user.roles[0].idRole) { setMainActivity = 1 } else { setMainActivity = 0 }
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/add/role', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          userId: loggedUserId, roleId: value, roleMain: setMainActivity
        })
      }).then((response) => {
        //console.log(response)
        dispatch(userInfos.getUserRolesInfoById(loggedUserId))
        setIsAddingRole(false)
        setModalRolesIsOpen(false)
        notifications.show({
          autoClose: 1000,
          title: 'Boa!',
          message: 'A atividade foi adicionado ao seu perfil',
          color: 'lime',
          position: 'top-center'
        })
      }).catch(err => {
        console.error(err);
        setIsAddingRole(false)
        notifications.show({
          autoClose: 1000,
          title: 'Desculpe...',
          message: 'Ocorreu um erro ao adicionar a atividade. Tente novamente em instantes',
          color: 'red',
          position: 'top-center'
        })
      })
    }, 400);
  }

  const deleteRole = (value) => {
    setIsDeletingRole(true)
    fetch('https://mublin.herokuapp.com/user/delete/role', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userRoleId: value})
    }).then((response) => {
      //console.log(response)
      dispatch(userInfos.getUserRolesInfoById(loggedUserId))
      setIsDeletingRole(false)
      notifications.show({
        autoClose: 1000,
        title: 'Certo!',
        message: 'A atividade foi removida com sucesso',
        color: 'lime',
        position: 'top-center'
      })
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao remover a atividade")
      setIsDeletingRole(false)
    })
  }

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          {isLargeScreen && 
            <Grid.Col span={4} pt={20}>
              <SettingsMenu page='preferences' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={14} className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Text 
                mr='10' 
                className='lhNormal'
                truncate='end'
                size='1.10rem'
                fw='600'
              >
                Preferências musicais
              </Text>
            </Flex>
            <Box>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule'>
                <Title order={4}>
                  Gêneros e estilos
                </Title>
                <Text size='xs' c='dimmed'>
                  Principais gêneros musicais relacionados à minha atuação na música
                </Text>
                {(user.requesting || isDeletingGenre) ? (
                  <Flex gap={7} mt={10}>
                    <Skeleton width={70} height={20} radius="xl" />
                    <Skeleton width={70} height={20} radius="xl" />
                    <Skeleton width={70} height={20} radius="xl" />
                  </Flex>
                ) : (
                  <>
                    <Flex gap={4} my={10}>
                      {user.genres[0].id ? user.genres.map((genre, key) =>
                        <Badge 
                          key={key}
                          color="violet"
                          variant='filled'
                          size='sm'
                          rightSection={
                            <IconX 
                              style={xIconStyle} 
                              stroke={3} 
                              onClick={() => deleteGenre(genre.id)} 
                              title='Remover'
                            />
                          }
                        >
                          {genre.name}
                        </Badge>
                      ) : (<Text size='sm'>Nenhum gênero cadastrado</Text>)}
                    </Flex>
                    <Button 
                      size='sm' 
                      variant='light' 
                      color='violet'
                      my={4}
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setModalGenresIsOpen(true)}
                    >
                      Adicionar novo gênero/estilo
                    </Button>
                  </>
                )}
                <Modal
                  size='sm'
                  opened={modalGenresIsOpen}
                  onClose={() => setModalGenresIsOpen(false)}
                  title='Adicionar novo gênero musical'
                  centered
                >
                  <NativeSelect
                    size='md'
                    placeholder='Selecione...'
                    onChange={(e) => addGenre(e.currentTarget.value)}
                    disabled={isAddingGenre}
                  >
                    <option value=''>
                      {genres.requesting ? "Carregando..." : "Selecione"}
                    </option>
                    {genresCategories.map((category, key) => 
                      <optgroup label={category.name_ptbr} key={key}>
                        {musicGenresList
                          .filter(e => e.categoryId === category.id)
                          .map((genre, key) => 
                            <option key={key} disabled={genre.disabled} value={genre.value}>
                              {genre.label}
                            </option>
                        )}
                      </optgroup>
                    )}
                  </NativeSelect>
                </Modal>
              </Card>
              <Card shadow='sm' p={14} withBorder className='mublinModule'>
                <Title order={4}>
                  Atuação na música
                </Title>
                <Text size='xs' c='dimmed'>
                  Minhas principais atividades e atuações na música
                </Text>
                {user.requesting ? (
                  <Flex gap={7} mt={10}>
                    <Skeleton width={70} height={20} radius="xl" />
                    <Skeleton width={70} height={20} radius="xl" />
                    <Skeleton width={70} height={20} radius="xl" />
                  </Flex>
                ) : (
                  <>
                    <Flex gap={4} my={10}>
                      {user.roles[0].id ? user.roles.map(role =>
                        <Badge 
                          key={role.id}
                          color="violet"
                          variant='filled'
                          size='sm'
                          rightSection={
                            <IconX
                              style={xIconStyle}
                              stroke={3}
                              onClick={() => deleteRole(role.id)}
                              title='Remover'
                            />
                          }
                        >
                          {role.name}
                        </Badge>
                      ) : (<Text size='sm'>Nenhuma atividade cadastrada</Text>)}
                    </Flex>
                    <Button
                      size='sm'
                      variant='light'
                      color='violet'
                      my={4}
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setModalRolesIsOpen(true)}
                    >
                      Adicionar nova atividade
                    </Button>
                  </>
                )}
                <Modal
                  size='sm'
                  opened={modalRolesIsOpen}
                  onClose={() => setModalRolesIsOpen(false)}
                  title='Adicionar nova atividade'
                  centered
                >
                  <NativeSelect
                    size='md'
                    placeholder='Selecione...'
                    onChange={(e) => addRole(e.currentTarget.value)}
                    disabled={isAddingRole}
                    data={[
                      { label: roles.requesting ? 'Carregando...' : 'Selecione', value: '' },
                      { group: 'Gestão, produção e outros', items: rolesListManagement },
                      { group: 'Instrumentos', items: rolesListMusicians },
                    ]}
                  />
                </Modal>
              </Card>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsMusicalPreferences