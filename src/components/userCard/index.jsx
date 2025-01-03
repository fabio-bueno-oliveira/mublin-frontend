import { useMantineColorScheme, Flex, Box, Group, Avatar, Text, Anchor, rem } from '@mantine/core';
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function UserCard({ 
  mt, name, lastname, username, mainRole, picture, verified, legend, city, region
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
        <Anchor 
          underline='never'
          style={{lineHeight:'normal'}} 
          href={`/${username}`}
        >
          <Group gap={0}>
            <Text size='0.88rem' fw="600" c={colorScheme === "light" ? 'dark' : 'gray'}>
              {name} {lastname}
            </Text>
            {verified && 
              <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} />
            }
            {legend && 
              <IconShieldCheckFilled style={iconLegendStyle} />
            }
          </Group>
        </Anchor>
        <Box w={170}>
          <Anchor 
            underline='never'
            style={{lineHeight:'normal'}} 
            href={`/${username}`}
          >
            <Text size='11px' mt={3} mb={4} truncate='end' c={colorScheme === 'light' ? 'dark' : 'gray'}>
              {username}
            </Text>
          </Anchor>
          <Text size='10px' c='dimmed' truncate='end'>
            {mainRole} {region && `• ${region}`}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default UserCard;