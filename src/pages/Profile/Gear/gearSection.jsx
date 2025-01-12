import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useMantineColorScheme, ActionIcon, Modal, Center, Card, ScrollArea, NativeSelect, Flex, Box, Paper, Group, Badge, Image, Text, Title, Button, Divider, em  } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowsMaximize, IconSettings } from '@tabler/icons-react'
import { truncateString } from '../../../utils/formatter'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'

function GearSection ({ loggedUserId, loggedUsername }) {
  
  const navigate = useNavigate()

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme()

  const gear = useSelector(state => state.profile.gear.list)
    .filter((product) => { return product.productId > 0 })

  const gearFiltered = gear

  const profile = useSelector(state => state.profile)

  // Modal Gear Item Detail
  const [modalGearItemOpen, setModalGearItemOpen] = useState(false)
  const [gearItemDetail, setGearItemDetail] = useState({})
  const openModalGearDetail = (data) => {
    setModalGearItemOpen(true)
    setGearItemDetail(data)
  }

  return (
    <>
      <Divider mb={18} className='showOnlyInMobile' />
      <Paper
        radius='md'
        withBorder={isLargeScreen ? true : false}
        px={isMobile ? 0 : 16}
        pt={isMobile ? 0 : 12}
        pb={(isLargeScreen && profile.gear.total > 5) ? 34 : 9}
        mb={14}
        style={isMobile ? { backgroundColor: 'transparent' } : undefined}
        className='mublinModule'
      >
        <Group justify='space-between' align='center' gap={8} mb={13}>
          <Title fz='1.03rem' fw='640'>
            Equipamento {!!profile.gear.total && `(${profile.gear.total})`}
          </Title>
          <Group>
            {profile.gear.total && 
              <Button 
                size='xs'
                variant='light'
                color={colorScheme === 'light' ? 'dark' : 'gray'}
                leftSection={<IconArrowsMaximize size={14} />}
                component='a'
                href={`/${loggedUsername}/gear`}
              >
                Ampliar
              </Button>
            }
            {(profile.id === loggedUserId && !profile.requesting) && 
              <ActionIcon 
                variant="transparent" 
                size="lg" 
                aria-label="Gerenciar" 
                component='a'
                href='/settings/my-gear'
              >
                <IconSettings 
                  color={colorScheme === 'light' ? 'black' : 'gray'}
                  style={{ width: '70%', height: '70%' }} stroke={1.5}
                />
              </ActionIcon>
            }
          </Group>
        </Group>
        {profile.requesting ? ( 
          <Text size='sm'>Carregando...</Text>
        ) : (
          <>
            {!!profile.gear.total && 
              <Group gap={10} mb={14}>
                <NativeSelect
                  // description='Tipo de equipamento'
                  size='sm'
                  w={145}
                  onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                >
                  <option value="">
                    Exibir tudo
                  </option>
                  {profile.gearCategories.list.map((gearCategory, key) =>
                    <option key={key} value={gearCategory.category}>
                      {truncateString(gearCategory.category) + '(' + gearCategory.total + ')'}
                    </option>
                  )}
                </NativeSelect>
              </Group>
            }
            {profile.gear.total ? ( 
              <>
                <Splide 
                  options={{
                    drag: 'free',
                    snap: false,
                    perPage: isMobile ? 2 : 5,
                    autoWidth: true,
                    arrows: false,
                    gap: '22px',
                    dots: true,
                    pagination: true,
                  }}
                >
                  {gearFiltered.map(product =>
                    <SplideSlide key={product.productId}>
                      <Flex
                        direction='column'
                        justify='flex-start'
                        align='center'
                        className='carousel-gear'
                      >
                        <Image
                          src={'https://ik.imagekit.io/mublin/products/tr:w-240,h-240,cm-pad_resize,bg-FFFFFF,fo-x/'+product.pictureFilename}
                          h={120}
                          mah={120}
                          w='auto'
                          fit='contain'
                          mb={10}
                          radius='md'
                          onClick={() => openModalGearDetail(product)}
                          className='point'
                        />
                        {/* <Image 
                          src={'https://ik.imagekit.io/mublin/tr:h-300,cm-pad_resize,bg-FFFFFF/products/'+picture}
                          height='205' 
                          ml='10' 
                        /> */}
                        <Box w={110}>
                          <Text size='11px' fw={550} mb={3} truncate='end' title={product.brandName}>
                            {product.brandName}
                          </Text>
                          <Text size='sm' truncate='end' title={product.productName}>
                            {product.productName}
                          </Text>
                        </Box>
                        {product.tuning && 
                          <Group gap={2} mt={4} mb='2'>
                            <Text
                              size='9px'
                              fw='450'
                              c='dimmed'
                            >
                              Afinação: {product.tuning}
                            </Text>
                          </Group>
                        }
                        {!!product.forSale && 
                          <Flex direction='column' align='center' gap={4} mt={4}>
                            <Badge size='xs' color='dark'>À venda</Badge>
                            {!!product.price && 
                              <Text size='10px' fw={500}>
                                {product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                              </Text>
                            }
                          </Flex>
                        }
                      </Flex>
                    </SplideSlide>
                  )}
                </Splide>
              </>
            ) : (
              <Text size='sm' c='dimmed'>Nenhum equipamento cadastrado</Text>
            )}
          </>
        )}
      </Paper>
      <Modal 
        opened={modalGearItemOpen}
        onClose={() => setModalGearItemOpen(false)}
        centered
        title={
          <Flex direction='column'>
            <Text size='md' fw='500'>
              {gearItemDetail.brandName} {gearItemDetail.productName}
            </Text>
            <Text size='xs' c='dimmed'>
              Parte do equipamento de {profile.name}
            </Text>
          </Flex>
        }
        withCloseButton
        size='md'
      >
        <Center>
          <Image 
            src={'https://ik.imagekit.io/mublin/products/tr:h-500,w-500,cm-pad_resize,bg-FFFFFF/'+gearItemDetail.pictureFilename}
            h={250}
            mah={250}
            w='auto'
            fit='contain'
            mb='10'
            radius='md'
          />
        </Center>
        {gearItemDetail.tuning && 
          <Box>
            <Text ta='center' size='xs' fw='380'>Afinação: {gearItemDetail.tuning}</Text>
            <Text ta='center' size='xs' c='dimmed'>{gearItemDetail.tuningDescription}</Text>
          </Box>
        }
        {!!gearItemDetail.forSale && 
          <Flex align='center' justify='center' gap='4' mt='4'>
            <Badge size='md' color='dark'>À venda</Badge>
            {!!gearItemDetail.price && 
              <Text size='xs' fw='450'>
                {gearItemDetail.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
              </Text>
            }
          </Flex>
        }
        {gearItemDetail.ownerComments && 
          <Card className='mublinModule' px='10' py='10' mt='xs'>
            <ScrollArea h='72' type='auto'>
              <Text size='sm'>{gearItemDetail.ownerComments}</Text>
            </ScrollArea>
          </Card>
        }
        <Button
          size='sm'
          variant='light'
          color={colorScheme === 'light' ? 'dark' : 'gray'}
          fullWidth
          fw='600'
          component='a'
          href={`/gear/product/${gearItemDetail.productId}`}
        >
          Ver detalhes do produto
        </Button>
      </Modal>
    </>
  )
}

export default GearSection