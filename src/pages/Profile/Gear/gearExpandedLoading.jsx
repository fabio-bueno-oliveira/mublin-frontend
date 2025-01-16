import React from 'react'
import { Grid, Center, Skeleton, Card, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

function ProfileGearExpandedLoading () {

  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  return (
    <Grid>
      <Grid.Col span={{ base: 6, md: 4, lg: 4 }}>
        <Card
          radius='md'
          withBorder={isLargeScreen ? true : false}
          className='mublinModule transparentBgInMobile'
        >
          <Center mb={14}>
            <Skeleton w={80} h={80} radius='lg'/>
          </Center>
          <Center>
            <Skeleton w={120} h={15} radius="lg" />
          </Center>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 4, lg: 4 }}>
        <Card
          radius='md'
          withBorder={isLargeScreen ? true : false}
          className='mublinModule transparentBgInMobile'
        >
          <Center mb={14}>
            <Skeleton w={80} h={80} radius='lg'/>
          </Center>
          <Center>
            <Skeleton w={120} h={15} radius="lg" />
          </Center>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 6, md: 4, lg: 4 }}>
        <Card
          radius='md'
          withBorder={isLargeScreen ? true : false}
          className='mublinModule transparentBgInMobile'
        >
          <Center mb={14}>
            <Skeleton w={80} h={80} radius='lg'/>
          </Center>
          <Center>
            <Skeleton w={120} h={15} radius="lg" />
          </Center>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

export default ProfileGearExpandedLoading