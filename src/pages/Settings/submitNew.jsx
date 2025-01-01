import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { miscInfos } from '../../store/actions/misc'
import { Grid, Container, Modal, Checkbox, Center, Group, Flex, Alert, Loader, Input, Image, NativeSelect, Button, Stack, Text, Breadcrumbs, Anchor, TextInput } from '@mantine/core'
import { IconCloudUp, IconPlus } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { IKUpload } from 'imagekitio-react'

function SettingsNewProductPage () {

  const user = useSelector(state => state.user)
  let dispatch = useDispatch()
  let navigate = useNavigate()

  document.title = 'Cadastrar novo produto | Mublin'

  let token = localStorage.getItem('token')  
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMacroCategoriesLoaded, setIsMacroCategoriesLoaded] = useState(false);
  const [macroCategories, setMacroCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [isColorsLoaded, setIsColorsLoaded] = useState(false);

  // Form Fields
  const [name, setName] = useState(null)
  const [brandId, setBrandId] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [colorId, setColorId] = useState(null)
  const [picture, setPicture] = useState(null)
  const [addNewProductToMyGear, setAddNewProductToMyGear] = useState(true)

  useEffect(() => { 
    dispatch(miscInfos.getGearBrands())
  }, [dispatch])

  const gearList = useSelector(state => state.gear);

  useEffect(() => {
    fetch("https://mublin.herokuapp.com/gear/macroCategories")
      .then(res => res.json())
      .then(
        (result) => {
          setIsMacroCategoriesLoaded(true);
          setMacroCategories(result);
        },
        (error) => {
          setIsMacroCategoriesLoaded(true);
          setError(error);
        }
      )
    
    fetch("https://mublin.herokuapp.com/gear/categories")
      .then(res => res.json())
      .then(
        (result) => {
          setIsCategoriesLoaded(true);
          setCategories(result);
        },
        (error) => {
          setIsCategoriesLoaded(true);
          setError(error);
        }
    )

    fetch("https://mublin.herokuapp.com/gear/product/colors")
      .then(res => res.json())
      .then(
      (result) => {
        setIsColorsLoaded(true);
        setColors(result);
      },
      (error) => {
        setIsColorsLoaded(true);
        setError(error);
      }
    )
  }, [])

  // Upload product image to ImageKit.io
  const imageUploadPath = "/products/"
  const onUploadError = err => {
    alert("Ocorreu um erro. Tente novamente em alguns minutos.");
  };
  const onUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    setPicture(fileName)
  };

  // Submit new Brand
  const [modalNewBrandOpen, setModalNewBrandOpen] = useState(false)
  const [newBrandName, setNewBrandName] = useState(null)
  const [newBrandLogo, setNewBrandLogo] = useState(null)

  // Upload product image to ImageKit.io
  const logoUploadPath = "/products/brands/"
  const onLogoUploadError = err => {
    alert("Ocorreu um erro. Tente novamente em alguns minutos.");
  };
  const onLogoUploadSuccess = res => {
    let n = res.filePath.lastIndexOf('/');
    let fileName = res.filePath.substring(n + 1);
    setNewBrandLogo(fileName)
  };

  const submitNewBrand = () => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/gear/submitNewGearBrand', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({name: newBrandName, logo: newBrandLogo, id_user_creator: userInfo.id})
      }).then(res => res.json()).then((result) => {
        dispatch(miscInfos.getGearBrands())
        setIsLoading(false)
        setNewBrandName('')
        setNewBrandLogo('')
        setBrandId(result.id)
        setModalNewBrandOpen(false)
      }).catch(err => {
        console.error(err)
        alert("Ocorreu um erro ao adicionar a atividade")
        setIsLoading(false)
      })
    }, 300);
  }

  const submitNewProduct = () => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/gear/submitNewGearProduct', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({name: name, id_brand: brandId, id_category: categoryId, year: null, color: colorId, picture: picture, id_user_creator: userInfo.id})
      }).then(res => res.json()).then((result) => {
        setIsLoading(false)
        setName(null)
        setBrandId(null)
        setCategoryId(null)
        setPicture(null)
        if (addNewProductToMyGear) {
          addProductToMyGear(result.id)
        } else {
          navigate('/settings/my-gear')
        }
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao adicionar o produto. Talvez o mesmo produto já esteja cadastrado.')
        setIsLoading(false)
      })
    }, 300);
  }

  const addProductToMyGear = (newProductId) => {
    setIsLoading(true)
    setTimeout(() => {
      fetch('https://mublin.herokuapp.com/user/addGearItem', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({productId: newProductId, featured: 0, for_sale: 0, price: null, currently_using: 1})
      }).then((response) => {
        setIsLoading(false)
        navigate('/settings/my-gear')
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao adicionar o produto à sua lista de equipamentos')
        setIsLoading(false)
      })
    }, 300);
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
              <Anchor href='/settings'>
                <Text fw='400'>Configurações</Text>
              </Anchor>
              <Text fw='500'>Submeter produto</Text>
            </Breadcrumbs>
            {user.requesting ? (
              <Center mt='60'>
                <Loader active inline='centered' />
              </Center>
            ) : (
              <>
                <Alert mb={16} variant="light" color="blue" icon={<IconCloudUp />}>
                  Colabore enviando produtos à nossa base de dados
                </Alert>
                <Flex direction='column' gap={10} align='center'>
                  <NativeSelect
                    label='Marca'
                    onChange={(e) => setBrandId(e.target.options[e.target.selectedIndex].value)}
                    value={brandId}
                    defaultValue={brandId}
                  >
                    {(gearList.requesting) && 
                      <option>Carregando...</option>
                    }
                    {!brandId &&
                      <option>Selecione</option>
                    } 
                    {gearList.brands.map((brand,key) =>
                      <option key={key} value={brand.id}>{brand.name}</option>
                    )}
                  </NativeSelect>
                  <Text>ou</Text>
                  <Button 
                    onClick={() => setModalNewBrandOpen(true)}
                    leftSection={<IconPlus size={14} />}
                  >
                    Adicionar nova marca
                  </Button>
                </Flex>
                <Stack
                  align="stretch"
                  justify="flex-start"
                  gap="md"
                  mb={310}
                >
                  <NativeSelect
                    withAsterisk
                    label='Categoria'
                    onChange={(e) => setCategoryId(e.target.options[e.target.selectedIndex].value)}
                    value={categoryId}
                    defaultValue={categoryId}
                  >
                    {(!isCategoriesLoaded) && 
                      <option>Carregando...</option>
                    }
                    { !categoryId && 
                      <option>Selecione</option>
                    }
                    { macroCategories.map((macroCategory,key) =>
                      <>
                        <optgroup label={macroCategory.name}>
                          { categories.filter((x) => { return x.macro_category === macroCategory.name }).map((category,key) =>
                            <option key={key} value={category.id}>{category.name}</option>
                          )}
                        </optgroup>
                      </>
                    )}
                  </NativeSelect>
                  <TextInput
                    label='Modelo (sem a marca)'
                    placeholder='Ex: BD-2 Blues Driver'
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                  />
                  <NativeSelect
                    withAsterisk
                    label='Cor do produto'
                    onChange={(e) => setColorId(e.target.options[e.target.selectedIndex].value)}
                    value={colorId}
                    defaultValue={colorId}
                  >
                    {(!isColorsLoaded) && 
                      <option>Carregando...</option>
                    }
                    { !colorId && 
                      <option>Selecione</option>
                    }
                    { colors.map((color,key) =>
                      <option key={key} value={color.id}>{color.name} {color.name_ptbr && '('+color.name_ptbr+')'}</option>
                    )}
                  </NativeSelect>
                  <Checkbox
                    label='Adicionar este produto ao Meu Equipamento'
                    checked={addNewProductToMyGear ? true : false}
                    // onChange={(event) => setChecked(event.currentTarget.checked)}
                    onChange={() => setAddNewProductToMyGear(value => !value)}
                  />
                  <Input.Label required>Foto genérica do produto</Input.Label>
                  <Alert mb={16} variant="light" color="gray">
                    Envie um arquivo de até 2mb. A foto do produto deve ser genérica e com qualidade, de preferência em estado de novo. A foto deve ter aproximadamente 22 pixels de margem em cada extremidade (independente da largura ou altura), e fundo branco ou transparente. De prefência, de frente sem inclinação.
                  </Alert>
                  <Center>
                    <Image src='https://ik.imagekit.io/mublin/misc/product-image-upload-guide_SRC738Rba.png' height='215' />
                    {picture && 
                      <Image src={'https://ik.imagekit.io/mublin/tr:h-300,cm-pad_resize,bg-FFFFFF/products/'+picture} height='205' ml='10' />
                    }
                  </Center>
                  <div className={picture ? 'd-none' : ''}>
                    <IKUpload 
                      id='picture'
                      // fileName="avatar.jpg"
                      folder={imageUploadPath}
                      tags={["gear"]}
                      useUniqueFileName={false}
                      isPrivateFile= {false}
                      onError={onUploadError}
                      onSuccess={onUploadSuccess}
                      accept="image/x-png,image/gif,image/jpeg" 
                    />
                  </div>
                  <Button
                    mt={10}
                    disabled={(!name || !picture || !brandId || !categoryId) ? true : false}
                    onClick={() => submitNewProduct()}
                  >
                    Enviar
                  </Button>
                </Stack>
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Modal
        withCloseButton={false}
        opened={modalNewBrandOpen}
        onClose={() => setModalNewBrandOpen(false)}
        size='xs'
        title='Cadastrar nova marca de equipamento'
        centered
      >
        <Alert mb={16} variant="light" color="yellow">
          Evite duplicidade! Certifique-se que a marca já não esteja cadastrada
        </Alert>
        <TextInput
          label='Nome'
          placeholder='Ex: Fender'
          value={newBrandName}
          onChange={(event) => setNewBrandName(event.currentTarget.value)}
        />
        <Input.Label for='newBrandLogo'>Logotipo</Input.Label>
        <div className={picture ? 'd-none' : ''}>
          <IKUpload
            id='newBrandLogo'
            fileName={newBrandName+'_avatar.jpg'}
            folder={logoUploadPath}
            tags={['logo']}
            useUniqueFileName={true}
            isPrivateFile= {false}
            onError={onLogoUploadError}
            onSuccess={onLogoUploadSuccess}
            accept='image/x-png,image/gif,image/jpeg'
            style={{fontSize:'12px'}}
          />
        </div>
        <Group justify='flex-end' gap={7} mt={20}>
          <Button 
            variant='outline' 
            color='gray' 
            size='sm' 
            onClick={() => setModalNewBrandOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            color='violet' 
            size='sm' 
            disabled={(!newBrandName || !newBrandLogo) ? true : false} 
            onClick={() => submitNewBrand()} 
            loading={isLoading}
          >
            Cadastrar
          </Button>
        </Group>
      </Modal>
      <FooterMenuMobile />
    </>
  );
};

export default SettingsNewProductPage;