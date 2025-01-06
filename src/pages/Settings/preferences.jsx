import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { userInfos } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { Grid, Container, Modal, Card, NativeSelect, Group, Radio, Box, Flex, Badge, Button, Title, Text, Anchor, Divider } from '@mantine/core'
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

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const [isLoading, setIsLoading] = useState(false)

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
  });

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
        //console.log(response);
        dispatch(userInfos.getUserGenresInfoById(loggedUserId));
        setIsAddingGenre(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao adicionar o gênero");
        setIsAddingGenre(false);
      })
    }, 400);
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
      dispatch(userInfos.getUserGenresInfoById(loggedUserId));
      setIsDeletingGenre(false);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao remover o gênero");
      setIsDeletingGenre(false);
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
        //console.log(response);
        dispatch(userInfos.getUserRolesInfoById(loggedUserId));
        setIsAddingRole(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao adicionar a atividade");
        setIsAddingRole(false);
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
      //console.log(response);
      dispatch(userInfos.getUserRolesInfoById(loggedUserId));
      setIsDeletingRole(false);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao remover a atividade");
      setIsDeletingRole(false);
    })
  }

  const addAvailabilityItem = (availabilityItemId) => {
    fetch('https://mublin.herokuapp.com/user/userAvailabilityItem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({userId: user.id, availabilityItemId: availabilityItemId})
    }).then((response) => {
      dispatch(userInfos.getUserAvailabilityItemsById(user.id));
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao adicionar o item")
    })
  }

  const updateAvailabilityStatus = (availabilityStatusId) => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/updateAvailabilityStatus', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({userId: loggedUserId, availabilityStatusId: availabilityStatusId})
      }).then((response) => {
        dispatch(userInfos.getInfo())
        setIsLoading(false)
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao atualizar o status de disponibilidade")
      })
    }, 400);
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
                  Disponibilidade
                </Title>
                <Text size='xs' c='dimmed'>
                  Minha disponibilidade atual para trabalhos e projetos
                </Text>
                <NativeSelect
                  size='md'
                  mt={8}
                  placeholder='Selecione'
                  onChange={(e) => updateAvailabilityStatus(e.currentTarget.value)}
                  data={availabilityStatuses}
                  value={user.availabilityStatus}
                  disabled={isLoading}
                />
                <Box>
                  <Divider my={10} />
                  <Title order={5} mt={10}>
                    Trabalhos:
                  </Title>
                  {/* {alert(JSON.stringify(availabilityItemsSelected, null, 2))} */}
                  <Group gap={3} my={8}>
                    {user.availabilityItems.map(item =>
                      <Badge 
                        key={item.idItem}
                        color="violet"
                        variant='filled'
                        size='sm'
                        rightSection={
                          <IconX 
                            style={xIconStyle} 
                            stroke={3} 
                            onClick={() => deleteGenre(item.idItem)} 
                            title='Remover'
                          />
                        }
                      >
                        {item.name}
                      </Badge>
                    )}
                  </Group>
                  <Button
                    size='sm'
                    variant='light'
                    color='violet'
                    my={4}
                    leftSection={<IconPlus size={14} />}
                    onClick={() => setModalWorkIsOpen(true)}
                    fullWidth
                  >
                    Adicionar novo trabalho
                  </Button>
                  <Modal
                    size='sm'
                    opened={modalWorkIsOpen}
                    onClose={() => setModalWorkIsOpen(false)}
                    title='Adicionar novo tipo de trabalho'
                    centered
                  >
                    <NativeSelect
                      size='md'
                      mt={8}
                      placeholder='Selecione'
                      onChange={(e) => addAvailabilityItem(e.currentTarget.value)}
                      data={availabilityItems}
                      defaultValue={user.availabilityStatus}
                    />
                  </Modal>
                  <Title order={5} mt={10}>Vínculo de preferência:</Title>
                  <Radio.Group
                    value={userSelectedAvailabilityItems}
                    onChange={updateAvailabilityStatus}
                    name="availabilityFocus"
                  >
                    <Radio my={2} value='1' label="Projetos próprios e autorais" />
                    <Radio my={2} value='2' label="Contrato (convidado/sideman/sidewoman)" />
                    <Radio my={2} value='3' label="Todos (próprios e contratado)" />
                  </Radio.Group>
                  {/* <Form.Group grouped>
                    <Form.Field
                      disabled={user.requesting}
                      label='Projetos próprios'
                      control='input'
                      type='radio'
                      name='availabilityFocus'
                      value={1}
                      checked={user.availabilityFocus === 1 && true}
                      onClick={() => updateAvailabilityFocus(1)}
                    />
                    <Form.Field
                      disabled={user.requesting}
                      label='Outros projetos (convidado)'
                      control='input'
                      type='radio'
                      name='availabilityFocus'
                      value={2}
                      checked={user.availabilityFocus === 2 && true}
                      onClick={() => updateAvailabilityFocus(2)}
                    />
                    <Form.Field
                      disabled={user.requesting}
                      label='Todos os projetos (próprios e convidado)'
                      control='input'
                      type='radio'
                      name='availabilityFocus'
                      value={3}
                      checked={user.availabilityFocus === 3 && true}
                      onClick={() => updateAvailabilityFocus(3)}
                    />
                  </Form.Group> */}
                </Box>
              </Card>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule'>
                <Title order={4}>
                  Gêneros e estilos
                </Title>
                <Text size='xs' c='dimmed'>
                  Principais gêneros musicais relacionados à minha atuação na música
                </Text>
                <Flex gap={4} my={10}>
                  {user.genres.map((genre, key) =>
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
                  )}
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
                <Flex gap={4} my={10}>
                  {user.roles.map(role =>
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
                  )}
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