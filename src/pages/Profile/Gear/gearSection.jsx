import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { profileInfos } from '../../../store/actions/profile'
import { useMantineColorScheme, ActionIcon, Modal, Center, ScrollArea, NativeSelect, Flex, Box, Paper, Group, Badge, Button, Image, Text, Title, Anchor, Divider, Spoiler, em  } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowsMaximize, IconSettings, IconPlus, IconBubbleText } from '@tabler/icons-react'
import { truncateString } from '../../../utils/formatter'
import linkifyStr from "linkify-string"
import parse from 'html-react-parser'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'

function GearSection ({ loggedUserId, username }) {

  const dispatch = useDispatch()

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const { colorScheme } = useMantineColorScheme()

  const profile = useSelector(state => state.profile)

  // Gear
  const [gearCategorySelected, setGearCategorySelected] = useState('');

  const mainProducts = useSelector(state => state.profile.gear.list).filter((product) => { return product.is_subproduct === 0 });

  const gear = mainProducts.filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 });

  const subGear = useSelector(state => state.profile.gear.list).filter((product) => { return product.is_subproduct === 1 });

  // Modal Gear Item Detail
  const [modalGearItemOpen, setModalGearItemOpen] = useState(false)
  const [gearItemDetail, setGearItemDetail] = useState({})
  const openModalGearDetail = (data) => {
    setModalGearItemOpen(true)
    setGearItemDetail(data)
    dispatch(profileInfos.setActiveModal('gearDetail'))
  }

  return (
    <>
      <Divider mb={18} className='showOnlyInMobile' />
      <Paper
        withBorder={isLargeScreen ? true : false}
        px={isMobile ? 0 : 16}
        pt={isMobile ? 0 : 12}
        pb={
          profile.gearSetups.total > 0 ? (
            (isLargeScreen && profile.gear.total > 5) ? 16 : 9
          ) : (
            (isLargeScreen && profile.gear.total > 5) ? 34 : 9
          )
        }
        mb={14}
        className='mublinModule transparentBgInMobile'
      >
        <Group justify='space-between' align='center' gap={8} mb={13}>
          <Title fz='1.03rem' fw='640'>
            Equipamento {!!profile.gear.total && `(${profile.gear.total})`}
          </Title>
          <Group gap={10}>
            {!!profile.gear.total && 
              <ActionIcon
                variant='transparent'
                size='md'
                aria-label='Gerenciar'
                component='a'
                href={`/${username}/gear`}
                title='Ver ampliado'
              >
                <IconArrowsMaximize 
                  color={colorScheme === 'light' ? 'black' : 'white'}
                  style={{ width: '80%', height: '80%' }} stroke={1.5}
                />
              </ActionIcon>
            }
            {(profile.id === loggedUserId && !profile.requesting) && 
              <>
                <ActionIcon
                  variant='transparent'
                  size='md'
                  aria-label='Gerenciar'
                  component='a'
                  href='/settings/my-gear'
                  title='Adicionar item'
                >
                  <IconPlus 
                    color={colorScheme === 'light' ? 'black' : 'white'}
                    style={{ width: '91%', height: '91%' }} stroke={1.5}
                  />
                </ActionIcon>
                <ActionIcon
                  variant='transparent'
                  size='md'
                  aria-label='Gerenciar'
                  component='a'
                  href='/settings/my-gear'
                  title='Gerenciar'
                >
                  <IconSettings 
                    color={colorScheme === 'light' ? 'black' : 'white'}
                    style={{ width: '91%', height: '91%' }} stroke={1.5}
                  />
                </ActionIcon>
              </>
            }
          </Group>
        </Group>
        {profile.requesting ? ( 
          <Text size='sm'>Carregando...</Text>
        ) : (
          <>
            {(profile.gear.total > 1 && profile.gearCategories.total > 1) && 
              <NativeSelect
                // description='Tipo de equipamento'
                size='sm'
                w={145}
                mb={14}
                onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
              >
                <option value="">
                  Exibir tudo
                </option>
                {profile.gearCategories.list.map((gearCategory, key) =>
                  <option key={key} value={gearCategory.category}>
                    {truncateString(`(${gearCategory.total}) ${gearCategory.category}`,28)}
                  </option>
                )}
              </NativeSelect>
            }
            {profile.gear.total ? ( 
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
                {gear.map(product =>
                  <SplideSlide key={product.productId}>
                    <Flex
                      direction='column'
                      justify='flex-start'
                      align='center'
                      className='carousel-gear'
                      pos='relative'
                    >
                      <Image
                        // src={product.brandLogo}
                        src={'https://ik.imagekit.io/mublin/products/brands/tr:w-70,h-70,cm-pad_resize,bg-FFFFFF,fo-x/'+product.brandLogoFilename}
                        h={35}
                        mah={35}
                        w='auto'
                        fit='contain'
                        radius='xl'
                        pos='absolute'
                        left='0'
                      />
                      {product.ownerComments && 
                        <Box
                          pos='absolute'
                          right={12}
                          pt={8}
                          title='Possui comentários do usuário'
                        >
                          <IconBubbleText 
                            size={16}
                            color='gray'
                          />
                        </Box>
                      }
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
                        <Group gap={2} my={3}>
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
                      {subGear.filter((p) => { return p.parent_product_id === product.user_gear_id }).length > 0 &&
                        <Text size='10px'>+ {subGear.filter((p) => { return p.parent_product_id === product.user_gear_id }).length} sub itens</Text>
                      }
                      {/* <Flex gap={4}>
                        {subGear.filter((p) => { return p.parent_product_id === product.user_gear_id }).slice(0, 3).map(subGear =>
                          <Image
                            key={subGear.productId}
                            src={'https://ik.imagekit.io/mublin/products/tr:w-60,h-60,cm-pad_resize,bg-FFFFFF,fo-x/'+subGear.pictureFilename}
                            h={30}
                            mah={30}
                            w='auto'
                            fit='contain'
                            mb={10}
                            radius='sm'
                            onClick={() => openModalGearDetail(product)}
                            className='point'
                            title={`${subGear.category} ${subGear.brandName} ${subGear.productName}`}
                          />
                        )}
                      </Flex> */}
                    </Flex>
                  </SplideSlide>
                )}
              </Splide>
            ) : (
              <Text size='sm' c='dimmed'>Nenhum equipamento cadastrado</Text>
            )}
          </>
        )}
        {profile.gearSetups.total && 
          <Box mt={40}>
            <Title fz='0.9rem' fw='640' mb={12}>
              Setups de {profile.name} {profile.lastname} {!!profile.gear.total && `(${profile.gearSetups.total})`}
            </Title>
            <Splide 
                options={{
                  drag: 'free',
                  snap: false,
                  perPage: isMobile ? 2 : 6,
                  autoWidth: false,
                  arrows: false,
                  gap: '22px',
                  dots: true,
                  pagination: true,
                }}
              >
                {profile.gearSetups.setups.map(setup =>
                  <SplideSlide key={setup.id}>
                    <Flex direction='column' gap={2}>
                      <Center>
                        <Image
                          src={'https://ik.imagekit.io/mublin/users/gear-setups/tr:w-120,h-120/'+setup.image}
                          h={60}
                          mah={60}
                          w='auto'
                          fit='contain'
                          radius='md'
                          className='point'
                        />
                      </Center>
                      <Text ta='center' fw={550} size='xs' className='lhNormal'>
                        {setup.name}
                      </Text>
                      <Text ta='center' size='xs' className='lhNormal'>
                        {setup.totalItems} itens
                      </Text>
                    </Flex>
                  </SplideSlide>
                )}
              </Splide>
          </Box>
        }
      </Paper>
      <Modal 
        opened={modalGearItemOpen}
        onClose={() => {
          setModalGearItemOpen(false)
          dispatch(profileInfos.setActiveModal(null))
        }}
        centered
        title={
          <Flex direction='column'>
            <Text size='md' fw='500'>
              {gearItemDetail.brandName} {gearItemDetail.productName}
            </Text>
            <Text size='xs' c='dimmed'>
              Item do equipamento de {profile.name} {profile.lastname}
            </Text>
          </Flex>
        }
        withCloseButton
        size='md'
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Center>
          <Image
            src={'https://ik.imagekit.io/mublin/products/tr:w-400,cm-pad_resize,bg-FFFFFF/'+gearItemDetail.pictureFilename}
            w={200}
            fit='contain'
            mb='10'
            radius='md'
          />
        </Center>
        <Center>
          <Anchor
            href={`/company/${gearItemDetail.brandSlug}`}
          >
            <Image
              src={'https://ik.imagekit.io/mublin/products/brands/tr:w-150/'+gearItemDetail.brandLogoFilename}
              h='auto'
              w={75}
              fit='contain'
            />
          </Anchor>
        </Center>
        <Text ta='center' c='dimmed' fz='11px'>
          *Foto genérica. Não representa necessariamente o item real
        </Text>
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
        {!!subGear.filter((p) => { return p.parent_product_id === gearItemDetail.user_gear_id }).length && 
          <>
            <Divider my={10} />
            <Text size='xs' ta='center' fw='450' mb={4}>Itens que fazem parte:</Text>
            <Splide 
              options={{
                drag: 'free',
                snap: false,
                perPage: isMobile ? 2 : 5,
                autoWidth: true,
                arrows: false,
                gap: '22px',
                dots: false,
                pagination: false,
              }}
            >
              {subGear.filter((p) => { return p.parent_product_id === gearItemDetail.user_gear_id }).map(s =>
                <SplideSlide key={s.productId}>
                  <Flex direction='column' align='center'>
                    <Anchor
                      href={`/gear/product/${s.productId}`}
                      mb={4}
                    >
                      <Image
                        mb={4}
                        key={s.productId}
                        src={'https://ik.imagekit.io/mublin/products/tr:w-120,h-120,cm-pad_resize,bg-FFFFFF,fo-x/'+s.pictureFilename}
                        h={60}
                        mah={60}
                        w='auto'
                        fit='contain'
                        radius='sm'
                      />
                    </Anchor>
                    <Text ta='center' size='10px' c='dimmed'>{s.brandName}</Text>
                    <Text ta='center' size='10px'>{truncateString(s.productName, 18)}</Text>
                  </Flex>
                </SplideSlide>
              )}
            </Splide>
          </>
        }
        {gearItemDetail.ownerComments && 
          <>
            <Divider my={10} />
            <Group gap={4} align='center' justify='center' mb={8}>
              <IconBubbleText size={16} />
              <Text size='xs' className='lhNormal'>
                Comentários de {profile.name} {profile.lastname}:
              </Text>
            </Group>
            <Paper withBorder className="mublinModule transparentBgInMobile" radius='md' p={10}>
              <Spoiler
                maxHeight={36}
                showLabel={
                  <Text size='sm'>...mais</Text>
                }
                hideLabel={false}
                transitionDuration={0}
              >
                <Text
                  size='sm'
                  className='lhNormal'
                  style={{whiteSpace:'pre-wrap'}}
                >
                  {parse(linkifyStr(gearItemDetail.ownerComments, {target: '_blank'}))}
                </Text>
              </Spoiler>
            </Paper>
          </>
        }
        <Button 
          color='mublinColor'
          component='a'
          size='sm'
          fullWidth
          href={`/gear/product/${gearItemDetail.productId}`}
          mt={22}
        >
          Ver mais informações deste item
        </Button>
      </Modal>
    </>
  )
}

export default GearSection