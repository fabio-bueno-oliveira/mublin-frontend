import { Flex, Box, Group, Avatar, Text, Anchor, rem } from '@mantine/core'
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export function UserCard({ 
  mt, mb, name, lastname, username, mainRole, picture, verified, legend, city, region, size
}) {

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  return (
    <Flex mt={mt} mb={mb} gap={6} align='center'>
      <Link to={{ pathname: `/${username}` }}>
        <Avatar size={size} src={picture ? picture : undefined} />
      </Link>
      <Flex direction='column'>
        <Anchor
          underline='never'
          style={{lineHeight:'normal'}}
          href={`/${username}`}
        >
          <Group gap={0}>
            <Text size='0.97rem' fw={570} className='lhNormal'>
              {name} {lastname}
            </Text>
            {verified &&
              <IconRosetteDiscountCheckFilled
                color='#7950f2'
                style={iconVerifiedStyle}
                title='Perfil verificado'
              />
            }
            {legend &&
              <IconShieldCheckFilled
                style={iconLegendStyle}
                title='Lenda da música'
              />
            }
          </Group>
        </Anchor>
        <Box w={170}>
          <Anchor
            underline='never'
            style={{lineHeight:'normal'}}
            href={`/${username}`}
          >
            <Text size='xs' fw={400} className='lhNormal' truncate='end'>
              {username}
            </Text>
          </Anchor>
          <Text size='xs' fw={400} c='dimmed' className='lhNormal' truncate='end'>
            {mainRole} {city && `• ${city}`}{region && `, ${region}`}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default UserCard