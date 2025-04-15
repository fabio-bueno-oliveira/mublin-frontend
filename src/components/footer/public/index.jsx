import { Grid, Flex, Box, Text, ActionIcon, Image, rem, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link } from 'react-router-dom'
import { IconBrandInstagram } from '@tabler/icons-react'
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg'
import PianoLogoWhite from '../../../assets/svg/piano-logo-w.svg'

function Footer () {

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  return (
    <Box 
      bg='black'
      px={isMobile ? 20 : 120} 
      py={20} 
      mt={20}
      h={170}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
          <Link to={{ pathname: '/' }}>
            <Flex gap={3} align='center' mb={12}>
              <Image src={PianoLogoWhite} h={38} />
              <Image src={MublinLogoWhite} h={28} />
            </Flex>
          </Link>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
          <Flex justify={isMobile ? 'flex-start' : 'flex-end'}>
            <ActionIcon 
              aria-label="Instagram"
              size='lg'
              variant='light'
              color='orange'
              radius='sm'
              component='a'
              target='blank'
              href='https://instagram.com/mublin'
              title='instagram.com/mublin'
            >
              <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Flex>
        </Grid.Col>
      </Grid>
      {/* <Text mt={10} c='dimmed' size='xs'>
        help@mublin.com
      </Text> */}
      <Text mt={10} ml={4} c='dimmed' size='xs' opacity={0.4}>
        © 2025 Mublin
      </Text>
    </Box>
  )
}

export default Footer