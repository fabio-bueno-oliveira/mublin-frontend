import React from 'react'
import { Link } from 'react-router-dom'
import { useMantineColorScheme, Affix, Transition, Container, Flex, Group, Box, Avatar, Text, Image, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import PianoLogoBlack from '../../assets/svg/piano-logo.svg'
import PianoLogoWhite from '../../assets/svg/piano-logo-w.svg'

function FloaterHeader ({ 
    profile,
    scrollY
}) {

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  const isLargeScreen = useMediaQuery('(min-width: 60em)')
  const { colorScheme } = useMantineColorScheme()

  return (
    <Affix 
      w='100%'
      position={{ top: 0, left: 0 }} 
    >
      <Transition 
        transition='slide-down' 
        duration={400} 
        timingFunction='ease' 
        mounted={isLargeScreen ? scrollY > 100 : scrollY > 50}
      >
        {(transitionStyles) => (
          <Container className='floatingMenu' style={transitionStyles} fluid h={50} py={9}>
            <Container size={isLargeScreen ? 'lg' : undefined} p={isMobile ? 0 : undefined}>
              <Group gap={3}>
                <Link to={{ pathname: `/home` }}>
                  <Image 
                    src={colorScheme === 'light' ? PianoLogoBlack : PianoLogoWhite} 
                    h={isLargeScreen ? 29 : 27} 
                  />
                </Link>
                <Avatar
                  size={isLargeScreen ? 'sm' : 'sm'}
                  src={profile.picture ? profile.picture : undefined}
                  ml={10}
                  mr={4}
                />
                <Flex direction='column'>
                  <Box w={isLargeScreen ? 400 : 200}>
                    <Text fw='500' size={isLargeScreen ? '14px' : '12px'} >
                      {profile.name} {profile.lastname}
                    </Text>
                    <Text size='11px' truncate='end'>
                      {profile.roles.map((role, key) =>
                      <span key={key} className='comma'>
                        {role.description}
                      </span>
                      )}
                    </Text>
                    <Text c='dimmed' size='9px' mt={2}>
                      {!!profile.city && profile.city}{profile.region && `, ${profile.region}`}
                    </Text>
                  </Box>
                </Flex>
              </Group>
            </Container>
          </Container>
        )}
      </Transition>
    </Affix>
  );
};

export default FloaterHeader;