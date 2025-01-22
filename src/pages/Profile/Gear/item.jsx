import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { profileInfos } from '../../../store/actions/profile'
import { Skeleton, Group, AngleSlider, Container, Flex, Box, Center, Avatar, Title, Text, Card, Image, Badge, Tooltip, Anchor } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconArrowLeft } from '@tabler/icons-react'
import Header from '../../../components/header'
import FloaterHeader from '../floaterHeader'
import FooterMenuMobile from '../../../components/footerMenuMobile'
import GearExpandedLoading from './gearExpandedLoading'

function ProfileGearItemExpanded () {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const username = params?.username
  const itemId = params?.username

  const profile = useSelector(state => state.profile)
  const gear = useSelector(state => state.profile.gear)

  document.title = !profile.success && !profile.id ? 'Mublin' : `Equipamento de ${profile.name} ${profile.lastname} | Mublin`;

  const [scroll] = useWindowScroll()

  useEffect(() => {
    dispatch(profileInfos.getProfileInfo(username))
    dispatch(profileInfos.getProfileGear(username))
    dispatch(profileInfos.getProfileRoles(username))
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
                {gear.total} itens no equipamento de {profile.name} {profile.lastname}
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
            <>
              <Text mb={30}>Teste</Text>
              
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

export default ProfileGearItemExpanded