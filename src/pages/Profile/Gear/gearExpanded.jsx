import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { profileInfos } from '../../../store/actions/profile'
import { Skeleton, Container, Flex, Box, Center, Avatar, Title, Text, Card, Image, Badge, Tooltip, em } from '@mantine/core'
import { useWindowScroll, useMediaQuery } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react'
import Header from '../../../components/header'
import FloaterHeader from '../floaterHeader'
import FooterMenuMobile from '../../../components/footerMenuMobile'
import GearExpandedLoading from './gearExpandedLoading'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'

function ProfileGearExpanded () {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const username = params?.username

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const profile = useSelector(state => state.profile)
  const gear = useSelector(state => state.profile.gear)

  const [scroll] = useWindowScroll()

  useEffect(() => {
      dispatch(profileInfos.getProfileInfo(username))
      dispatch(profileInfos.getProfileGear(username))
      dispatch(profileInfos.getProfileGearSetups(username))
  }, [username])

  return (
    <>
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
            <Avatar
              size='lg'
              src={profile.picture ? profile.picture : undefined}
              onClick={() => navigate(`/${username}`)}
              className='point'
            />
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
              <Text size='sm'>
                {gear.total} produtos no equipamento de {profile.name} {profile.lastname}
              </Text>
            </Box>
          </Flex>
        )}
      </Container>
      {profile.plan === 'Pro' && 
        <Container size='lg'>
          {profile.requesting ? (
            <GearExpandedLoading />
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{350: 1, 750: 3, 900: 3}}
            >
              <Masonry gutter='8px'>
                {gear.list.map(product =>
                  <Card
                    radius='md'
                    withBorder={isLargeScreen ? true : false}
                    style={isMobile ? { backgroundColor: 'transparent' } : undefined}
                    className='mublinModule'
                  >
                    <Center>
                      <Image src={product.brandLogo ? product.brandLogo : undefined} h={100} w={100} />
                    </Center>
                    <Center>
                      <Image
                        src={product.pictureFilename ? 'https://ik.imagekit.io/mublin/products/tr:h-240,cm-pad_resize,bg-FFFFFF,fo-x/'+product.pictureFilename : undefined}
                        h={120}
                        mah={120}
                        w='auto'
                        fit='contain'
                        mb={10}
                        radius='md'
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
                      size='sm'
                      fw={550}
                    >
                      {product.productName}
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
                    {product.ownerComments && 
                      <Text size='xs' lineClamp={3} mt={10}>
                        <strong>Comentários de {profile.name}:</strong> {product.ownerComments} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tortor leo, posuere non finibus id, aliquam id tortor. Nunc sed nisi metus. Integer id porttitor metus. Sed sed tristique sapien. Cras et metus quis nulla tempus rhoncus in a nisl. Integer a odio consectetur leo luctus pellentesque.
                      </Text>
                    }
                  </Card>
                )}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </Container>
      }
      {profile.plan === 'Free' && 
        <Text>Visualização de equipamento não disponível para este perfil</Text>
      }
      <FooterMenuMobile />
    </>
  )
}

export default ProfileGearExpanded