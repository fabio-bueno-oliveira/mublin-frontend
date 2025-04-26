import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { gearInfos } from '../../../store/actions/gear'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Flex, Paper, Group, Center, Box, Anchor, Title, Text, Image, Avatar, Badge, Skeleton, ColorSwatch, Loader, Button } from '@mantine/core'
import { IconChevronUp, IconDiamond, IconMapPin, IconRosetteDiscountCheckFilled, IconShieldCheckFilled } from '@tabler/icons-react'
import Header from '../../../components/header/public'

function ProductPublicPage () {

  const params = useParams()
  const productId = params?.productId
  const product = useSelector(state => state.gear)
  const loggedIn = useSelector(state => state.authentication.loggedIn)

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(gearInfos.getProductInfo(productId))
    dispatch(gearInfos.getProductOwners(productId))
    dispatch(gearInfos.getProductColors(productId))
  }, [productId])

  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    if (product.availableColors.total > 0) {
      setSelectedColor(
        product.availableColors.result.filter((x) => { return x.mainColor === 1 })[0]
      )
    }
  }, [product.availableColors.success])

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{product.requesting ? 'Mublin' : `${product.name} | ${product.brandName} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/product/${product.id}`} />
        <meta name='description' content={product.description} />
      </Helmet>
      {loggedIn &&
        <Navigate to='/home' />
      }
      <Header />
      <Container size='lg'>
        <Flex gap={12} align='center'>
          {product.requesting ? (
            <Skeleton height={75} width={75} radius='md' />
          ) : (
            <Anchor
              href={`/company/${product.brandSlug}`}
            >
              <Image
                src={product.brandLogo ? `https://ik.imagekit.io/mublin/products/brands/tr:h-150,w-150,cm-pad_resize,bg-FFFFFF/${product.brandLogo}` : undefined}
                h={75}
                w={75}
                radius='md'
              />
            </Anchor>
          )}
          <Flex direction='column'>
            {product.requesting ? (
              <Skeleton width={100} height={10} mb={4} radius="md" />
            ) : (
              <Text fw='420' size='sm' c='dimmed'>
                {product.categoryName + ' • ' + product.brandName + (product.seriesName ? ' • ' + product.seriesName : '')}
              </Text>
            )}
            {product.requesting ? (
              <Skeleton width={220} height={18} radius='md' />
            ) : (
              <>
                <Title fz='1.12rem' fw='560'>
                  {product.name}
                </Title>
                {product.subtitle && 
                  <Title fz='0.8rem' fw='400'>
                    {product.subtitle}
                  </Title>
                }
              </>
            )}
            {!!product.rare &&
              <Group gap={2} align='center'>
                <IconDiamond color='#4c6ef5' style={{width:'0.9rem',height:'0.9rem'}} />
                <Text size='xs' classNames='lhNormal' variant='gradient' gradient={{ from: 'indigo', to: 'pink', deg: 90 }}>
                  Item considerado raro ou limitado
                </Text>
              </Group>
            }
            {!!product.discontinued &&
              <Text fz='11px' c='dimmed'>
                Produto descontinuado pelo fabricante
              </Text>
            }
          </Flex>
        </Flex>
        <Grid mt='20' mb='70'>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Box mb={8}>
              {product.requesting ? (
                <Center mih={100} py={30} className='gearProductImage'>
                  <Loader size='xl' my={70} color='#868e96' type='bars' opacity={0.3} />
                </Center>
              ) : (
                <>
                  {product.availableColors.total === 0 && 
                    <>
                      <Center mih={100} className='gearProductImage'>
                        <Image 
                          src={product.picture ? product.picture : undefined}
                          radius='md'
                          w={300}
                          h={300}
                          // alt={`Foto de ${product.brandName + ' ' + product.name}`}
                        />
                      </Center>
                      {product.colorId && 
                        <>
                          <Text size='xs' my={5} ta='center'>
                            {product.colorName}
                          </Text>
                          <Center>
                            <ColorSwatch
                              color={product.colorSample ? undefined : product.colorRgb}
                              title={product.colorName}
                              className={product.colorSample ? 'removeAlpha' : undefined}
                              style={{backgroundSize:'28px 28px', backgroundImage: product.colorSample ? "url(" + 'https://ik.imagekit.io/mublin/products/colors/'+product.colorSample + ")" : undefined}}
                            />
                          </Center>
                        </>
                      }
                    </>
                  }
                  {(product.availableColors.total > 0 && selectedColor?.colorId) && 
                    <Center className='gearProductImage'>
                      <Image 
                        src={selectedColor.picture ? selectedColor.picture : undefined}
                        radius='md'
                        w={300}
                        h={300}
                        alt={`Foto de ${product.brandName + ' ' + product.name}`}
                      />
                    </Center>
                  }
                  {product.availableColors.total > 0 && 
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
                              // withShadow={item.colorId === selectedColor?.colorId}
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
                </>
              )}
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
            {product.requesting ? (
              <Box mb={20}>
                <Skeleton width={240} height={12} mb={6} radius="md" />
                <Skeleton width={180} height={12} mb={6} radius="md" />
              </Box>
            ) : (
              product.description && ( 
                <Box mb={20}>
                  <Text fz='sm'
                    className='lhNormal'
                    style={{whiteSpace:'pre-wrap'}}
                  >
                    {product.description}
                  </Text>
                  {product.descriptionSource && 
                    <Text fz='12px' c='dimmed' mt={6} className='lhNormal'>
                      Fonte: {product.descriptionSource}
                    </Text>
                  }
                  {product.descriptionSourceUrl &&
                    <Anchor href={product.descriptionSourceUrl} target="_blank" underline="hover" fz='11px' c='dimmed'>
                      {product.descriptionSourceUrl}
                    </Anchor>
                  }
                  {!!product.discontinued &&
                    <Text fz='10px' c='dimmed' mt={4}>
                      *Produto descontinuado pelo fabricante
                    </Text>
                  }
                </Box>
              )
            )}
            {product.requesting ? (
              <>
                <Skeleton width={240} height={12} mb={6} radius="md" />
                <Skeleton width={180} height={12} radius="md" />
                <Paper
                  mt={14}
                  radius='md'
                  withBorder
                  px='12'
                  py='12'
                  style={{ backgroundColor: 'transparent' }}
                  w={150}
                >
                  <Center mb={4}>
                    <Skeleton height={50} circle mb="xl" />
                  </Center>
                  <Flex
                    justify='flex-start'
                    align='center'
                    direction='column'
                    wrap='wrap'
                    gap={2}
                  >
                    <Skeleton width={120} height={12} mb={6} radius="md" />
                    <Skeleton width={90} height={12} mb={6} radius="md" />
                  </Flex>
                </Paper>
              </>
            ) : (
              <>
                <Text fz='sm' className='lhNormal' mb={12}>
                  {product.owners.total === 1
                    ? <>{product.owners.total} pessoa utiliza <Text fz='sm' span fw='640'>{product.brandName} {product.name}</Text></>
                    : <>{product.owners.total} pessoas utilizam <Text fz='sm' span fw='640'>{product.brandName} {product.name}</Text></>
                  }
                </Text>
                {product.owners.total > 0 && (
                  <Grid mb={30}>
                    {product.owners.result.map(owner => 
                      <Grid.Col key={owner.id} span={{ base: 4, md: 3, lg: 3 }}>
                        <Paper
                          radius='md'
                          withBorder
                          px='12'
                          py='12'
                          style={{ backgroundColor: 'transparent' }}
                          w='100%'
                        >
                          <Link to={{ pathname: `/${owner.username}` }}>
                            <Center mb={4}>
                              <Avatar.Group className='noTapColor'>
                                <Avatar size='lg' src={owner.picture} alt={`Foto de ${owner.name+' '+owner.lastname}`} />
                                <Avatar size='sm'  src={product.picture} alt={`Foto de ${product.brandName + ' ' + product.name}`} />
                              </Avatar.Group>
                            </Center>
                          </Link>
                          <Flex
                            justify='flex-start'
                            align='center'
                            direction='column'
                            wrap='wrap'
                            gap={2}
                          >
                            <Badge size='xs' variant='light' color='primary' title={owner.username}>
                              {owner.username}
                            </Badge>
                            <Flex mb={2} w='100%' gap={2} justify='center' align='center'>
                              <Text size='12px' fw={550} truncate='end' title={owner.name+' '+owner.lastname}>
                                {owner.name+' '+owner.lastname}
                              </Text>
                              {!!owner.verified && 
                                <IconRosetteDiscountCheckFilled 
                                  className='iconVerified small'
                                  title='Verificado'
                                />
                              }
                              {!!owner.legend && 
                                <IconShieldCheckFilled
                                  className='iconLegend small'
                                  title='Lenda da Música'
                                />
                              }
                            </Flex>
                            <Group wrap='nowrap' gap={2} align='center' justify='center' w='100%'>
                              <IconMapPin size={11} color='#8d8d8d' />
                              <Text size='10px' c='dimmed' className='lhNormal' truncate='end'>
                                {owner.city && `${owner.city}/${owner.regionUF}`}
                              </Text>
                            </Group>
                            <Group gap={3}>
                              {!!owner.forSale && 
                                <Badge size='xs' color='black'>À venda</Badge>
                              } 
                              {(owner.forSale && owner.price > 0) && 
                                <Text size='xs'>
                                  {owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                                </Text>
                              }
                            </Group>
                          </Flex>
                        </Paper>
                      </Grid.Col>
                    )}
                  </Grid>
                )}
                <Box id='cta'>
                  <Center mt={35} mb={4}>
                    <Box>
                      <Text align='center'>
                        Faça login para uma experiência completa!
                      </Text>
                    </Box>
                  </Center>
                  <Group justify='center' gap={8}>
                    <Link to={{ pathname: '/login' }}>
                      <Button 
                        variant='gradient'
                        gradient={{ from: 'violet', to: 'indigo', deg: 90 }}
                      >
                        Fazer login
                      </Button>
                    </Link>
                    ou
                    <Link to={{ pathname: '/signup' }}>
                      <Button 
                        color='violet' 
                        variant='outline'
                      >
                        Cadastrar
                      </Button>
                    </Link>
                  </Group>
                </Box>
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Text ta='center' my={10} c='dimmed' size='xs'>
        © 2025 Mublin
      </Text>
    </>
  )
}

export default ProductPublicPage