import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { profileInfos } from '../../../store/actions/profile'
import { Skeleton, Container, Flex, Box, Center, Avatar, Title, Text, Card, Image, Badge, Tooltip, Anchor, Spoiler } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react'
import Header from '../../../components/header'
import FloaterHeader from '../floaterHeader'
import FooterMenuMobile from '../../../components/footerMenuMobile'
import GearExpandedLoading from './gearExpandedLoading'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import linkifyStr from "linkify-string"
import parse from 'html-react-parser'
import '../styles.scss'

function GearSetup () {

  const dispatch = useDispatch()
  const params = useParams()
  const username = params?.username
  const setupId = params?.setupId

  const profile = useSelector(state => state.profile)

  const [scroll] = useWindowScroll()

  useEffect(() => {
      dispatch(profileInfos.getProfileInfo(username))
      dispatch(profileInfos.getProfileGearSetup(username, setupId))
      dispatch(profileInfos.getProfileGearSetupItems(username, setupId))
      dispatch(profileInfos.getProfileRoles(username))
  }, [username])

  return (
    <>
      <Helmet>
        <title>{!profile.success && !profile.id ? 'Mublin' : `Setup ${profile.gearSetup.name} de ${profile.name} ${profile.lastname} | Mublin`}</title>
        <link rel='canonical' href={`https://mublin.com/${profile.name}/setup/${setupId}`} />
      </Helmet>
      <Header
        page='profile'
        username={username}
        profileId={profile.id}
        showBackIcon={true}
      />
      {(profile.id) &&
        <FloaterHeader profile={profile} scrollY={scroll.y} />
      }
      <Container size='lg' my={14}>
        {profile.requesting ? (
          <Flex gap={10} align='center'>
            <Skeleton h={60} w={60} circle />
            <Flex direction='column'>
              <Skeleton width={100} height={18} radius="xl" />
              <Skeleton width={150} height={12} mt={4} radius="xl" />
            </Flex>
          </Flex>
        ) : (
          <Flex gap={10} align='center'>
            <Avatar.Group>
              <Avatar 
                size='lg' 
                src={profile.picture ? profile.picture : undefined} 
                component='a'
                href={`/${username}`}
                className='point'
              />
              <Avatar size='xl' src={profile.gearSetup.name ? `https://ik.imagekit.io/mublin/users/gear-setups/${profile.gearSetup.image}` : undefined} />
            </Avatar.Group>
            <Box>
              <Flex>
                <Title fz='1.30rem' fw='600'>
                  {profile.name} {profile.lastname}
                </Title>
                {!!profile.verified && 
                  <Tooltip label='Usuário Verificado'>
                    <IconRosetteDiscountCheckFilled 
                      className='iconVerified'
                      onClick={() => setModalVerifiedOpen(true)}
                    />
                  </Tooltip>
                }
                {!!profile.legend && 
                  <Tooltip label='Lenda da Música'>
                    <IconShieldCheckFilled
                      className='iconLegend'
                      onClick={() => setModalLegendOpen(true)}
                    />
                  </Tooltip>
                }
              </Flex>
              <Text size='md' className='lhNormal'>
                Setup <Text span fw={550}>{profile.gearSetup.name}</Text> ({profile.gearSetupItems.total} itens)
              </Text>
              <Text size='sm' c='dimmed' className='lhNormal'>
                {profile.gearSetup.description}
              </Text>
            </Box>
          </Flex>
        )}
      </Container>
      {profile.plan === 'Pro' && 
        <Container size='lg' mb={100} mt={30}>
          {profile.requesting ? (
            <GearExpandedLoading />
          ) : (
            <>
              {profile.gearSetupItems.total === 0 ? (
                <Text>{profile.name} {profile.lastname} ainda não adicionou nenhum item a este setup :(</Text>
              ) : (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{350: 2, 750: 3, 900: 4}}
                  gutterBreakpoints={{350: "8px", 750: "8px", 900: "8px"}}
                >
                  <Masonry>
                    {profile.gearSetupItems.items.map(product =>
                      <Card
                        withBorder
                        className='mublinModule gearDetailCard'
                        px={10}
                        pb={10}
                        pt={0}
                        key={product.id}
                        w='100%'
                      >
                        <Center>
                          <Anchor
                            href={`/company/${product.brandSlug}`}
                          >
                            <Image
                              src={product.brandLogo ? `https://ik.imagekit.io/mublin/products/brands/tr:h-150,w-150,cm-pad_resize,bg-FFFFFF/${product.brandLogo}` : undefined}
                              h={75}
                              w={75}
                            />
                          </Anchor>
                        </Center>
                        <Center>
                          <Image
                            src={product.picture ? 'https://ik.imagekit.io/mublin/products/tr:h-240,cm-pad_resize,bg-FFFFFF,fo-x/'+product.picture : undefined}
                            h={120}
                            mah={120}
                            w='auto'
                            fit='contain'
                            mb={10}
                            radius='md'
                            className='point'
                          />
                        </Center>
                        <Text
                          ta='center'
                          size='xs'
                          fw={380}
                        >
                          {product.category} • {product.brandName}
                        </Text>
                        <Text
                          ta='center'
                          size='md'
                          fw={550}
                        >
                          {product.name}
                        </Text>
                        {product.tuning && 
                          <Text
                            size='xs'
                            c='dimmed'
                            ta='center'
                          >
                            Afinação: {product.tuning}
                          </Text>
                        }
                        {!!product.forSale && 
                          <Flex direction='column' align='center' gap={4} mt={4}>
                            <Badge size='xs' color='dark'>À venda</Badge>
                            {!!product.price && 
                              <Text size='xs' fw={500}>
                                {product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                              </Text>
                            }
                          </Flex>
                        }
                        {product.productComments && 
                          <>
                            <Flex mt={8} align='center' gap={4}>
                              <Avatar 
                                size='xs' 
                                src={profile.picture ? profile.picture : undefined} 
                                component='a'
                                href={`/${username}`}
                                className='point'
                                alt={profile.name}
                                title={username}
                              />
                              <Text size='xs' fw={550}>
                                Sobre o produto:
                              </Text>
                            </Flex>
                            <Card mt={6} p={6} withBorder className='mublinModule gearDetailCard'>
                              <Text size='xs' style={{whiteSpace:'pre-wrap'}}>
                                {parse(linkifyStr(product.productComments, {target: '_blank'}))}
                              </Text>
                            </Card>
                          </>
                        }
                        {product.itemSetupComments && 
                          <>
                            <Flex mt={8} align='center' gap={4}>
                              <Avatar 
                                size='xs' 
                                src={profile.picture ? profile.picture : undefined} 
                                component='a'
                                href={`/${username}`}
                                className='point'
                                alt={profile.name}
                                title={username}
                              />
                              <Text size='xs' fw={550}>
                                Sobre o uso neste setup:
                              </Text>
                            </Flex>
                            <Card mt={6} p={6} withBorder className='mublinModule gearDetailCard'>
                              <Text size='xs' style={{whiteSpace:'pre-wrap'}}>
                                {parse(linkifyStr(product.itemSetupComments, {target: '_blank'}))}
                              </Text>
                            </Card>
                          </>
                        }
                      </Card>
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </>
          )}
        </Container>
      }
      {profile.plan === 'Free' && 
        <Container size='lg' mt={80}>
          <Text ta='center'>
            Visualização de equipamento não disponível para este perfil
          </Text>
        </Container>
      }
      <FooterMenuMobile />
    </>
  )
}

export default GearSetup