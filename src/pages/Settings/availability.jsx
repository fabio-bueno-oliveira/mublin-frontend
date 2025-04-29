import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userActions } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { Grid, Container, Modal, Card, NativeSelect, Group, Radio, Box, Flex, Badge, Button, Title, Text, TextInput, Indicator, Avatar, Checkbox } from '@mantine/core'
import { IconChevronLeft, IconPlus, IconX } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'

function SettingsAvailability () {

  document.title = 'Disponibilidade | Mublin'

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const user = useSelector(state => state.user)
  const availabilityOptions = useSelector(state => state.availabilityOptions)

  // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  const [isLoading, setIsLoading] = useState(false)

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const xIconStyle = { width: '10px', height: '10px', cursor:'pointer' }

  useEffect(() => { 
    dispatch(userActions.getInfo())
    dispatch(userActions.getUserAvailabilityItemsById(loggedUserId))
    dispatch(miscInfos.getAvailabilityStatuses())
    dispatch(miscInfos.getAvailabilityItems())
    dispatch(miscInfos.getAvailabilityFocuses())
  }, [dispatch, loggedUserId])

  const availabilityStatuses = availabilityOptions.statuses.map(status => ({ 
    label: status.title,
    value: status.id
  }));

  const availabilityItems = availabilityOptions.items.map(status => ({ 
    label: status.name,
    value: status.id
  }));

  // const userSelectedAvailabilityItems = user.availabilityItems.map(item => ({ 
  //   id: item.idItem
  // })).map(function (obj) {
  //     return obj.id;
  // });

  const [modalWorkIsOpen, setModalWorkIsOpen] = useState(false)

  const addAvailabilityItem = (availabilityItemId) => {
    fetch('https://mublin.herokuapp.com/user/userAvailabilityItem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, availabilityItemId: availabilityItemId})
    }).then((response) => {
      dispatch(userActions.getUserAvailabilityItemsById(loggedUserId));
    }).catch(err => {
      console.error(err)
      alert('Ocorreu um erro ao adicionar o item')
    })
  }

  const deleteAvailabilityItem = (userItemId) => {
    fetch('https://mublin.herokuapp.com/user/userAvailabilityItem', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({userId: loggedUserId, userItemId: userItemId})
    }).then((response) => {
      dispatch(userActions.getUserAvailabilityItemsById(loggedUserId));
    }).catch(err => {
      console.error(err)
      alert('Ocorreu um erro ao remover o item')
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
        dispatch(userActions.getInfo())
        setIsLoading(false)
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao atualizar o status de disponibilidade')
      })
    }, 400);
  }

  const updateAvailabilityFocus = (focusId) => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/updateAvailabilityFocus', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({userId: loggedUserId, availabilityFocus: focusId})
      }).then((response) => {
        dispatch(userActions.getInfo())
        setIsLoading(false)
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao atualizar a disponibilidade de foco de carreira')
      })
    }, 400);
  }

  const [showOpenToWork, setShowOpenToWork] = useState(user.openToWork)
  const [openToWorkText, setOpenToWorkText] = useState(user.openToWorkText)

  useEffect(() => { 
    setShowOpenToWork(user.openToWork)
    setOpenToWorkText(user.openToWorkText)
  }, [user.success])

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          <Grid.Col span={4} pt={20} className='showOnlyInLargeScreen'>
            <SettingsMenu page='availability' />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={6} className='showOnlyInMobile'>
              <IconChevronLeft 
                style={{width:'21px',height:'21px'}} 
                onClick={() => navigate(-1)}
              />
              <Flex gap={2} direction='column'>
                <Text 
                  mr='10' 
                  className='lhNormal'
                  truncate='end'
                  size='1.10rem'
                  fw='600'
                >
                  Disponibilidade
                </Text>
                <Text size='sm' c='dimmed' mb={14}>
                  Minha disponibilidade atual para trabalhos e projetos
                </Text>
              </Flex>
            </Flex>
            <Box>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule' display='block'>
                <Title order={4}>
                  Selo Open to Work
                </Title>
                <Text mb={8}  size='xs' c='dimmed'>
                  Selo de disponibilidade abaixo da minha foto
                </Text>
                <Checkbox
                  my={8}
                  checked={showOpenToWork}
                  label='Exibir selo de disponibilidade abaixo da minha foto'
                  onChange={(event) => setShowOpenToWork(event.currentTarget.checked)}
                />
                <Indicator position='bottom-center' inline label={<Text size='0.6rem' >{openToWorkText}</Text>} color='lime' size={18} withBorder disabled={!showOpenToWork}>
                  <Avatar src={user.picture ? cdnBaseURL+'/tr:h-60,w-60,c-maintain_ratio/users/avatars/'+user.picture : undefined} size='60px' />
                </Indicator>
                <TextInput
                  label='Texto do selo (até 12 caracteres)'
                  value={openToWorkText}
                  size='sm'
                  maxLength={12}
                  w={230}
                  onChange={(event) => setOpenToWorkText(event.currentTarget.value)}
                  disabled={!showOpenToWork}
                />
              </Card>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule'>
                <Title order={4}>
                  Status
                </Title>
                <Text size='xs' c='dimmed'>
                  Descrição que representa meu momento atual
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
              </Card>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule'>
                <Title order={5}>
                  Tipos de trabalho:
                </Title>
                <Group gap={3} my={8}>
                  {user.availabilityItems[0].idItem ? ( 
                    user.availabilityItems.map(item =>
                      <Badge 
                        key={item.idItem}
                        color='mublinColor'
                        variant='filled'
                        size='md'
                        rightSection={
                          <IconX 
                            style={xIconStyle} 
                            stroke={3} 
                            onClick={() => deleteAvailabilityItem(item.idItem)} 
                            title='Remover'
                          />
                        }
                      >
                        {item.name}
                      </Badge>
                    )
                  ) : (
                    <Text size='sm' c='dimmed'>Não informado</Text>
                  )}
                </Group>
                <Button
                  size='sm'
                  variant='light'
                  color='mublinColor'
                  mt={10}
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
                    placeholder='Selecione'
                    onChange={(e) => addAvailabilityItem(e.currentTarget.value)}
                    data={availabilityItems}
                    defaultValue={user.availabilityStatus}
                  />
                </Modal>
              </Card>
              <Card shadow='sm' p={14} withBorder mb={20} className='mublinModule'>
                <Title order={5} >Vínculo de preferência:</Title>
                <Radio
                  my={2}
                  color='mublinColor'
                  value='1'
                  label='Projetos próprios e autorais'
                  onClick={() => updateAvailabilityFocus(1)}
                  checked={user.availabilityFocus === 1 && true}
                  disabled={isLoading || user.requesting}
                />
                <Radio
                  my={2}
                  color='mublinColor'
                  value='2'
                  label='Contrato (convidado/sideman/sidewoman/sub)'
                  onClick={() => updateAvailabilityFocus(2)}
                  checked={user.availabilityFocus === 2 && true}
                  disabled={isLoading || user.requesting}
                />
                <Radio 
                  my={2}
                  color='mublinColor'
                  value='3'
                  label='Todos (próprios e contratado)'
                  onClick={() => updateAvailabilityFocus(3)}
                  checked={user.availabilityFocus === 3 && true}
                  disabled={isLoading || user.requesting}
                />
              </Card>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsAvailability