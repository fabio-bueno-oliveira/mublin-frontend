import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { profileInfos } from '../../../store/actions/profile'
import Header from '../../../components/header/public'
import {
  Container, Box, Button, Center, Card, 
  Flex, Group, Anchor, Avatar, Image, 
  Title, Text, Badge,
  Skeleton, Indicator, Modal 
} from '@mantine/core'
import { IconMapPin, IconLink } from '@tabler/icons-react'
import { Helmet } from 'react-helmet'
import { truncateString } from '../../../utils/formatter'

function PublicProfilePage () {

  const params = useParams()
  const username = params.username
  const cdnBaseURL = 'https://ik.imagekit.io/mublin'

  const profile = useSelector(state => state.profile)
  const gearTotal = useSelector(state => state.profile.gear.total)
  const gear = useSelector(state => state.profile.gear.list).filter((product) => { return product.is_subproduct === 0 });

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username))
    dispatch(profileInfos.getProfileProjects(username))
    dispatch(profileInfos.getProfileRoles(username))
    dispatch(profileInfos.getProfileFollowers(username))
    dispatch(profileInfos.getProfileFollowing(username))
    dispatch(profileInfos.getProfileAvailabilityItems(username))
    dispatch(profileInfos.getProfileGear(username))
  }, [dispatch, username])

  const [showModalProfileInfo, setShowModalProfileInfo] = useState(false)

  // useEffect(() => {
  //   if (profile.success) {
  //     setShowModalProfileInfo(true)
  //   }
  // }, [profile.success])

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{profile.name} {profile.lastname} ({username})  | Mublin</title>
        <link rel='canonical' href={`https://mublin.com/${username}`} />
        <meta name='description' content={`${username} está no Mublin! A rede para músicos`} />
      </Helmet>
      <Header />
      <Container size='lg' mb={50} mih={340}>
        {profile.requesting &&
          <Flex
            gap='md'
            justify='flex-start'
            align='center'
          >
            <Skeleton height={100} width={100} radius='lg' />
            <Box>
              <Skeleton height={18} width={180} radius='xl' />
              <Skeleton height={14} width={155} mt={6} radius='xl' />
              <Skeleton height={12} width={165} mt={6} radius='xl' />
            </Box>
          </Flex>
        }
        {(!profile.requesting && profile.id) && 
          <>
            <Text size='xl' mb={3} fw={600} className='lhNormal'>
              {profile.name} {profile.lastname}
            </Text>
            <Group gap='2'>
              {profile.roles.map(role =>
                <Badge variant='light' py={9} color='primary' size='xs' key={role.id}>
                  <span>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'middle'}} />} {role.description}</span>
                </Badge>
              )}
            </Group>
            <Flex
              mih={50}
              gap='sm'
              justify='flex-start'
              align='center'
              direction='row'
              pt='md'
              pb='sm'
            >
              <Avatar
                h={100}
                w={100}
                fit=''
                radius='lg'
                src={profile.picture ? profile.picture : undefined}
                alt={`Foto de perfil de ${profile.name} ${profile.lastname} no Mublin`} 
              />
              <Box>
                <Text size='lg' fw={600}>
                  {username}
                </Text>
                <Group gap={8} mb={2}>
                  <Text size='xs'>{`${profile?.followers?.total} seguidores`}</Text>
                  <Text size='xs'>{`${profile?.following?.total} seguindo`}</Text>
                  {/* <Text size='xs'>{profile?.projects?.total} {profile?.projects?.total === 1 ? 'projeto' : 'projetos'}</Text> */}
                </Group>
                {profile.city && 
                  <Group gap={2} align='center'>
                    <IconMapPin size={13} color='#8d8d8d' />
                    <Text c='dimmed' size='11px'>
                      <Text span className='comma'>{profile.city}</Text>
                      <Text span className='comma'>{profile.regionUF}</Text>
                      <Text span className='comma'>{profile.country}</Text>
                    </Text>
                  </Group>
                }
                <Flex
                  align='center'
                  justify='flex-start'
                  gap={3}
                  mt={4}
                >
                  <Indicator
                    inline
                    processing={profile.availabilityId === 1}
                    color={profile.availabilityColor}
                    size={8}
                    ml={4}
                    mr={7}
                  />
                  <Text
                    fz='xs'
                    fw='490'
                    className='lhNormal'
                    pt='1px'
                  >
                    {profile.availabilityTitle}
                  </Text>
                </Flex>
              </Box>
            </Flex>
            {(profile.bio && profile.bio !== 'null') && 
              <Text size='sm' style={{lineHeight:'1.24em',whiteSpace:'pre-wrap'}}>
                {profile.bio}
              </Text>
            }
            {profile.website && 
              <Anchor 
                href={profile.website} 
                target='_blank'
                underline='hover'
                className='websiteLink'
              >
                <Flex gap={2} align='center'>
                  <IconLink size={13} />
                  <Text size='sm' className='lhNormal'>
                    {truncateString(profile.website, 45)}
                  </Text>
                </Flex>
              </Anchor>
            }
            {gearTotal > 0 &&
              <Flex gap={8} justify='flex-start' align='flex-start' mt={14}>
                {gear.slice(0, 2).map(item =>
                  <Flex 
                    key={item.productId}
                    direction='column' 
                    component='a'
                    href={`/product/${item.productId}`}
                  >
                    <Image
                      src={`https://ik.imagekit.io/mublin/products/tr:w-240,h-240,cm-pad_resize,bg-FFFFFF,fo-x/${item.pictureFilename}`}
                      h={60}
                      mah={60}
                      w='auto'
                      fit='contain'
                      mb={10}
                      radius='md'
                      withBorder
                      title={`${item.brandName} ${item.productName}`}
                    />
                    <Text ta='center' c='primary' size='11px' mb={4} fw={550}>
                      {item.brandName}
                    </Text>
                    <Box w={90}>
                      <Text ta='center' c='primary' size='10px' fw={450}>
                        {item.productName}
                      </Text>
                    </Box>
                  </Flex>
                )}
                <Card 
                  shadow={false}
                  p={11}
                  fz='0.7rem'
                  withBorder
                  radius='md'
                  className='mublinModule'
                  ta='center'
                >
                  <strong>Faça login</strong> para ver<br/>o equipamento<br/>completo<br/>de {profile.name}!
                </Card>
              </Flex>
            }
            <Center mt={35} mb={4}>
              <Box>
                <Text align='center'>
                  Faça login para ver o perfil completo de <nobr>{profile.name} {profile.lastname}</nobr>
                </Text>
              </Box>
            </Center>
            <Group justify='center' gap={8}>
              <Link to={{ pathname: '/login' }}>
                <Button variant='gradient'
              gradient={{ from: 'violet', to: 'indigo', deg: 90 }}>Fazer login</Button>
              </Link>
              ou
              <Link to={{ pathname: '/signup' }}>
              <Button 
                color='violet' 
                variant='outline'
              >Cadastrar</Button>
              </Link>
            </Group>
          </>
        }
        {(!profile.requesting && !profile.id && profile.requested) && 
          <Center h={100} mt='xl'>
            <Box>
              <Title mt='xl'>Ops!</Title>
              <Text mt='xs'>A página ou o perfil não foram encontrados!</Text>
            </Box>
          </Center>
        }
      </Container>
      <Text ta='center' mt={10} c='dimmed' size='xs'>
        © 2025 Mublin
      </Text>
      <Modal
        opened={showModalProfileInfo}
        onClose={() => setShowModalProfileInfo(false)}
        centered
        size='sm'
      >
        <Center>
          <Avatar
            h={100}
            w={100}
            fit='contain'
            radius='xl'
            src={profile.picture ? profile.picture : undefined}
            alt={`Foto de perfil de ${profile.name} ${profile.lastname} no Mublin`} 
          />
        </Center>
        <Center my={20}>
          <Box>
            <Text align='center' fw={700} size='md'>
              {`${username} está no Mublin!`}
            </Text>
            <Text align='center' size='sm'>
              Faça login para visualizar o perfil completo
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
          >Cadastre-se</Button>
          </Link>
        </Group>
      </Modal>
    </>
  )
}

export default PublicProfilePage