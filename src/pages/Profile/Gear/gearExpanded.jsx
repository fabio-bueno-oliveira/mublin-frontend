import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { profileInfos } from '../../../store/actions/profile'
import { Modal, Skeleton, Group, Button, Container, Flex, Box, Center, Avatar, Title, Text, Card, Image, Badge, Tooltip, Anchor } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconArrowLeft } from '@tabler/icons-react'
import Header from '../../../components/header'
import FloaterHeader from '../floaterHeader'
import FooterMenuMobile from '../../../components/footerMenuMobile'
import GearExpandedLoading from './gearExpandedLoading'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import '../styles.scss'

function ProfileGearExpanded () {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const username = params?.username

  const profile = useSelector(state => state.profile)
  const gear = useSelector(state => state.profile.gear)

  document.title = !profile.success && !profile.id ? 'Mublin' : `Equipamento de ${profile.name} ${profile.lastname} | Mublin`;

  const [scroll] = useWindowScroll()

  useEffect(() => {
      dispatch(profileInfos.getProfileInfo(username))
      dispatch(profileInfos.getProfileGear(username))
      dispatch(profileInfos.getProfileRoles(username))
  }, [username])

  // Modal Gear Item Detail
  const [modalGearItemOpen, setModalGearItemOpen] = useState(false)
  const [gearItemDetail, setGearItemDetail] = useState({})
  const openModalGearDetail = (data) => {
    setModalGearItemOpen(true)
    setGearItemDetail(data)
  }

  return (
    <>
      <Header
        page='profile'
        username={username}
        profileId={profile.id}
        showBackIcon={true}
      />
      {(profile.id && !modalGearItemOpen) &&
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
                {gear.total} itens no equipamento de {username}
              </Text>
              <Anchor 
                href={`/${username}`}
                underline='never'
                className='websiteLink'
              >
                <Group gap={3}>
                  <IconArrowLeft size={13}  />
                  <Text size='xs'>Voltar ao perfil</Text>
                </Group>
              </Anchor>
            </Box>
          </Flex>
        )}
      </Container>
      {profile.plan === 'Pro' && 
        <Container size='lg' mb={100} mt={30}>
          {profile.requesting ? (
            <GearExpandedLoading />
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{350: 2, 750: 3, 900: 4}}
            >
              <Masonry gutter='8px'>
                {gear.list.map(product =>
                  <Card
                    withBorder
                    className='mublinModule gearDetailCard'
                    px={10}
                    pb={10}
                    pt={0}
                    key={product.productId}
                  >
                    <Center>
                      <Anchor
                        href={`/gear/brand/${product.brandSlug}`}
                      >
                        <Image
                          src={product.brandLogoFilename ? `https://ik.imagekit.io/mublin/products/brands/tr:h-150,w-150,cm-pad_resize,bg-FFFFFF/${product.brandLogoFilename}` : undefined}
                          h={75}
                          w={75}
                        />
                      </Anchor>
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
                        onClick={() => openModalGearDetail(product)}
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
              {gearItemDetail.category} • Item do equipamento de {profile.name}
            </Text>
            <Anchor
              mt={6}
              size='xs'
              c='violet'
              fw='500'
              href={`/gear/product/${gearItemDetail.productId}`}
            >
              Ver detalhes deste produto
            </Anchor>
          </Flex>
        }
        withCloseButton
        size='md'
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
      </Modal>
      {profile.plan === 'Free' && 
        <Container size='lg' mt={80}>
          <Text ta='center'>
            Visualização de equipamento não disponível para este perfil
          </Text>
        </Container>
      }
      {!modalGearItemOpen && 
        <FooterMenuMobile />
      }
    </>
  )
}

export default ProfileGearExpanded