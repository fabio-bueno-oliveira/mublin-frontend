import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userInfos } from '../../store/actions/user'
import { Grid, Container, Modal, Card, Paper, Center, Group, Flex, Badge, Alert, Loader, Box, Image, NativeSelect, Button, Radio, Text, Breadcrumbs, Anchor, Checkbox, TextInput, Textarea, em } from '@mantine/core'
import { IconToggleRightFilled, IconToggleLeft, IconPlus } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { CurrencyInput } from 'react-currency-mask'

function SettingsMyGearPage () {

  let dispatch = useDispatch()

  document.title = 'Meu equipamento | Mublin'

  let loggedUser = JSON.parse(localStorage.getItem('user'))
  const requesting = useSelector(state => state.user.requesting)
  const gear = useSelector(state => state.user.gear)

  useEffect(() => { 
    dispatch(userInfos.getUserGearInfoById(loggedUser.id))
  }, [dispatch, loggedUser.id])

  const [isLoaded, setIsLoaded] = useState(false)
  const [brands, setBrands] = useState([])
  const [tuningTypes, setTuningTypes] = useState([])
  const [categories, setCategories] = useState([])

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const isLargeScreen = useMediaQuery('(min-width: 60em)')

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
          'Authorization': 'Bearer ' + loggedUser.token
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
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
      }).then((response) => {
        dispatch(userInfos.getUserGearInfoById(loggedUser.id))
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
          'Authorization': 'Bearer ' + loggedUser.token
        },
        body: JSON.stringify({id: itemId, productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using, tuning: tuning, owner_comments: owner_comments})
      }).then((response) => {
        dispatch(userInfos.getUserGearInfoById(loggedUser.id));
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
        'Authorization': 'Bearer ' + loggedUser.token
      }
    }).then((response) => {
      dispatch(userInfos.getUserGearInfoById(loggedUser.id))
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
      {isLargeScreen && 
        <Header />
      }
      <Container size='lg' mb={100}>
        <Grid mt='20px'>
          {isLargeScreen && 
            <Grid.Col span={3}>
              <SettingsMenu page='myGear' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 9 }} pl={isLargeScreen ? 26 : 0}>
            {isMobile && 
              <Breadcrumbs mb={16} separator="›" separatorMargin="xs">
                <Anchor href='/settings'>
                  <Text fw='400'>Configurações</Text>
                </Anchor>
                <Text fw='500'>Meus equipamentos</Text>
              </Breadcrumbs>
            }
            {requesting ? (
              <Center mt='60'>
                <Loader active inline='centered' />
              </Center>
            ) : (
              <>
                <Group justify='flex-start'>
                  {loggedUser.plan === 'Pro' ? (
                    <Button
                      leftSection={<IconPlus size={14} />}
                      color='violet'
                      onClick={() => setModalAddNewProductOpen(true)} disabled={!isLoaded}
                    >
                      Adicionar novo equipamento
                    </Button>
                  ) : (
                    <>
                      <Button disabled leftSection={<IconPlus size={14} />}>
                        Adicionar novo equipamento
                      </Button>
                      <Alert variant="light" color="yellow" title="Funcionalidade exclusiva">
                        Apenas usuários com plano Pro podem adicionar novos produtos ao equipamento
                      </Alert>
                    </>
                  )}
                </Group>
                <Grid mt='lg'>
                  {gear.map((item, key) => (
                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }} key={key}>
                      <Paper
                        radius='md'
                        withBorder
                        px='16'
                        py='12'
                        mb='4'
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
                          <Text size='sm' mb='1'>{item.productName}</Text>
                          {item.tuningId && <Badge size='xs' color='gray'>Afinação: {item.tuningName}</Badge>}
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
                            onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing, item.tuningId, item.ownerComments, item.macroCategory)}
                          >
                            Editar
                          </Button>
                          <Button 
                            size='compact-sm'
                            color='gray'
                            variant='subtle'
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
        {loggedUser.id === 1 &&
          <Anchor mt='xs' href='/settings/submit-product' underline='hover' className='websiteLink'>
            <Text ta='right' size='sm'>Não encontrei meu produto na lista</Text>
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
          <Button variant='outline' color='violet' size='sm' onClick={() => setModalAddNewProductOpen(false)}>
            Cancelar
          </Button>
          <Button color='violet' size='sm' onClick={() => addProductToMyGear(productSelected, 0, 0, null, 1)} disabled={!productSelected ? true : false} loading={loadingAddNewProduct}>
            Salvar
          </Button>
        </Group>
      </Modal>
      <Modal
        title='Editar detalhes do item'
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
              <Text ta='center' size='xs' c='dimmed' mt={8}>{item.brandName}</Text>
              <Text ta='center' size='sm'>{item.productName}</Text>
              <Radio.Group
                mt={8}
                value={String(featured)}
                onChange={setFeatured}
                name='editItemFeatured'
                label='Em destaque (exibir entre os primeiros)'
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
                  {(for_sale === '1' || for_sale === 1) && 
                  <CurrencyInput
                    value={price}
                    locale='pt-BR'
                    disabled={(for_sale === '1' || for_sale === 1) ? false : true}
                    onChangeValue={(event, originalValue, maskedValue) => {
                      // console.log(event, originalValue, maskedValue);
                      setPrice(originalValue);
                    }}
                    InputElement={<TextInput w='155px' placeholder='Preço de venda' />} 
                  />
                }
                </Group>
              </Radio.Group>
              {/* {(for_sale === '1' || for_sale === 1) && 
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
              } */}
              <Textarea
                mt={8}
                label='Meus comentários pessoais'
                value={productDetail.ownerComments}
                onChange={(event) => setProductDetail({...productDetail, ownerComments: event.currentTarget.value})}
              />
              <Group justify='flex-end' gap={7} mt={20}>
                <Button variant='outline' color='violet' size='sm' onClick={() => setModalEditItemOpen(false)}>
                  Cancelar
                </Button>
                <Button color='violet' size='sm' disabled={(for_sale === '1' && !price) ? true : false} onClick={() => editGearItem(itemIdToEdit, modalItemManagementProductId, featured, for_sale, price, currently_using, productDetail.tuning, productDetail.ownerComments)} loading={!isLoaded}>
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