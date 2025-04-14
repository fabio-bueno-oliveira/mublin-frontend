import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { gearInfos } from '../../store/actions/gear'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Flex, Paper, Group, Center, Box, Anchor, Title, Text, Image, Avatar, Badge, Modal, ScrollArea, Skeleton, ColorSwatch } from '@mantine/core'
import { IconZoom, IconChevronUp, IconDiamond, IconUserHeart, IconX } from '@tabler/icons-react'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'

function GearProductPage () {

  const params = useParams()
  const productId = params?.productId
  const product = useSelector(state => state.gear)

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
        <title>{product.requesting ? 'Mublin' : `${product.name} | ${product.brandName} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/gear/product/${product.id}`} />
        <meta name='description' content='A rede para quem trabalha com música' />
      </Helmet>
      <Header
        page='profile'
        username='Detalhes do item'
        profileId={product.id}
        showBackIcon={true}
        showDotsMenu={false}
      />
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
            <Text classNames='lhNormal' fw='420' size='sm' c='dimmed'>
              {product.requesting ? <Skeleton width={100} height={10} mb={4} radius="md" /> : product.categoryName + ' • ' + product.brandName}
            </Text>
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
            {/* {!product.requesting &&
              <Anchor mt={10} c='dimmed' fz='xs' href={`/company/${product.brandSlug}`}>
                Ver produtos {product.brandName}
              </Anchor>
            } */}
            {!!product.discontinued &&
              <Badge size='xs' color='gray' variant='light'>
                Produto descontinuado pelo fabricante
              </Badge>
            }
          </Flex>
        </Flex>
        <Grid mt='20' mb='70'>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            {/* {!!product.rare &&
              <Group gap={4} align='center' justify='center' mb={10}>
                <IconDiamond style={{width:'1rem',height:'1rem'}} />
                <Text
                  fz='0.75rem'
                  ta='center'
                  fw='450'
                  className='lhNormal'
                >
                  Item considerado raro ou limitado
                </Text>
              </Group>
            } */}
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
                          // onClick={() => navigate("/gear/product/zoom/"+productId)}
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
            <Group gap={4} align='center' mb={10}>
              <IconUserHeart style={{width:'1rem',height:'1rem'}} />
              <Text fz='0.9rem' fw='640' className='lhNormal'>
                Quem possui
              </Text>
              <Badge variant='light' color='gray' radius='sm'>
                {product.owners.total}
              </Badge>
            </Group>
            {product.requesting ? (
              <Text my={14} size='sm' c='dimmed'>Carregando...</Text>
            ) : (
              <Box mb={30}>
                {product.owners.total ? ( 
                  product.owners.result.map(owner => 
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
                        <Text size='sm'>
                          {owner.ownerComments}
                        </Text>
                      ) : (
                        <Text size='sm' c='dimmed'>
                          Nenhum comentário até o momento
                        </Text>
                      )}
                    </Paper>
                  )
                ) : (
                  <Text my={14} size='sm' c='dimmed'>Ninguém por aqui</Text>
                )}
              </Box>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Modal 
        centered
        fullScreen
        opened={modalZoomOpen}
        title={!product.requesting ? (
            <>
              <Text>{`${product.brandName} • ${product.name}`}</Text>
              {selectedColor ? (
                <Text size='xs' c='dimmed'>{selectedColor.colorNamePTBR}</Text>
              ) : (
                product.colorNamePTBR && <Text size='xs' c='dimmed'>{product.colorNamePTBR}</Text>
              )}
            </>
          ) : (
            <Text size='xs' c='dimmed'>Carregando...</Text>
          )
        }
        onClose={() => setModalZoomOpen(false)} 
        size='lg'
        withCloseButton
        closeButtonProps={{
          icon: <IconX size={25} stroke={2} />,
        }}
        // scrollAreaComponent={ScrollArea.Autosize}
      >
        <ScrollArea w='auto'>
          <Flex justify='center'>
            {selectedColor ? (
              <Image 
                w='auto' 
                src={selectedColor.largePicture ? selectedColor.largePicture : undefined} 
                onClick={() => setModalZoomOpen(false)} 
              />
            ) : (
              <Image 
                w='auto' 
                src={product.largePicture ? product.largePicture : undefined} 
                onClick={() => setModalZoomOpen(false)} 
              />
            )}
          </Flex>
        </ScrollArea>
      </Modal>
      {(!modalZoomOpen) &&
        <FooterMenuMobile />
      }
    </>
  )
}

export default GearProductPage