import { useMantineColorScheme, Flex, Box, Group, Avatar, Text, rem } from '@mantine/core';
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function UserCard({ 
  mt, id, name, lastname, username, mainRole, picture, verified, legend, city, region
}) {

  const { colorScheme } = useMantineColorScheme();
  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '3px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) };

  return (
    <Flex mt={mt} gap={6} align="center">
      <Link to={{ pathname: `/${username}` }}>
        <Avatar size="md" src={picture ? picture : undefined} />
      </Link>
      <Flex direction="column">
        <Link to={{ pathname: `/${username}` }} className='displayBlockLink'>
          <Group gap={0}>
            <Text size="13.5px" fw="600" c={colorScheme === "light" ? 'dark' : 'gray'}>
              {name} {lastname}
            </Text>
            {verified && 
              <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
            }
            {legend && 
              <IconShieldCheckFilled style={iconLegendStyle} />
            }
          </Group>
        </Link>
        <Box w={170}>
          <Link to={{ pathname: `/${username}` }} className='displayBlockLink'>
            <Text size="11px" mt={3} mb={4} truncate="end" c="dimmed">
              {username}
            </Text>
          </Link>
          <Text size="10px" c="dimmed" truncate="end">{mainRole} {region && `• ${region}`}</Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default UserCard;