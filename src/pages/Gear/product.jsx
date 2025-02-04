import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { gearInfos } from '../../store/actions/gear'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Grid, Flex, Paper, Group, Center, Box, Anchor, Title, Text, Image, Avatar, Badge, Modal, ScrollArea, Skeleton } from '@mantine/core'
import { IconZoom, IconArrowRight } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'

function GearProductPage () {

  const params = useParams()
  const productId = params?.productId
  const product = useSelector(state => state.gear)
  const largeScreen = useMediaQuery('(min-width: 60em)')

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(gearInfos.getProductInfo(productId))
    dispatch(gearInfos.getProductOwners(productId))
  }, [])

  const [modalZoomOpen, setModalZoomOpen] = useState(false)
  const [extraColors, setExtraColors] = useState([{}])
  
  const [modalZoomExtraOpen, setModalZoomExtraOpen] = useState(false)
  const [extra, setExtra] = useState(null)
  const openExtraModal = (data) => {
    setExtra(data)
    setModalZoomExtraOpen(true)
  }

  const baseUrlExtraThumb = 'https://ik.imagekit.io/mublin/products/tr:h-160,w-160,cm-pad_resize,bg-FFFFFF/'
  const baseUrlExtraExpanded = 'https://ik.imagekit.io/mublin/products/tr:w-600,cm-pad_resize,bg-FFFFFF/'

  useEffect(() => {
    fetch(`https://mublin.herokuapp.com/gear/product/${productId}/productExtraColors`)
      .then(res => res.json())
      .then(
        (result) => {
          result && setExtraColors(result)
        },
        (error) => {
          console.error(error)
          setExtraColors([{}])
        }
      )
  }, [])

  return (
    <>
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
              {product.requesting ? 'Carregando...' : product.categoryName + ' • ' + product.brandName}
            </Text>
            <Title fz='1.18rem' fw='560'>
              {product.requesting ? 'Carregando produto...' : product.name}
            </Title>
            {!product.requesting &&
              <Link 
                style={{fontSize:'13px'}} 
                to={{ pathname: `/gear/brand/${product.brandSlug}` }} 
                className='websiteLink'
              >
                <Group gap='2'>
                  <IconArrowRight size={12} />
                  Ver produtos {product.brandName}
                </Group>
              </Link>
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
                  <Flex mt='12' w='340px' px='10px' wrap='wrap' justify='center' align='center'>
                    {extraColors.length && extraColors?.map((product, key) =>
                      <Image
                        key={key}
                        w='80px'
                        h='80px'
                        src={product.image ? baseUrlExtraThumb+product.image : undefined}
                        onClick={() => openExtraModal(product)}
                      />
                    )}
                  </Flex>
                </>
              )}
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
            <Title fz='1.0rem' fw='640' mb={14}>
              Quem possui {product.owners[0].id ? '('+product?.owners?.length+')' : '(0)'}
            </Title>
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
      <Modal 
        centered
        opened={modalZoomExtraOpen} 
        title={product.brandName + ' | ' + product.name + ' | ' + extra?.colorNamePTBR}
        onClose={() => setModalZoomExtraOpen(false)} 
        scrollAreaComponent={ScrollArea.Autosize}
        size='xl'
      >
        <Center>
          <Image w='300' src={baseUrlExtraExpanded+extra?.image ? baseUrlExtraExpanded+extra?.image : undefined} onClick={() => setModalZoomExtraOpen(false)} />
        </Center> 
      </Modal>
      {(!modalZoomExtraOpen && !modalZoomOpen) &&
        <FooterMenuMobile />
      }
    </>
  )
}

export default GearProductPage