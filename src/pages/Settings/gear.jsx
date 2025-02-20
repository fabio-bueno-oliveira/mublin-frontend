import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/user'
import { Grid, Container, Modal, Card, Paper, Center, Group, Flex, Alert, Loader, Box, Image, NativeSelect, Button, Radio, Text, Title, Avatar, Anchor, Checkbox, TextInput, Textarea, em, Divider } from '@mantine/core'
import { IconToggleRightFilled, IconToggleLeft, IconPlus, IconChevronLeft, IconLockSquareRoundedFilled, IconPencil, IconTrash } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { CurrencyInput } from 'react-currency-mask'
import { truncateString } from '../../utils/formatter'

function SettingsMyGearPage () {

  let dispatch = useDispatch()
  let navigate = useNavigate()

  document.title = 'Meu equipamento | Mublin'

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token);
  const loggedUserId = decoded.result.id;

  const user = useSelector(state => state.user)

  const requesting = useSelector(state => state.user.gearRequesting)
  const gear = useSelector(state => state.user.gear).filter((p) => { return p.is_subproduct === 0 })
  const subGear = useSelector(state => state.user.gear).filter((p) => { return p.is_subproduct === 1 })

  useEffect(() => { 
    dispatch(userActions.getUserGearInfoById(loggedUserId))
  }, [dispatch, loggedUserId])

  const [isLoaded, setIsLoaded] = useState(false)
  const [brands, setBrands] = useState([])
  const [tuningTypes, setTuningTypes] = useState([])
  const [categories, setCategories] = useState([])

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  // Modal Add New Gear
  const [modalAddNewProductOpen, setModalAddNewProductOpen] = useState(false)
  const [brandSelected, setBrandSelected] = useState('')
  const [categorySelected, setCategorySelected] = useState('')
  const [products, setProducts] = useState([])
  const [productSelected, setProductSelected] = useState('')
  const [loadingAddNewProduct, setLoadingAddNewProduct] = useState(false)
  const [shareNewProductOnFeed, setShareNewProductOnFeed] = useState(true)
  const productInfo = products.filter((product) => { return product.id === Number(productSelected)}) 

  const selectBrand = (brandId) => {
      setBrandSelected(brandId)
      setCategories([])
      setCategorySelected('')
      setProducts([])
      setProductSelected('')
      getCategories(brandId)
  }
  const selectCategory = (categoryId) => {
      setProductSelected('')
      setCategorySelected(categoryId)
      getProducts(brandSelected,categoryId)
  }

  const sendToFeed = (productId) => {
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/feed/newFeedPostGear', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({id_item_fk: productId})
      })
    }, 300);
  }

  const addProductToMyGear = (productId, featured, for_sale, price, currently_using) => {
    setLoadingAddNewProduct(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/addGearItem', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
      }).then((response) => {
        dispatch(userActions.getUserGearInfoById(loggedUserId))
        setLoadingAddNewProduct(false)
        setModalAddNewProductOpen(false)
        setBrandSelected('')
        setCategorySelected('')
        setProductSelected('')
        if (shareNewProductOnFeed) {
          sendToFeed(productId)
        }
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao adicionar o produto")
        setLoadingAddNewProduct(false)
      })
    }, 300);
  }

  useEffect(() => {
    fetch("https://mublin.herokuapp.com/gear/brands")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setBrands(result)
        },
        (error) => {
          setIsLoaded(true)
          console.error(error)
        }
      )

    fetch("https://mublin.herokuapp.com/gear/tuning")
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

  const getCategories = (brandId) => {
    setIsLoaded(false);
    fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/categories")
      .then(res => res.json())
      .then(
      (result) => {
        setIsLoaded(true);
        setCategories(result);
      },
      (error) => {
        setIsLoaded(true);
        console.error(error);
      }
    )
  }

  const getProducts = (brandId, categoryId) => {
    setIsLoaded(false);
    fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/"+categoryId+"/products")
      .then(res => res.json())
      .then(
        (result) => {
            setIsLoaded(true);
            setProducts(result);
        },
        (error) => {
            setIsLoaded(true);
            console.error(error);
        }
      )
  }

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

  const editGearItem = (itemId, productId, featured, for_sale, price, currently_using, tuning, owner_comments) => {
    setIsLoaded(false)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/updateGearItem', {
        method: 'put',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({id: itemId, productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using, tuning: tuning, owner_comments: owner_comments})
      }).then((response) => {
        dispatch(userActions.getUserGearInfoById(loggedUserId));
        setIsLoaded(true)
        setModalEditItemOpen(false)
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao editar os dados do equipamento')
        setIsLoaded(true)
      })
    }, 300);
  }

  // Remove product from list
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)
  const [itemToRemove, setItemToRemove] = useState({id: '', name: ''})
  const openModalConfirmation = (productId, brandName, productName) => {
    setModalConfirmDelete(true)
    setItemToRemove({id: productId, brand: brandName, name: productName})
  }
  const deleteGear = (userGearId) => {
    setLoadingRemove(true)
    fetch('https://mublin.herokuapp.com/user/'+userGearId+'/deleteGearItem', {
      method: 'delete',
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
      alert("Ocorreu um erro ao remover o item")
      setLoadingRemove(false)
      setModalConfirmDelete(false)
    })
  }

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
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
              <Card 
                shadow='sm' 
                p={14} 
                withBorder 
                mb={20} 
                display='block' 
                className='mublinModule'
              >
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }} className='showOnlyInLargeScreen'>
                    <Title order={4} className='showOnlyInLargeScreen'>
                      Gerenciar meu equipamento
                    </Title>
                    <Text size='sm' c='dimmed' mb={14}>
                      Adicionar, remover ou editar itens
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 6 }} ta={isMobile ? 'left' : 'right'}>
                    {user.plan === 'Pro' ? (
                      <Button
                        leftSection={<IconPlus size={14} />}
                        color='mublinColor'
                        size='md'
                        fullWidth={isMobile ? true : false}
                        onClick={() => setModalAddNewProductOpen(true)} disabled={!isLoaded}
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
                      <Text size='sm'>
                        Apenas usuários com plano PRO podem adicionar e exibir marcas parceiras.
                      </Text>
                      <Anchor
                        fw='420'
                        fz='sm'
                        href='/pro'
                        underline='hover'
                        variant="gradient"
                        gradient={{ from: '#969168', to: '#b4ae86', deg: 90 }}
                      >
                        Assine o Mublin PRO!
                      </Anchor>
                    </Flex>
                  </Group>
                }
                <Divider my={12} />
                <Grid mt={6}>
                  {gear.map((item, key) => (
                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }} key={key}>
                      <Paper
                        radius='md'
                        withBorder
                        px='16'
                        pt='14'
                        pb='7'
                        mb='4'
                        className='mublinModule'
                      >
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
                        <Box>
                          <Text size='xs' c='dimmed' ta='center' truncate="end">
                            {item.category} • {item.brandName}
                          </Text>
                          <Text size='sm' mb='1' ta='center' truncate="end">
                            {item.productName}
                          </Text>
                          <Group mt={6} gap={5}>
                            {item.featured ? (
                              <IconToggleRightFilled color='green' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='sm'>Em destaque</Text>
                          </Group>
                          <Group gap={5}>
                            {item.currentlyUsing ? (
                              <IconToggleRightFilled color='green' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='sm'>Em uso</Text>
                          </Group>
                          <Group gap={5}>
                            {item.forSale ? (
                              <IconToggleRightFilled color='green' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='sm'>À venda</Text>
                            <Text size='xs' c='dimmed'>
                              {!!item.forSale && '('+item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})+')'}
                            </Text>
                          </Group>
                        </Box> 
                        <Flex mt='10' gap={8} justify='space-between'>
                          <Button 
                            size='sm'
                            color='mublinColor'
                            fullWidth
                            fw='440'
                            onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing, item.tuningId, item.ownerComments, item.macroCategory)}
                          >
                            Editar
                          </Button>
                          <Button 
                            size='sm'
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
                      <Divider my={10} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Card>
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
        title='Adicionar novo equipamento'
        opened={modalAddNewProductOpen} 
        onClose={() => setModalAddNewProductOpen(false)} 
        size='sm'
      >
        <NativeSelect
          withAsterisk
          label='Marca'
          onChange={(e) => selectBrand(e.target.options[e.target.selectedIndex].value)}
          value={brandSelected}
          defaultValue={brandSelected}
        >
          {!brandSelected &&
            <option>Selecione</option>
          } 
          {brands.map((brand,key) =>
            <option key={key} value={brand.id}>{brand.name}</option>
          )}
        </NativeSelect>
        <NativeSelect
          withAsterisk
          label='Categoria'
          onChange={(e) => selectCategory(e.target.options[e.target.selectedIndex].value)}
          value={categorySelected}
          defaultValue={categorySelected}
        >
          {!isLoaded && 
            <option>Carregando...</option>
          }
          {!categorySelected && 
            <option>{!brandSelected ? 'Selecione primeiro a marca' : 'Selecione a categoria'}</option>
          } 
          {categories.map((category,key) =>
            <option key={key} value={category.id}>{category.name}</option>
          )}
        </NativeSelect>
        <NativeSelect
          withAsterisk
          label='Produto'
          onChange={(e) => setProductSelected(e.target.options[e.target.selectedIndex].value)}
          value={productSelected}
        >
          {!isLoaded && 
            <option>Carregando...</option>
          }
          {!productSelected && 
            <option value=''>{!categorySelected ? 'Selecione primeiro a categoria' : 'Selecione o produto'}</option>
          }
          {products.map((product,key) =>
            <option key={key} value={product.id} disabled={!!gear.filter((x) => { return x.productId === Number(product.id)}).length}>{product.name} {product.colorName && product.colorName} {!!gear.filter((x) => { return x.productId === Number(product.id)}).length && '(adicionado)'}</option>
          )}
        </NativeSelect>
        {loggedUserId === 1 &&
          <Anchor href='/settings/submit-product' underline='hover'>
            <Text mt='xs' c='primary' ta='right' size='xs'>
              Não encontrei meu produto na lista
            </Text>
          </Anchor>
        }
        {(productSelected && productInfo) ? (
          <Center p={12}>
            <Image 
              radius='md'
              h={150}
              w={150}
              src={productInfo[0].picture} 
            />
          </Center>
        ) : (
          <Center mt={14} mb={20}>
            <Card w='120' p={4}>
              <Text size='sm' ta='center' c='dimmed'>
                Selecione o produto para carregar a imagem
              </Text>
            </Card>
          </Center>
        )}
        <Flex justify='flex-end'>
          <Checkbox
            label='Compartilhar no feed'
            checked={shareNewProductOnFeed ? true : false}
            onChange={() => setShareNewProductOnFeed(value => !value)}
          />
        </Flex>
        <Group justify='flex-end' gap={7} mt={16}>
          <Button variant='outline' color='mublinColor' size='sm' onClick={() => setModalAddNewProductOpen(false)}>
            Cancelar
          </Button>
          <Button color='mublinColor' size='sm' onClick={() => addProductToMyGear(productSelected, 0, 0, null, 1)} disabled={!productSelected ? true : false} loading={loadingAddNewProduct}>
            Salvar
          </Button>
        </Group>
      </Modal>
      <Modal
        title='Editar detalhes do meu item'
        centered
        fullScreen={isMobile}
        opened={modalEditItemOpen}
        onClose={() => setModalEditItemOpen(false)}
        size='sm'
      >
        <>
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
                {!brandSelected &&
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
              <Divider mt="xs" label="Sub itens relacionados" labelPosition="left" />
              <Flex gap={8}>
                <Avatar
                  size={50}
                  mt={6}
                  color='mublinColor' radius='md'
                  className='point'
                  // onClick={() => navigate('/new/')}
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
              <Group justify='flex-end' gap={7} mt={20}>
                <Button variant='outline' color='mublinColor' size='sm' onClick={() => setModalEditItemOpen(false)}>
                  Cancelar
                </Button>
                <Button color='mublinColor' size='sm' disabled={(for_sale === '1' && !price) ? true : false} onClick={() => editGearItem(itemIdToEdit, modalItemManagementProductId, featured, for_sale, price, currently_using, productDetail.tuning, productDetail.ownerComments)} loading={!isLoaded}>
                  Salvar
                </Button>
              </Group>
            </Box>
          )}
        </>
      </Modal>
      {!modalEditItemOpen && 
        <FooterMenuMobile />
      }
    </>
  );
};

export default SettingsMyGearPage;