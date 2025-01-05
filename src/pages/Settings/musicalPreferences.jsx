import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Grid, Container, Center, Loader, Box, Flex, Button, Image, Text, Anchor } from '@mantine/core'
import { IconChevronLeft, IconCamera } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'
import FooterMenuMobile from '../../components/footerMenuMobile'
import SettingsMenu from './menu'
import { notifications } from '@mantine/notifications'
import { IKUpload } from 'imagekitio-react'

function SettingsMusicalPreferences () {

  document.title = 'Preferências musicais | Mublin'

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  return (
    <>
      <div className='showOnlyInLargeScreen'>
        <Header reloadUserInfo />
      </div>
      <Container size='lg' mb={100}>
        <Grid mt={15}>
          {isLargeScreen && 
            <Grid.Col span={4} pt={20}>
              <SettingsMenu page='preferences' />
            </Grid.Col>
          }
          <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
            <Flex align='normal' gap={8} mb={8} className='showOnlyInMobile'>
              <Anchor href='/menu'>
                <IconChevronLeft
                  style={{width:'22px',height:'22px'}}
                />
              </Anchor>
              <Text size='1.164rem' fw='500' className='lhNormal'>
                Preferências musicais
              </Text>
            </Flex>
            <Box pos='relative' p={10}>
              <Text size='1.164rem' fw='500' className='lhNormal'>
                Preferências musicais
              </Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterMenuMobile />
    </>
  )
}

export default SettingsMusicalPreferences