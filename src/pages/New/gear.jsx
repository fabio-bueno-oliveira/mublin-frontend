import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../store/actions/user'
import { gearInfos } from '../../store/actions/gear'
import { Container, Divider, Card, Paper, Center, Box, Group, Flex, Image, NativeSelect, Button, Radio, Text, Title, Anchor, Checkbox, TextInput, Textarea, ColorSwatch, ThemeIcon, em } from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconChevronUp, IconPhoto, IconCubePlus } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { CurrencyInput } from 'react-currency-mask'

function AddGearToUserSetup () {

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  // Initial values from URL search params (/new/gear?product=&category=&brand=)
  const [searchParams] = useSearchParams()
  const initialProductId = searchParams.get('product')
  const initialCategoryId = searchParams.get('category')
  const initialBrandId = searchParams.get('brand')

  // Loading
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingAddNewProduct, setLoadingAddNewProduct] = useState(false)

  // Lists
  const [brands, setBrands] = useState([])
  const [tuningTypes, setTuningTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedMacroCategory, setSelectedMacroCategory] = useState(null)

  const product = useSelector(state => state.gear)
  const user = useSelector(state => state.user)
  const gear = useSelector(state => state.user.gear)

  const [forSale, setForSale] = useState('0')
  const [price, setPrice] = useState('')

  useEffect(() => { 
    dispatch(userActions.getUserGearInfoById(loggedUserId))
    dispatch(gearInfos.resetProductColors())
  }, [dispatch, loggedUserId])

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

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      productId: '',
      featured: '0',
      currentlyUsing: '1',
      tuning: '',
      ownerComments: '',
      idColor: ''
    },

    validate: {
      productId: isNotEmpty('Selecione o produto'),
      featured: isNotEmpty('Selecione o produto'),
      currentlyUsing: isNotEmpty('Selecione o produto')
    },
  })

  form.watch('productId', ({ value }) => {
    setSelectedMacroCategory(
      products.filter((product) => { 
        return product.id === Number(value) 
      })[0].macroCategory
    )
    dispatch(gearInfos.getProductColors(value))
    setSelectedColor(null)
  })

  const [brandSelected, setBrandSelected] = useState('')
  const [categorySelected, setCategorySelected] = useState('')
  const [shareNewProductOnFeed, setShareNewProductOnFeed] = useState(true)

  const productInfo = products.filter(
    (product) => { return product.id === Number(form.getValues().productId)}
  )

  const selectBrand = (brandId) => {
    dispatch(gearInfos.resetProductColors())
    setBrandSelected(brandId)
    setCategories([])
    setCategorySelected('')
    setProducts([])
    form.setFieldValue('productId', '')
    getCategories(brandId)
  }
  const selectCategory = (categoryId) => {
    form.setFieldValue('productId', '')
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
    }, 300)
  }

  const handleSubmit = (values) => {
    if (product.availableColors.total > 0 && !selectedColor?.colorId) {
      return notifications.show({
          id: 'emptyColorError',
          position: 'top-center',
          color: 'red',
          title: 'Ops',
          message: 'Selecione uma das cores disponíveis do item',
        })
    }
    setLoadingAddNewProduct(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/addGearItemV2', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
          productId: values.productId, featured: values.featured, forSale: forSale, price: price ? price : '', currentlyUsing: values.currentlyUsing, tuning: '', ownerComments: values.ownerComments ? values.ownerComments : '', colorId: selectedColor?.colorId ? selectedColor?.colorId : '' 
        })
      }).then((response) => {
        setLoadingAddNewProduct(false)
        setBrandSelected('')
        setCategorySelected('')
        if (shareNewProductOnFeed) {
          sendToFeed(values.productId)
        }
        form.reset()
        notifications.show({
          position: 'top-right',
          color: 'green',
          title: 'Sucesso',
          message: shareNewProductOnFeed ? 'O novo item foi adicionado ao seu equipamento e compartilhado no feed' : 'O novo item foi adicionado ao seu equipamento',
        })
        // navigate(`/${user.username}`)
        navigate('/settings/my-gear')
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao adicionar o produto")
        notifications.show({
          position: 'top-right',
          color: 'red',
          title: 'Ops!',
          message: 'Ocorreu um erro ao adicionar o item. Tente novamente em instantes',
        })
        setLoadingAddNewProduct(false)
      })
    }, 300)
  }

  const [selectedColor, setSelectedColor] = useState(null)

  const getCategories = (brandId) => {
    setIsLoaded(false);
    fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/categories")
      .then(res => res.json())
      .then(
      (result) => {
        setIsLoaded(true)
        setCategories(result)
      },
      (error) => {
        setIsLoaded(true)
        console.error(error)
      }
    )
  }

  const getProducts = (brandId, categoryId) => {
    setIsLoaded(false);
    fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/"+categoryId+"/products")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setProducts(result)
        },
        (error) => {
          setIsLoaded(true)
          console.error(error)
        }
      )
  }

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='xs' mt={20} mb={100}>
        <Paper
          withBorder={isLargeScreen ? true : false}
          px={isMobile ? 0 : 16}
          pt={isMobile ? 0 : 12}
          pb={isMobile ? 3 : 12}
          mt='12'
          mb='14'
          className="mublinModule transparentBgInMobile"
        >
          <Group gap={8} mb={14} align='center'>
            <ThemeIcon variant='light' radius="xl" size="lg" color="mublinColor">
              <IconCubePlus style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            <Box>
            <Title order={6}>
              Adicionar item ao meu equipamento
            </Title>
            <Text size='sm' c='dimmed'>
              Selecione o produto que será adicionado
            </Text>
            </Box>
          </Group>
          {/* <Text mb={14} size='sm' c='dimmed'>
            Selecione o item que será adicionado
          </Text> */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
              mt={10}
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
              mt={10}
              label="Produto"
              withAsterisk
              key={form.key('productId')}
              {...form.getInputProps('productId')}
            >
              {!isLoaded && 
                <option>Carregando...</option>
              }
              {!form.getValues().productId && 
                <option value=''>{!categorySelected ? 'Selecione primeiro a categoria' : 'Selecione o produto'}</option>
              }
              {products.map((product,key) =>
                <option key={key} value={product.id} disabled={!!gear.filter((x) => { return x.productId === Number(product.id)}).length}>{product.name} {!!gear.filter((x) => { return x.productId === Number(product.id)}).length && '(adicionado)'}</option>
              )}
            </NativeSelect>
            {loggedUserId === 1 &&
              <Anchor href='/settings/submit-product' underline='hover'>
                <Text mt='xs' c='primary' ta='right' size='xs'>
                  Não encontrei meu produto na lista
                </Text>
              </Anchor>
            }
            {(!form.getValues().productId && product.availableColors.total === 0) &&  
              <Center mt={14} mb={20}>
                <Card w='120' p={10} withBorder shadow={false}>
                  <Flex gap={6} direction='column' align='center'>
                    <IconPhoto size={16} color='gray' />
                    <Text size='xs' fw={500} ta='center' c='dimmed'>
                      Selecione o produto para carregar a imagem
                    </Text>
                  </Flex>
                </Card>
              </Center>
            }
            {(
              form.getValues().productId && 
              productInfo && 
              product.availableColors.total === 0
            ) &&
              <Center p={12}>
                <Image 
                  radius='md'
                  h={150}
                  w={150}
                  src={productInfo[0]?.picture} 
                />
              </Center>
            }

            {(form.getValues().productId && !selectedColor && product.availableColors.total > 0) &&
              <Center mt={14} mb={20}>
                <Card w='120' p={4}>
                  <Text size='sm' ta='center' c='dimmed'>
                    Selecione a cor para carregar a imagem
                  </Text>
                </Card>
              </Center>
            }
            {(product.availableColors.total > 0 && selectedColor?.colorId) && 
              <Center p={12}>
                <Image 
                  radius='md'
                  h={150}
                  w={150}
                  src={selectedColor?.picture ? selectedColor?.picture : undefined}
                />
              </Center>
            }
            {product.requesting && 
              <Text ta='center' size='sm'>Carregando cores disponíveis...</Text>
            }
            {
              (
                form.getValues().productId && 
                product.availableColors.success && 
                product.availableColors.total > 0
              ) 
            && 
              <>
                <Text size='xs' my={5} ta='center'>
                  {selectedColor?.colorName}
                </Text>
                <Flex justify='center' align='flex-start' gap={8}>
                  {product?.availableColors.result?.map(item =>
                    <Flex key={item.colorId} direction='column' align='center'>
                      <ColorSwatch
                        color={item.colorSample ? undefined : item.colorRgb}
                        title={item.colorName}
                        onClick={() => setSelectedColor(product.availableColors.result.filter((x) => { return x.colorId === item.colorId })[0])}
                        withShadow={item.colorId === selectedColor?.colorId}
                        className={item.colorSample ? 'point removeAlpha' : 'point'}
                        style={{backgroundSize:'28px 28px', backgroundImage: item.colorSample ? "url(" + 'https://ik.imagekit.io/mublin/products/colors/'+item.colorSample + ")" : undefined}}
                      />
                      {item.colorId === selectedColor?.colorId &&
                        <IconChevronUp style={{width:'1rem',height:'1rem'}} />
                      }
                    </Flex>
                  )}
                </Flex>
              </>
            }
            <Radio.Group
              mt={8}
              label='Em destaque'
              description='Exibir entre os primeiros?'
              key={form.key('featured')}
              {...form.getInputProps('featured')}
            >
              <Group mt={4}>
                <Radio size='sm' color='mublinColor' value='1' label='Sim' />
                <Radio size='sm' color='mublinColor' value='0' label='Não' />
              </Group>
            </Radio.Group>
            <Divider my={10} />
            <Radio.Group
              mt={8}
              label='Em uso atualmente'
              description='Presente em algum dos meus setups'
              key={form.key('currentlyUsing')}
              {...form.getInputProps('currentlyUsing')}
            >
              <Group mt={4}>
                <Radio size='sm' color='mublinColor' value='1' label='Sim' />
                <Radio size='sm' color='mublinColor' value='0' label='Não' />
              </Group>
            </Radio.Group>
            <Divider my={10} />
            <NativeSelect
              className={selectedMacroCategory !== 'chords' ? 'd-none' : undefined}
              mt={8}
              label='Afinação atual'
              key={form.key('tuning')}
              {...form.getInputProps('tuning')}
            >
              <option>Não informar</option>
              {tuningTypes.map((type) =>
                <option key={type.id} value={type.id}>{type.namePTBR}</option>
              )}
            </NativeSelect>
            <Divider my={10} className={selectedMacroCategory !== 'chords' ? 'd-none' : undefined} />
            <Radio.Group
              mt={6}
              mb={8}
              label='À venda'
              value={String(forSale)}
              onChange={setForSale}
            >
              <Group>
                <Radio size='sm' color='mublinColor' value='1' label='Sim' />
                <Radio size='sm' color='mublinColor' value='0' label='Não' />
                <CurrencyInput
                  value={price}
                  locale='pt-BR'
                  disabled={(forSale === '1' || forSale === 1) ? false : true}
                  onChangeValue={(event, originalValue, maskedValue) => {
                    setPrice(originalValue)
                  }}
                  InputElement={<TextInput w='155px' placeholder='Preço de venda' />}
                />
              </Group>
            </Radio.Group>
            <Divider my={10} />
            <Textarea
              mt={8}
              mb={12}
              maxLength={420}
              label='Meus comentários sobre este item'
              description='Opcional'
              key={form.key('ownerComments')}
              {...form.getInputProps('ownerComments')}
            />
            <Group justify='space-between' gap={7} mt={22}>
              <Checkbox
                label='Compartilhar no feed'
                color='mublinColor'
                checked={shareNewProductOnFeed ? true : false}
                onChange={() => setShareNewProductOnFeed(value => !value)}
              />
              {user.plan === 'Pro' ? (
                <Button
                  size='md'
                  color='mublinColor'
                  type="submit"
                  loading={loadingAddNewProduct}
                >
                  Salvar
                </Button>
              ) : (
                <>
                  <Button
                    size='md'
                    disabled
                  >
                    Adicionar
                  </Button>
                  <Text size='xs'>Apenas usuários PRO podem adicionar equipamento</Text>
                </>
              )}
            </Group>
          </form>
        </Paper>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default AddGearToUserSetup