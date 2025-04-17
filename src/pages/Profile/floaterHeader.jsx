import React from 'react'
import { Affix, Transition, Container, Flex, Group, Box, Avatar, Text, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

function FloaterHeader ({ profile, scrollY }) {

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const isLargeScreen = useMediaQuery('(min-width: 60em)')

  return (
    <Affix
      w='100%'
      position={{ top: isMobile ? 51 : 66, left: 0 }}
    >
      <Transition
        transition='slide-down'
        duration='400'
        timingFunction='ease'
        mounted={scrollY > 200}
      >
        {(transitionStyles) => (
          <Container className='floatingMenu' style={transitionStyles} fluid h={50} py={9}>
            <Container size={isLargeScreen ? 'lg' : undefined} p={isMobile ? 0 : undefined}>
              <Group gap={3}>
                <Avatar
                  size='34px'
                  src={profile.picture ? profile.picture : undefined}
                  mr={4}
                />
                <Flex direction='column'>
                  <Text fw='650' size='sm' className='lhNormal'>
                    {profile.name} {profile.lastname}
                  </Text>
                  <Text size='xs'>
                    {profile.roles.map((role, key) =>
                    <span key={key} className='comma'>
                      {role.description}
                    </span>
                    )}
                  </Text>
                </Flex>
              </Group>
            </Container>
          </Container>
        )}
      </Transition>
    </Affix>
  )
}

export default FloaterHeader