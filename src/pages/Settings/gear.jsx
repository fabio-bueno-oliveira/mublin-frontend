import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/user'
import { Grid, Container, Modal, Card, Paper, Center, Group, Flex, Loader, Box, Image, NativeSelect, Button, Radio, Text, Title, Avatar, Anchor, ActionIcon, NumberInput, TextInput, Textarea, Input, em, Divider, ScrollArea, Drawer, Collapse } from '@mantine/core'
import { IconPlus, IconChevronLeft, IconLockSquareRoundedFilled, IconRoute, IconPackages, IconPencil, IconTrash, IconSquare, IconSquareCheckFilled, IconCamera, IconMinus } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { CurrencyInput } from 'react-currency-mask'
import { truncateString } from '../../utils/formatter'
import { IKUpload } from 'imagekitio-react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'

function SettingsMyGearPage () {

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const user = useSelector(state => state.user)

  const requesting = useSelector(state => state.user.gearRequesting)
  const gear = useSelector(state => state.user.gear).filter((p) => { return p.is_subproduct === 0 })
  const subGear = useSelector(state => state.user.gear).filter((p) => { return p.is_subproduct === 1 })

  useEffect(() => { 
    dispatch(userActions.getUserGearInfoById(loggedUserId))
    dispatch(userActions.getUserGearSetups())
  }, [dispatch, loggedUserId])

  const [isLoading, setIsLoading] = useState(false)
  const [tuningTypes, setTuningTypes] = useState([])

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  // Modal Add New Gear
  const [products, setProducts] = useState([])
  const [productSelected, setProductSelected] = useState('')
  const productInfo = products.filter((product) => { return product.id === Number(productSelected)}) 

  useEffect(() => {
    fetch('https://mublin.herokuapp.com/gear/tuning')
      .then(res => res.json())
      .then(
        (result) => {
          setTuningTypes(result)
        },
        (error) => {
          console.error(error)
        }
      )
  }, [])

  // Edit item
  const [modalEditItemOpen, setModalEditItemOpen] = useState(false)
  const [modalItemManagementProductId, setModalItemManagementProductId] = useState(null)
  
  const [featured, setFeatured] = useState('')
  const [for_sale, setForSale] = useState('')
  const [price, setPrice] = useState('')
  const [currently_using, setCurrentlyUsing] = useState('')

  const [productDetail, setProductDetail] = useState(
    { ownerComments: '', macroCategory: '', tuning: '' }
  )

  const [itemIdToEdit, setItemIdToEdit] = useState('')
  const openModalItemManagement = (itemId, productId, featured, for_sale, price, currently_using, tuning, owner_comments, macroCategory) => {
      setModalItemManagementProductId(productId)
      setItemIdToEdit(itemId)
      setModalEditItemOpen(true)
      setFeatured(featured)
      setForSale(for_sale)
      setPrice(price)
      setCurrentlyUsing(currently_using)
      setProductDetail(
        { 
          tuning: tuning,
          ownerComments: owner_comments ? owner_comments : '', 
          macroCategory: macroCategory
        }
      )
  }

  const itemInfo = gear.filter((item) => { return item.productId === modalItemManagementProductId })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const editGearItem = (itemId, productId, featured, for_sale, price, currently_using, tuning, owner_comments) => {
    setIsSubmitting(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/updateGearItem', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({id: itemId, productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using, tuning: tuning, owner_comments: owner_comments})
      }).then((response) => {
        dispatch(userActions.getUserGearInfoById(loggedUserId));
        setIsSubmitting(false)
        setModalEditItemOpen(false)
      }).catch(err => {
        console.error(err)
        setIsSubmitting(false)
        alert('Ocorreu um erro ao editar os dados do equipamento')
      })
    }, 300);
  }

  const [loadingRemove, setLoadingRemove] = useState(false)

  // Remove product from list
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false)
  const [itemToRemove, setItemToRemove] = useState({id: '', name: ''})
  const openModalConfirmation = (productId, brandName, productName) => {
    setModalConfirmDelete(true)
    setItemToRemove({id: productId, brand: brandName, name: productName})
  }
  const deleteGear = (userGearId) => {
    setLoadingRemove(true)
    fetch('https://mublin.herokuapp.com/user/'+userGearId+'/deleteGearItem', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      dispatch(userActions.getUserGearInfoById(loggedUserId))
      setLoadingRemove(false)
      setModalConfirmDelete(false)
    }).catch(err => {
      console.error(err)
      alert('Ocorreu um erro ao remover o item')
      setLoadingRemove(false)
      setModalConfirmDelete(false)
    })
  }

  // Modal Add New Setup
  const [modalAddNewSetupOpen, setModalAddNewSetupOpen] = useState(false)
  const [newSetup, setNewSetup] =  useState({name: '', description: '', image: ''})

  // Upload setup image to ImageKit.io
  const [fileId, setFileId] = useState('')
  const [isUploading, setIsUploading] = useState('')
  const onUploadStart = evt => {
    console.log('Start uplading', evt)
    setIsUploading(true)
  }
  const onUploadError = err => {
    alert('Ocorreu um erro. Tente novamente em alguns minutos.')
    setIsUploading(false)
  }
  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/')
    let fileName = res.filePath.substring(n + 1)
    setFileId(res.fileId)
    setNewSetup({...newSetup, image: fileName})
    setIsUploading(false)
  }
  const handleRemoveImageFromServer = async (fileId) => {
    const url = `https://api.imagekit.io/v1/files/${fileId}`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
      }
    }
    try {
      await fetch(url, options);
    } catch (error) {
      console.error(error);
    }
  }
  const removeImage = () => {
    handleRemoveImageFromServer(fileId)
    setNewSetup({...newSetup, image: ''})
    document.querySelector('#image').value = null
  }

  const createNewSetup = () => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/createNewGearSetup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
          name: newSetup.name, description: newSetup.description, image: newSetup.image 
        })
      }).then((response) => {
        dispatch(userActions.getUserGearSetups())
        setIsLoading(false)
        setModalAddNewSetupOpen(false)
        setNewSetup({name: '', description: '', image: ''})
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao criar o setup')
        setIsLoading(false)
      })
    }, 300);
  }

  // Remove a gear setup
  const [modalConfirmDeleteSetup, setModalConfirmDeleteSetup] = useState(false)
  const [setupToRemove, setSetupToRemove] = useState({id: '', name: ''})
  const openModalConfirmationDeleteSetup = (setupId, setupName) => {
    setModalConfirmDeleteSetup(true)
    setSetupToRemove({id: setupId, name: setupName})
  }
  const deleteSetup = (setupId) => {
    setLoadingRemove(true)
    fetch('https://mublin.herokuapp.com/user/'+setupId+'/deleteGearSetup', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      dispatch(userActions.getUserGearSetups())
      setLoadingRemove(false)
      setModalConfirmDeleteSetup(false)
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao remover este setup. Tente novamente em instantes")
      setLoadingRemove(false)
      setModalConfirmDeleteSetup(false)
    })
  }

  // Edit setup
  const formUpdate = useForm({
    mode: 'controlled',
    initialValues: {
      id: '',
      name: '',
      description: '',
    },

    validate: {
      name: isNotEmpty('Insira um nome para o setup'),
      description: isNotEmpty('Insira uma descrição curta'),
    },
  })
  const [modalEditSetupOpen, setModalEditSetupOpen] = useState(false)

  // Update setup image
  const [modalEditImage, setModalEditImage] = useState({setupId: '', filename: ''})
  const onUploadUpdateStart = evt => {
    console.log('Start uplading', evt)
    setIsUploading(true)
  }
  const onUploadUpdateError = err => {
    console.log(err)
    alert("Ocorreu um erro. Tente novamente em alguns minutos.")
    setIsUploading(false)
  }
  const onUploadUpdateSuccess = res => {
    let n = res.filePath.lastIndexOf('/')
    let fileName = res.filePath.substring(n + 1)
    setModalEditImage({...modalEditImage, filename: fileName})
    setIsUploading(false)
    fetch('https://mublin.herokuapp.com/user/updateGearSetupImage', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        setupId: modalEditImage.setupId, image: fileName
      })
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(userActions.getUserGearSetups())
        notifications.show({
          position: 'top-right',
          color: 'green',
          title: 'Boa!',
          message: 'A imagem do setup foi atualizada!',
        })
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro inesperado ao tentar atualizar a imagem deste setup. Tente novamente em instantes.')
      })
  }
  
  const openModalEditSetup = (id, name, description, image) => {
    dispatch(userActions.getUserGearSetupItems(id))
    formUpdate.setValues({ id: id, name: name, description: description })
    setModalEditSetupOpen(true)
    setModalEditImage({setupId: id, filename: image})
  }
  const [setupItemEditing, setSetupItemEditing] = useState({
    id: '', comments: '', orderShow: '', setupId: ''
  })
  const closeModalEditSetup = () => {
    setModalEditSetupOpen(false)
    formUpdate.setValues({ id: '', name: '', description: '' })
    formUpdate.resetTouched()
    setSetupItemEditing({
      id: '', comments: '', orderShow: '', setupId: ''
    })
    setModalEditImage({setupId: '', filename: ''})
  }

  const updateSetup = (values) => {
    setIsLoading(true);
    fetch('https://mublin.herokuapp.com/user/updateGearSetup', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        setupId: values.id, name: values.name, description: values.description
      })
    })
      .then(res => res.json())
      .then((result) => {
        setIsLoading(false)
        notifications.show({
          position: 'top-right',
          color: 'green',
          title: 'Certo!',
          message: 'Os detalhes do setup foram atualizados com sucesso',
        })
        formUpdate.resetTouched()
      }).catch(err => {
        console.error(err)
        setIsLoading(false)
        alert('Ocorreu um erro inesperado ao tentar atualizar os detalhes deste setup. Tente novamente em instantes.')
      })
  }

  const updateSetupItem = (id, comments, orderShow, setupId) => {
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/userInfo/updateSetupGearItem', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({itemId: id, comments: comments ? comments : '', orderShow: orderShow})
      }).then((response) => {
        dispatch(userActions.getUserGearSetupItems(setupId))
        dispatch(userActions.getUserGearSetups())
        setIsLoading(false)
        setSetupItemEditing({
          id: '', comments: '', orderShow: '', setupId: ''
        })
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao editar os dados do item do setup. Tente novamente em instantes.')
        setIsLoading(false)
      })
    }, 300)
  }

  const handleUpdateSetupItem = () => {
    setIsLoading(true)
    updateSetupItem(setupItemEditing.id, setupItemEditing.comments, setupItemEditing.orderShow, setupItemEditing.setupId)
  }

  const [isDeletingSetupItem, setIsDeletingSetupItem] = useState(0)
  const deleteSetupGearItem = (setupId, itemId) => {
    setIsDeletingSetupItem(itemId)
    fetch('https://mublin.herokuapp.com/user/deleteSetupGearItem', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ setupId: setupId, itemId: itemId })
    }).then((response) => {
      dispatch(userActions.getUserGearSetupItems(setupId))
      dispatch(userActions.getUserGearSetups())
      setIsDeletingSetupItem(0)
      notifications.show({
        position: 'top-right',
        color: 'green',
        title: 'Sucesso!',
        message: 'O item foi removido deste setup',
      })
    }).catch(err => {
      console.error(err)
      notifications.show({
        position: 'top-right',
        color: 'red',
        title: 'Deu ruim :(',
        message: 'Ocorreu um erro ao remover este item do setup. Tente novamente em instantes',
      })
      setIsDeletingSetupItem(0)
    })
  }

  // Add item do setup
  const [showItensToAddOnSetup, setShowItensToAddOnSetup] = useState(false)
  const [isAddingItemToSetup, setIsAddingItemToSetup] = useState(false)
  const lastOrderOfSetup = user.gearSetupItems.items.sort((a, b) => a.orderShow - b.orderShow)?.at(-1)?.orderShow
  const addItemToSetup = (productId, setupId) => {
    setIsAddingItemToSetup(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/addItemToSetup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
          setupId: setupId, productId: productId, order: lastOrderOfSetup + 1 
        })
      }).then((response) => {
        dispatch(userActions.getUserGearSetupItems(setupId));
        setShowItensToAddOnSetup(false)
        setIsAddingItemToSetup(false)
        dispatch(userActions.getUserGearSetups())
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao adicionar o item ao setup. Tente novamente em instantes')
        setIsAddingItemToSetup(false)
      })
    }, 300);
  }

  return (
    <>
      <Helmet>
        <title>Meu equipamento | Mublin</title>
        <link rel='canonical' href='https://mublin.com/settings/my-gear' />
      </Helmet>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={110}>
        <Grid mt={isLargeScreen ? 0 : 15}>
          <Grid.Col span={4} pt={20} className='showOnlyInLargeScreen'>
            <SettingsMenu page='myGear' />
          </Grid.Col>
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
                Meu equipamento
              </Text>
            </Flex>
            {requesting ? (
              <Center mt='60'>
                <Loader color='mublinColor' />
              </Center>
            ) : (
              <>
                <Card 
                  shadow={false}
                  p={14} 
                  withBorder 
                  mb={10} 
                  display='block' 
                  className='mublinModule'
                >
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
                      <Group gap={4} align='center'>
                        <IconRoute size={16} />
                        <Title order={4}>
                          Meus setups ({user.gearSetups.total})
                        </Title>
                      </Group>
                      <Text size='sm' c='dimmed' mb={isMobile ? 0 : 12}>
                        Grupos de equipamentos utilizados em apresentações
                      </Text>
                    </Grid.Col>
                    <Grid.Col 
                      span={{ base: 12, md: 3, lg: 3 }}
                      pb={isMobile ? 22 : 0}
                    >
                      <Button
                        leftSection={<IconPlus size={14} />}
                        color='mublinColor'
                        size='sm'
                        fullWidth={isMobile ? true : false}
                        onClick={user.plan === 'Pro' ? () => setModalAddNewSetupOpen(true) : undefined}
                        disabled={user.plan === 'Free'}
                      >
                        Criar novo setup
                      </Button>
                    </Grid.Col>
                  </Grid>
                  {user.gearSetups.total === 0 ? (
                    <Text size='sm'>
                      Nenhum setup cadastrado no momento
                    </Text>
                  ) : (
                    <Splide 
                      options={{
                        drag: 'free',
                        snap: false,
                        perPage: isMobile ? 3 : 6,
                        autoWidth: false,
                        arrows: false,
                        gap: '22px',
                        dots: true,
                        pagination: true,
                      }}
                    >
                      {user.gearSetups.result.map(setup =>
                        <SplideSlide key={setup.id}>
                          <Flex direction='column' gap={2}>
                            <Center>
                              <Image
                                src={setup.image ? 'https://ik.imagekit.io/mublin/users/gear-setups/tr:w-120,h-120/'+setup.image : 'https://ik.imagekit.io/mublin/bg/tr:w-120,h-120/blue-soft_1_.jpg'}
                                opacity={setup.image ? 1 : 0.5}
                                h={60}
                                mah={60}
                                w='auto'
                                fit='contain'
                                radius='md'
                                className='point'
                                onClick={() => openModalEditSetup(setup.id, setup.name, setup.description, setup.image)}
                              />
                            </Center>
                            <Text
                              w='100%'
                              truncate='end'
                              ta='center'
                              fw={550}
                              size='xs'
                              className='lhNormal'
                            >
                              {setup.name}
                            </Text>
                            <Text ta='center' size='xs' className='lhNormal'>
                              {setup.totalItems} itens
                            </Text>
                            <Center mt={5}>
                              <ActionIcon.Group>
                                <ActionIcon variant='default' size='lg' aria-label='Editar'
                                  onClick={() => 
                                    openModalEditSetup(setup.id, setup.name, setup.description, setup.image)
                                  }
                                >
                                  <IconPencil size={15} stroke={1.8} />
                                </ActionIcon>
                                <ActionIcon variant='default' size='lg' aria-label='Deletar'
                                  onClick={() => openModalConfirmationDeleteSetup(setup.id, setup.name)}
                                >
                                  <IconTrash size={15} stroke={1.8} />
                                </ActionIcon>
                              </ActionIcon.Group>
                            </Center>
                          </Flex>
                        </SplideSlide>
                      )}
                    </Splide>
                  )}
                </Card>
                <Card 
                  shadow='sm' 
                  p={14} 
                  withBorder 
                  mb={20} 
                  display='block' 
                  className='mublinModule'
                >
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Group gap={4} align='center'>
                        <IconPackages size={16} />
                        <Title order={4}>
                          Meu equipamento ({user.gear.length})
                        </Title>
                      </Group>
                      <Text size='sm' c='dimmed' mb={isMobile ? 0 : 12}>
                        Adicionar, remover e editar itens
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }} ta={isMobile ? 'left' : 'right'}>
                      {user.plan === 'Pro' ? (
                        <Button
                          leftSection={<IconPlus size={14} />}
                          color='mublinColor'
                          size='sm'
                          fullWidth={isMobile ? true : false}
                          component='a'
                          href='/new/gear'
                        >
                          Adicionar novo item
                        </Button>
                      ) : (
                        <Button
                          size='md'
                          disabled
                          leftSection={<IconPlus size={14} />}
                          fullWidth={isMobile ? true : false}
                        >
                          Adicionar novo item
                        </Button>
                      )}
                    </Grid.Col>
                  </Grid>
                  {(user.success && user.plan !== 'Pro') && 
                    <Group gap={6}>
                      <IconLockSquareRoundedFilled size={28} />
                      <Flex direction='column' gap={3}>
                        <Text size='sm' className='lhNormal'>
                          Apenas usuários PRO podem adicionar e exibir equipamentos no perfil.
                        </Text>
                        <Anchor
                          fw='550'
                          fz='sm'
                          href='/settings/plan'
                          underline='never'
                        >
                          Clique aqui para assinar o Mublin PRO!
                        </Anchor>
                      </Flex>
                    </Group>
                  }
                  <Divider my={12} />
                  {gear.length === 0 &&
                    <Text mb={14} size='sm'>
                      Nenhum equipamento adicionado no momento
                    </Text>
                  }
                  <Grid mt={6}>
                    {gear.map(item => (
                      <Grid.Col span={{ base: 12, md: 4, lg: 4 }} key={item.id}>
                        <Paper
                          radius='md'
                          withBorder
                          px='16'
                          pt='14'
                          pb='7'
                          mb='4'
                          className='mublinModule'
                        >
                          <Grid>
                            <Grid.Col span={{ base: 4, md: 12, lg: 12 }}>
                              <Center mb='md'>
                                <Image
                                  radius='md'
                                  h={100}
                                  w={100}
                                  src={item.picture ? item.picture : undefined}
                                  className='point'
                                  onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing, item.tuningId, item.ownerComments, item.macroCategory)}
                                />
                              </Center>
                            </Grid.Col>
                            <Grid.Col span={{ base: 8, md: 12, lg: 12 }}>
                              <Box>
                                <Text size='xs' c='dimmed' ta='center' truncate="end">
                                  {item.category} • {item.brandName}
                                </Text>
                                <Text size='sm' mb='1' ta='center' truncate="end">
                                  {item.productName}
                                </Text>
                                <Divider my={8} />
                                <Group align='center' gap={3}>
                                  {item.featured ? (
                                    <IconSquareCheckFilled size={15} color='green' />
                                  ) : (
                                    <IconSquare size={15} color='gray' />
                                  )}
                                  <Text fz='xs'>Em destaque</Text>
                                </Group>
                                <Group mt={6} align='center' gap={3}>
                                  {item.currentlyUsing ? (
                                    <IconSquareCheckFilled size={15} color='green' />
                                  ) : (
                                    <IconSquare size={15} color='gray' />
                                  )}
                                  <Text fz='xs'>Em uso atualmente</Text>
                                </Group>
                                <Group mt={6} align='center' gap={3}>
                                  {item.forSale ? (
                                    <IconSquareCheckFilled size={15} color='green' />
                                  ) : (
                                    <IconSquare size={15} color='gray' />
                                  )}
                                  <Text fz='xs'>
                                    {!!item.forSale ? 'À venda ('+item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})+')' : 'À venda'}
                                  </Text>
                                </Group>
                                <Divider my={8} />
                              </Box> 
                            </Grid.Col>
                          </Grid>
                          <Flex mt='10' gap={8} justify='space-between'>
                            <Button 
                              size='compact-sm'
                              color='mublinColor'
                              fullWidth
                              fw='440'
                              onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing, item.tuningId, item.ownerComments, item.macroCategory)}
                            >
                              Editar
                            </Button>
                            <Button 
                              size='compact-sm'
                              color='primary'
                              variant='outline'
                              fullWidth
                              fw='440'
                              onClick={() => openModalConfirmation(item.id, item.brandName ,item.productName)}
                            >
                              Remover
                            </Button>
                          </Flex>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card>
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Modal
        withCloseButton={false}
        opened={modalConfirmDelete}
        onClose={() => setModalConfirmDelete(false)}
        size='xs'
        centered
      >
        <Text>
          Tem certeza que deseja remover <strong>{itemToRemove.brand} {itemToRemove.name}</strong> do seu equipamento?
        </Text>
        <Group justify='flex-end' gap={7} mt={20}>
          <Button variant='outline' color='gray' size='sm' onClick={() => setModalConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button color='red' size='sm' onClick={() => deleteGear(itemToRemove.id)} loading={loadingRemove}>
            Remover
          </Button>
        </Group>
      </Modal>
      <Modal
        title='Editar detalhes do item'
        size='md'
        centered
        opened={modalEditItemOpen}
        onClose={() => setModalEditItemOpen(false)}
      >
        {modalItemManagementProductId && itemInfo.map((item, key) =>
          <Box key={key}>
            <Center>
              <Image
                radius='md'
                h={100}
                w={100}
                src={item.picture ? item.picture : undefined} 
              />
            </Center>
            <Text ta='center' size='sm' c='dimmed' mt={8}>
              {item.category} • {item.brandName}
            </Text>
            <Text ta='center' size='md' fw='500'>
              {item.productName}
            </Text>
            <Radio.Group
              mt={8}
              value={String(featured)}
              onChange={setFeatured}
              name='editItemFeatured'
              size='md'
              label='Em destaque'
              description='Exibir entre os primeiros'
            >
              <Group mt={4}>
                <Radio size='sm' color='mublinColor' value='1' label='Sim' />
                <Radio size='sm' color='mublinColor' value='0' label='Não' />
              </Group>
            </Radio.Group>
            <Radio.Group
              mt={8}
              size='md'
              value={String(currently_using)}
              onChange={setCurrentlyUsing}
              name='editItemUsing'
              label='Em uso atualmente'
            >
              <Group>
              <Radio size='sm' color='mublinColor' value='1' label='Sim' />
              <Radio size='sm' color='mublinColor' value='0' label='Não' />
              </Group>
            </Radio.Group>
            <NativeSelect
              className={productDetail.macroCategory !== 'chords' ? 'd-none' : undefined}
              mt={8}
              label='Afinação atual'
              defaultValue={productDetail.tuning}
              onChange={(e) => setProductDetail({...productDetail, tuning: e.target.options[e.target.selectedIndex].value})}
            >
              {!productDetail.tuning &&
                <option>Não informado</option>
              } 
              {tuningTypes.map((type) =>
                <option key={type.id} value={type.id}>{type.namePTBR}</option>
              )}
            </NativeSelect>
            <Radio.Group
              mt={6}
              mb={8}
              value={String(for_sale)}
              onChange={setForSale}
              size='md'
              name='editItemForSale'
              label='À venda'
            >
              <Group>
                <Radio size='sm' color='mublinColor' value='1' label='Sim' />
                <Radio size='sm' color='mublinColor' value='0' label='Não' />
                <CurrencyInput
                  value={price}
                  locale='pt-BR'
                  disabled={(for_sale === '1' || for_sale === 1) ? false : true}
                  onChangeValue={(event, originalValue, maskedValue) => {
                    setPrice(originalValue);
                  }}
                  InputElement={<TextInput w='155px' placeholder='Preço de venda' />}
                />
              </Group>
            </Radio.Group>
            <Textarea
              mt={8}
              size='md'
              label='Meus comentários pessoais'
              value={productDetail.ownerComments}
              onChange={(event) => setProductDetail({...productDetail, ownerComments: event.currentTarget.value})}
            />
            <Group justify='flex-end' gap={7} mt={10}>
              <Button variant='outline' color='mublinColor' size='sm' onClick={() => setModalEditItemOpen(false)}>
                Cancelar
              </Button>
              <Button color='mublinColor' size='sm' disabled={(for_sale === '1' && !price) ? true : false} onClick={() => editGearItem(itemIdToEdit, modalItemManagementProductId, featured, for_sale, price, currently_using, productDetail.tuning, productDetail.ownerComments)} loading={isSubmitting}>
                Salvar
              </Button>
            </Group>
            <Divider mt={10} label="Sub itens relacionados" labelPosition="left" />
            <Flex gap={8}>
              <Avatar
                size={50}
                mt={6}
                color='mublinColor' radius='md'
                className='point'
                onClick={() => notifications.show({
                  id: 'addSubItem',
                  autoClose: 2000,
                  position: 'top-right',
                    color: 'red',
                    message: 'Não é possível adicionar sub itens no momento. Em breve esta funcionalidade estará disponível',
                  })
                }
              >
                <IconPlus size="1.5rem" />
              </Avatar>
              {subGear.filter((p) => { return p.parent_product_id === item.id }).map(s =>
                <Flex gap={4} mt={6} align='center' direction='column' key={s.id}>
                  <Image
                    src={s.picture ? s.picture : undefined}
                    h={50}
                    mah={50}
                    w='auto'
                    fit='contain'
                    radius='md'
                  />
                  <Text size='10px'>
                    {truncateString(s.productName, 9)}
                  </Text>
                  <Text size='9px' c='red' className='point'>Remover</Text>
                </Flex>
              )}
            </Flex>
          </Box>
        )}
      </Modal>
      <Modal
        withCloseButton={false}
        opened={modalConfirmDeleteSetup}
        onClose={() => setModalConfirmDeleteSetup(false)}
        size='xs'
        centered
      >
        <Text>
          Tem certeza que deseja remover o setup <strong>{setupToRemove.name}</strong> do seu perfil?
        </Text>
        <Group justify='flex-end' gap={7} mt={20}>
          <Button variant='outline' color='gray' size='sm' onClick={() => setModalConfirmDeleteSetup(false)}>
            Cancelar
          </Button>
          <Button color='red' size='sm' onClick={() => deleteSetup(setupToRemove.id)} loading={loadingRemove}>
            Remover
          </Button>
        </Group>
      </Modal>
      <Modal
        title='Criar novo setup'
        opened={modalAddNewSetupOpen} 
        onClose={() => setModalAddNewSetupOpen(false)} 
        size='sm'
      >
        <TextInput
          required
          label="Nome do setup"
          placeholder="Ex: Acústico"
          maxLength={50}
          value={newSetup.name}
          onChange={(event) => setNewSetup({...newSetup, name: event.currentTarget.value})}
          mb={8}
        />
        <TextInput
          required
          label="Descrição"
          placeholder="Ex: Para apresentações com violão e voz..."
          maxLength={200}
          value={newSetup.description}
          onChange={(event) => setNewSetup({...newSetup, description: event.currentTarget.value})}
          mb={8}
        />
        <Input.Label required>Imagem</Input.Label>
        <Input.Description>
          Escolha uma foto que representa seu setup
        </Input.Description>
        {newSetup.image && 
          <Flex align='flex-end' gap={3} my={8}>
            <Image 
              src={'https://ik.imagekit.io/mublin/tr:h-80,cm-pad_resize,bg-FFFFFF/users/gear-setups/'+newSetup.image} 
              h={80}
              mah={80}
              w='auto'
              fit='contain'
              radius='md'
            />
            <Button 
              size='xs' 
              color='red' 
              onClick={() => removeImage()}
              leftSection={<IconTrash size={14} />}
            >
              Remover
            </Button>
          </Flex>
        }
        {isUploading ? ( 
          <Center>
            <Loader color='mublinColor' mt={6} />
          </Center>
        ) : (
          <Box mt={6} className={newSetup.image ? 'd-none' : ''}>
            <IKUpload 
              id='image'
              style={{fontSize:'13px'}}
              fileName={loggedUserId+'_setup'}
              folder='/users/gear-setups/'
              tags={['setup']}
              useUniqueFileName={true}
              isPrivateFile= {false}
              onUploadStart={onUploadStart}
              onError={onUploadError}
              onSuccess={onUploadSuccess}
              accept='image/x-png,image/gif,image/jpeg'
              transformation={{
                pre: "h-300,w-300"
              }}
            />
          </Box>
        )}
        <Group justify='flex-end' gap={7} mt={16}>
          <Button variant='outline' color='mublinColor' size='sm' onClick={() => setModalAddNewSetupOpen(false)}>
            Cancelar
          </Button>
          <Button color='mublinColor' size='sm' onClick={() => createNewSetup()} disabled={!newSetup.name || !newSetup.description || !newSetup.image} loading={isLoading}>
            Salvar
          </Button>
        </Group>
      </Modal>
      <Drawer 
        opened={modalEditSetupOpen} 
        onClose={() => closeModalEditSetup()}
        title='Editar setup'
        position='right'
      >
        <form onSubmit={formUpdate.onSubmit(updateSetup)}>
          <Center>
            <Image
              src={modalEditImage.filename ? 'https://ik.imagekit.io/mublin/users/gear-setups/tr:w-120,h-120/'+modalEditImage.filename : 'https://ik.imagekit.io/mublin/bg/tr:w-120,h-120/blue-soft_1_.jpg'}
              opacity={modalEditImage.filename ? 1 : 0.5}
              h={55}
              mah={55}
              w='auto'
              fit='contain'
              radius='md'
            />
          </Center>
          <Center>
            <div className='customFileUpload'>
              <IKUpload 
                id='setupImage'
                className='file-input__input'
                style={{fontSize:'13px'}}
                fileName={loggedUserId+'_setup'}
                folder='/users/gear-setups/'
                tags={['setup']}
                useUniqueFileName={true}
                isPrivateFile= {false}
                onUploadStart={onUploadUpdateStart}
                onError={onUploadUpdateError}
                onSuccess={onUploadUpdateSuccess}
                accept='image/x-png,image/gif,image/jpeg'
                transformation={{
                  pre: "h-300,w-300"
                }}
              />
              <Button
                component='label'
                htmlFor='setupImage'
                leftSection={<IconCamera size={14} />}
                color='mublinColor'
                size='xs'
                disabled={isUploading}
              >
                {isUploading ? 'Enviando...' : 'Escolher nova imagem'}
              </Button>
            </div>
          </Center>
          <TextInput
            withAsterisk
            label='Nome do setup'
            placeholder='Ex: Acústico'
            maxLength={50}
            key={formUpdate.key('name')}
            {...formUpdate.getInputProps('name')}
          />
          <TextInput
            withAsterisk
            label='Descrição'
            placeholder='Ex: Para apresentações com violão e voz...'
            maxLength={200}
            key={formUpdate.key('description')}
            {...formUpdate.getInputProps('description')}
          />
          <Group justify='flex-end' gap={7} mt={16}>
            {/* <Button variant='outline' color='mublinColor' size='sm' onClick={() => closeModalEditSetup()}>
              Cancelar
            </Button> */}
            <Button
              type='submit'
              color='mublinColor'
              size='sm'
              disabled={!formUpdate.isTouched()}
              loading={isLoading}
            >
              Salvar
            </Button>
          </Group>
        </form>
        <Divider mt={16} mb={12} />
        <Group mt={10} justify='space-between' align='center'>
          <Text size='sm' fw={500}>
            Itens deste setup ({user.gearSetupItems.total} itens)
          </Text>
          {showItensToAddOnSetup && 
            <ActionIcon variant='light' color='mublinColor'
              onClick={() => setShowItensToAddOnSetup(false)}
            >
              <IconMinus />
            </ActionIcon>
          }
          {!showItensToAddOnSetup && 
            <ActionIcon variant='light' color='mublinColor'
              onClick={() => setShowItensToAddOnSetup(true)}
            >
              <IconPlus />
            </ActionIcon>
          }
        </Group>
        <Collapse in={showItensToAddOnSetup}>
          <NativeSelect
            mt={8}
            onChange={(e) => addItemToSetup(e.currentTarget.value, modalEditImage.setupId)}
            disabled={isAddingItemToSetup}
          >
            <option>Selecione o item para adicionar</option>
            {gear.map(item =>
              <option key={item.id} value={item.productId}
                disabled={user.gearSetupItems.items.some(x => x.id === item.productId)}
              >
                {item.brandName} {item.productName}
              </option>
            )}
          </NativeSelect>
        </Collapse>
        <Box my={14}>
          {user.gearSetupItemsRequesting ? ( 
            <Center>
              <Loader color='mublinColor' type='bars' size='sm' />
            </Center>
          ) : (
            user.gearSetupItems.total > 0 ? ( 
              <Flex gap={6} direction='column'>
                {user.gearSetupItems.items.sort((a, b) => a.orderShow - b.orderShow).map(item =>
                  <Card withBorder radius='md' p={6} key={item.id}>
                    <Flex justify='space-between'>
                      <Group gap={4}>
                        <Anchor
                          href={`/gear/product/${item.id}`}
                        >
                          <Image
                            src={
                              item.selectedColorPicture ? (
                                item.selectedColorPicture ? 'https://ik.imagekit.io/mublin/products/tr:h-100,cm-pad_resize,bg-FFFFFF,fo-x/'+item.selectedColorPicture : undefined
                              ) : (
                                item.picture ? 'https://ik.imagekit.io/mublin/products/tr:h-100,cm-pad_resize,bg-FFFFFF,fo-x/'+item.picture : undefined
                              )
                            }
                            h={50}
                            mah={50}
                            w='auto'
                            fit='contain'
                            radius='md'
                            className='point'
                          />
                        </Anchor>
                        <Flex gap={3} direction='column' justify='flex-start'>
                          <Text fz='10px' className='lh1'>{item.brandName}</Text>
                          <Text fz='xs' className='lh1' fw='500'>{item.name}</Text>
                          <Text fz='11px' className='lh1' c='dimmed'>{item.category}</Text>
                        </Flex>
                      </Group>
                      <Box>
                        <ActionIcon.Group>
                          {setupItemEditing.id !== item.setupItemId && 
                            <ActionIcon
                              variant='default'
                              size='lg'
                              aria-label='Editar'
                              onClick={() => setSetupItemEditing({
                                id: item.setupItemId,
                                comments: item.itemSetupComments,
                                orderShow: item.orderShow,
                                setupId: item.setupId
                              })}
                            >
                              <IconPencil size={15} stroke={1.8} />
                            </ActionIcon>
                          }
                          {setupItemEditing.id === item.setupItemId && 
                            <ActionIcon
                              variant='default'
                              size='lg'
                              aria-label='Salvar'
                              title='Salvar'
                              onClick={() => handleUpdateSetupItem()}
                              loading={isLoading}
                            >
                              <Text size='xs' fw={550}>OK</Text>
                            </ActionIcon>
                          }
                          <ActionIcon 
                            variant='default' 
                            size='lg' 
                            aria-label='Deletar' 
                            title='Remover do setup'
                            onClick={() => deleteSetupGearItem(item.setupId, item.setupItemId)}
                            loading={isDeletingSetupItem === item.setupItemId}
                          >
                            <IconTrash size={15} stroke={1.8} color='red' />
                          </ActionIcon>
                        </ActionIcon.Group>
                      </Box>
                    </Flex>
                    <Group mt={4}>
                      <NumberInput
                        size='sm'
                        label='Ordem'
                        defaultValue={item.orderShow}
                        onChange={(val) => setSetupItemEditing({...setupItemEditing, orderShow: val})}
                        min={1}
                        w={80}
                        disabled={(setupItemEditing.id !== item.setupItemId) || isLoading}
                      />
                      <TextInput
                        size='sm'
                        label='Sobre este item no setup'
                        defaultValue={item.itemSetupComments}
                        onChange={(e) => setSetupItemEditing({...setupItemEditing, comments: e.currentTarget.value})}
                        maxLength={300}
                        w={164}
                        disabled={(setupItemEditing.id !== item.setupItemId) || isLoading}
                      />
                    </Group>
                  </Card>
                )}
              </Flex>
            ) : (
              <Text size='sm' c='dimmed'>
                Nenhum item adicionado a este setup
              </Text>
            )
          )}
        </Box>
      </Drawer>
      {(!modalEditItemOpen && !modalEditSetupOpen) && 
        <FooterMenuMobile />
      }
    </>
  );
};

export default SettingsMyGearPage;