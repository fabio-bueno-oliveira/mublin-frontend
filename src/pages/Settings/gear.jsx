import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userInfos } from '../../store/actions/user'
import { Grid, Container, Modal, Paper, Center, Group, Flex, Alert, Loader, Box, Image, NativeSelect, Button, Radio, Text, Breadcrumbs, Anchor, TextInput, em } from '@mantine/core'
import { IconToggleRightFilled, IconToggleLeft, IconPlus } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { CurrencyInput } from 'react-currency-mask'

function SettingsMyGearPage () {

  const user = useSelector(state => state.user)
  let dispatch = useDispatch()

  document.title = 'Meu equipamento | Mublin'

  let loggedUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { 
    dispatch(userInfos.getUserGearInfoById(loggedUser.id))
  }, [dispatch, loggedUser.id])

  const [isLoaded, setIsLoaded] = useState(false)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const [modalEditOpen, setModalEditOpen] = useState(false)

  // Modal Add New Gear
  const [modalAddNewProductOpen, setModalAddNewProductOpen] = useState(false)
  const [brandSelected, setBrandSelected] = useState('')
  const [categorySelected, setCategorySelected] = useState('')
  const [products, setProducts] = useState([])
  const [productSelected, setProductSelected] = useState('')
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

  const addProductToGear = (productId, featured, for_sale, price, currently_using) => {
    setIsLoaded(false)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/addGearItem', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
      }).then((response) => {
        dispatch(userInfos.getUserGearInfoById(loggedUser.id))
        setIsLoaded(true)
        setModalAddNewProductOpen(false)
        setBrandSelected('')
        setCategorySelected('')
        setProductSelected('')
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao adicionar o produto")
        setIsLoaded(true)
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
          alert(error)
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
        alert(error);
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
            alert(error);
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

  const [itemIdToEdit, setItemIdToEdit] = useState('')
  const openModalItemManagement = (itemId, productId, featured, for_sale, price, currently_using) => {
      setModalItemManagementProductId(productId)
      setItemIdToEdit(itemId)
      setModalEditItemOpen(true)
      setFeatured(featured)
      setForSale(for_sale)
      setPrice(price)
      setCurrentlyUsing(currently_using)
  }

  const itemInfo = user.gear.filter((item) => { return item.productId === modalItemManagementProductId })

  const editGearItem = (itemId, productId, featured, for_sale, price, currently_using) => {
    setIsLoaded(false)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/updateGearItem', {
        method: 'put',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({id: itemId, productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
      }).then((response) => {
        dispatch(userInfos.getUserGearInfoById(user.id));
        setIsLoaded(true)
        setModalEditItemOpen(false)
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao adicionar a atividade")
        setIsLoaded(true)
      })
    }, 300);
  }

  // Remove product from list
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)
  const [itemToRemove, setItemToRemove] = useState({id: '', name: ''})
  const openModalConfirmation = (productId, productName) => {
    setModalConfirmDelete(true)
    setItemToRemove({id: productId, name: productName})
  }
  const deleteGear = (userGearId) => {
    setLoadingRemove(true)
    fetch('https://mublin.herokuapp.com/user/'+userGearId+'/deleteGearItem', {
      method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      }
    }).then((response) => {
      dispatch(userInfos.getUserGearInfoById(user.id))
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
      <Header />
      <Container size='lg' mb={100}>
        <Grid mt={isLargeScreen ? 30 : 0}>
          {isLargeScreen && 
            <Grid.Col span={3}>
              <SettingsMenu page='myGear' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 9 }} pl={isLargeScreen ? 26 : 0}>
            <Breadcrumbs mb={16} separator="›" separatorMargin="xs">
              <Anchor href='/teste'>
                <Text fw='400'>Configurações</Text>
              </Anchor>
              <Text fw='500'>Meus equipamentos</Text>
            </Breadcrumbs>
            {user.requesting ? (
              <Center mt='60'>
                <Loader active inline='centered' />
              </Center>
            ) : (
              <>
                {user.plan === 'Pro' ? (
                  <Button
                    leftSection={<IconPlus size={14} />}
                    color='violet'
                    onClick={() => setModalAddNewProductOpen(true)} disabled={!isLoaded}
                  >
                    Adicionar novo item
                  </Button>
                ) : (
                  <>
                    <Button disabled>
                      <IconPlus name='plus' /> Adicionar novo item à lista
                    </Button>
                    <Alert variant="light" color="yellow" title="Funcionalidade exclusiva">
                      Apenas usuários com plano Pro podem adicionar novos produtos ao equipamento
                    </Alert>
                  </>
                )}
                <Grid mt='lg'>
                  {user.gear.map((item, key) => (
                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }} key={key}>
                      <Paper
                        radius='md'
                        withBorder
                        px='16'
                        py='12'
                        mb='14'
                        className='mublinModule'
                      >
                        <Center mb='md'>
                          <Image
                            radius='md'
                            h={100}
                            w={100}
                            src={item.picture ? item.picture : undefined}
                          />
                        </Center>
                        <Box>
                          <Text size='xs' c='dimmed'>{item.brandName}</Text>
                          <Text size='sm' mb='3'>{item.productName}</Text>
                          <Group gap='3'>
                            {item.featured ? (
                              <IconToggleRightFilled color='#7950f2' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='xs'>Em destaque</Text>
                          </Group>
                          <Group gap='3'>
                            {item.currentlyUsing ? (
                              <IconToggleRightFilled color='#7950f2' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='xs'>Em uso</Text>
                          </Group>
                          <Group gap='3'>
                            {item.forSale ? (
                              <IconToggleRightFilled color='#7950f2' />
                            ) : (
                              <IconToggleLeft color='gray' />
                            )}
                            <Text size='xs'>À venda</Text>
                            <Text size='xs' c='dimmed'>{!!item.forSale && '('+item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})+')'}</Text>
                          </Group>
                        </Box> 
                        <Flex mt='10' gap='4' justify='space-between'>
                          <Button 
                            size='compact-sm'
                            color='violet'
                            variant='subtle'
                            fullWidth
                            fw='440'
                            onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing)}
                          >
                            Editar
                          </Button>
                          <Button 
                            size='compact-sm'
                            color='gray'
                            variant='subtle'
                            fullWidth
                            fw='440'
                            onClick={() => openModalConfirmation(item.id, item.productName)}
                          >
                            Remover
                          </Button>
                        </Flex>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
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
          Tem certeza que deseja remover <strong>{itemToRemove.name}</strong> do seu equipamento?
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
        title='Adicionar novo item'
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
          label='Marca'
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
          label='Marca'
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
            <option key={key} value={product.id} disabled={!!user.gear.filter((x) => { return x.productId === Number(product.id)}).length}>{product.name} {product.colorName && product.colorName} {!!user.gear.filter((x) => { return x.productId === Number(product.id)}).length && '(adicionado)'}</option>
          )}
        </NativeSelect>
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
          <Paper>
            Selecione o produto para carregar a imagem
          </Paper>
        )}
        <Anchor href='/gear/submit/product' className='websiteLink'>
          Não encontrei meu produto na lista
        </Anchor>
        <Group justify='flex-end' gap={7} mt={20}>
          <Button variant='outline' color='violet' size='sm' onClick={() => setModalAddNewProductOpen(false)}>
            Cancelar
          </Button>
          <Button color='violet' size='sm' onClick={() => addProductToGear(productSelected, 0, 0, null, 1)} disabled={!productSelected ? true : false} loading={!isLoaded}>
            Salvar
          </Button>
        </Group>
      </Modal>
      <Modal 
        title='Editar detalhes do item'
        centered
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
              <Text size='xs' c='dimmed' mt={8}>{item.brandName}</Text>
              <Text size='sm'>{item.productName}</Text>
              <Radio.Group
                mt={8}
                value={String(featured)}
                onChange={setFeatured}
                name='editItemFeatured'
                label='Em destaque'
              >
                <Group>
                <Radio color='violet' value='1' label='Sim' />
                <Radio color='violet' value='0' label='Não' />
                </Group>
              </Radio.Group>
              <Radio.Group
                mt={8}
                value={String(currently_using)}
                onChange={setCurrentlyUsing}
                name='editItemUsing'
                label='Em uso atualmente'
              >
                <Group>
                <Radio color='violet' value='1' label='Sim' />
                <Radio color='violet' value='0' label='Não' />
                </Group>
              </Radio.Group>
              <Radio.Group
                mt={8}
                mb={8}
                value={String(for_sale)}
                onChange={setForSale}
                name='editItemForSale'
                label='À venda'
              >
                <Group>
                <Radio color='violet' value='1' label='Sim' />
                <Radio color='violet' value='0' label='Não' />
                </Group>
              </Radio.Group>
              <CurrencyInput
                value={price}
                locale='pt-BR'
                disabled={(for_sale === '1' || for_sale === 1) ? false : true}
                onChangeValue={(event, originalValue, maskedValue) => {
                  // console.log(event, originalValue, maskedValue);
                  setPrice(originalValue);
                }}
                InputElement={<TextInput label='Preço de venda:' />} 
              />
              {(productSelected && productInfo) &&
                <Image
                  radius='md'
                  h={100}
                  w={100}
                  src={productInfo[0].picture ? productInfo[0].picture : undefined}
                />
              }
              <Group justify='flex-end' gap={7} mt={20}>
                <Button variant='outline' color='violet' size='sm' onClick={() => setModalEditItemOpen(false)}>
                  Cancelar
                </Button>
                <Button color='violet' size='sm' disabled={(for_sale === '1' && !price) ? true : false} onClick={() => editGearItem(itemIdToEdit, modalItemManagementProductId, featured, for_sale, price, currently_using)} loading={!isLoaded}>
                  Salvar
                </Button>
              </Group>
            </Box>
          )}
        </>
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default SettingsMyGearPage;