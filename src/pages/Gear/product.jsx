import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { gearInfos } from '../../store/actions/gear'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Card, Flex, Paper, Group, Center, Box, Anchor, Title, Text, Image, Avatar, Badge, Modal, ScrollArea, Skeleton, ColorSwatch } from '@mantine/core'
import { IconZoom, IconChevronUp, IconDiamond, IconUserCircle } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import { Helmet } from 'react-helmet'

function GearProductPage () {

  const params = useParams()
  const productId = params?.productId
  const product = useSelector(state => state.gear)
  const largeScreen = useMediaQuery('(min-width: 60em)')

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(gearInfos.getProductInfo(productId))
    dispatch(gearInfos.getProductOwners(productId))
    dispatch(gearInfos.getProductColors(productId))
  }, [productId])

  const [modalZoomOpen, setModalZoomOpen] = useState(false)

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
        <title>{`${product.brandName} ${product.name} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/gear/product/${product.id}`} />
        <meta name='description' content='A rede para quem trabalha com música' />
      </Helmet>
      <Header
        page='profile'
        username='Detalhes do produto'
        profileId={product.id}
        showBackIcon={true}
      />
      <Container size='lg' mt={largeScreen ? 20 : 0}>
        <Flex gap={12} align='center'>
          {product.requesting ? (
            <Skeleton height={75} width={75} radius='lg' />
          ) : (
            <Anchor
              href={`/gear/brand/${product.brandSlug}`}
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
            <Text fw='420' size='xs' c='dimmed'>
              {product.requesting ? <Skeleton width={100} height={10} mb={4} radius="md" /> : product.categoryName + ' • ' + product.brandName}
            </Text>
            <Title fz='1.12rem' fw='560'>
              {product.requesting ? <Skeleton width={220} height={18} radius="md" /> : product.name}
            </Title>
            {/* {!!product.rare &&
              <Group gap={2} align='center'>
                <IconDiamond style={{width:'0.9rem',height:'0.9rem'}} />
                <Text size='xs'>
                  Item considerado raro ou muito limitado
                </Text>
              </Group>
            } */}
            {!product.requesting &&
              <Anchor className='websiteLink' fz={12} href={`/gear/brand/${product.brandSlug}`}>
                Ver produtos {product.brandName}
              </Anchor>
            }
          </Flex>
        </Flex>
        <Grid mt='20' mb='70'>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Box mb={8}>
              {product.requesting ? (
                <Center className='gearProductImage'>
                  <Image
                    radius='md'
                    src={null}
                    w={300}
                    h={300}
                    fallbackSrc='https://placehold.co/170x130?text=Carregando...'
                  />
                </Center>
              ) : (
                <>
                  {product.availableColors.total === 0 && 
                    <>
                      <Center className='gearProductImage'>
                        <Image 
                          src={product.picture ? product.picture : undefined}
                          radius='md'
                          w={300}
                          h={300}
                          onClick={() => setModalZoomOpen(true)}
                          style={{cursor:'pointer'}}
                        />
                        <Center>
                          <Group gap='4'>
                            <IconZoom size='14' style={{color:'#595959'}} />
                            <Text ta='center' size='xs' c='#595959'>
                              Toque na imagem para ampliar
                            </Text>
                          </Group>
                        </Center>
                      </Center>
                      <Text size='xs' c='dimmed' my={5} ta='center'>
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
                  {(product.availableColors.total > 0 && selectedColor?.colorId) && 
                    <Center className='gearProductImage'>
                      <Image 
                        src={selectedColor.picture ? selectedColor.picture : undefined}
                        radius='md'
                        w={300}
                        h={300}
                        onClick={() => setModalZoomOpen(true)}
                        style={{cursor:'pointer'}}
                      />
                      <Center>
                        <Group gap='4'>
                          <IconZoom size='14' style={{color:'#595959'}} />
                          <Text ta='center' size='xs' c='#595959'>
                            Toque na imagem para ampliar
                          </Text>
                        </Group>
                      </Center>
                    </Center>
                  }
                  {product.availableColors.total > 0 && 
                    <>
                      <Text size='xs' c='dimmed' my={5} ta='center'>
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
            {!!product.rare &&
              <Card className="mublinModule" mb={10}>
                <Group gap={4} align='center'>
                  <IconDiamond style={{width:'1rem',height:'1rem'}} />
                  <Text fz='1.0rem' fw='640' className='lhNormal'>
                    Item considerado raro ou muito limitado
                  </Text>
                </Group>
              </Card>
            }
            <Card className="mublinModule">
              <Group gap={4} align='center'>
                <IconUserCircle style={{width:'1rem',height:'1rem'}} />
                <Text fz='1.0rem' fw='640' className='lhNormal'>
                  Quem possui {product.owners[0].id ? '('+product?.owners?.length+')' : '(0)'}
                </Text>
              </Group>
              {product.requesting ? (
                <Text>
                  Carregando...
                </Text>
              ) : (
                <Box mb={30}>
                  {product.owners[0].id && 
                    product?.owners?.map(owner => 
                      <Paper 
                        key={owner.id}
                        radius='md'
                        withBorder
                        px='12'
                        py='12'
                        mb='12'
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <Flex gap={7} mb='xs'>
                          <Link to={{ pathname: `/${owner.username}` }}>
                            <Avatar.Group>
                              <Avatar size='lg' src={owner.picture} />
                              <Avatar src={product.picture} />
                            </Avatar.Group>
                          </Link>
                          <Flex
                            justify='flex-start'
                            align='flex-start'
                            direction='column'
                            wrap='wrap'
                          >
                            <Text size='sm' fw='550'>
                              {owner.name+' '+owner.lastname}
                            </Text>
                            <Text size='xs' fw='500' c='dimmed'>
                              {owner.city && <span>{owner.city}/{owner.region}</span>}
                            </Text>
                            <Group gap={3}>
                              {!!owner.currentlyUsing && 
                                <Badge size='xs' color='green' variant='light'>Em uso</Badge>
                              } 
                              {!!owner.forSale && 
                                <Badge size='xs' color='black'>À venda</Badge>
                              } 
                              {!!owner.price && 
                                <Text size='xs'>
                                  {owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                                </Text>
                              }
                            </Group>
                          </Flex>
                        </Flex>
                        {owner.ownerComments ? (
                          <Text size='xs'>
                            {owner.ownerComments}
                          </Text>
                        ) : (
                          <Text size='xs' c='dimmed'>
                            Nenhum comentário até o momento
                          </Text>
                        )}
                      </Paper>
                    )
                  }
                </Box>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
      <Modal 
        centered
        opened={modalZoomOpen}
        // title={`${product.brandName} | ${product.name} ${product.colorNamePTBR ? ' | Cor: ' + product.colorNamePTBR : ''}`}
        title={product.name}
        onClose={() => setModalZoomOpen(false)} 
        scrollAreaComponent={ScrollArea.Autosize}
        size='lg'
        withCloseButton
      >
        <Center>
          <Image w='auto' fit='cover' src={product.largePicture ? product.largePicture : undefined} onClick={() => setModalZoomOpen(false)} />
        </Center>
      </Modal>
      {(!modalZoomOpen) &&
        <FooterMenuMobile />
      }
    </>
  )
}

export default GearProductPage