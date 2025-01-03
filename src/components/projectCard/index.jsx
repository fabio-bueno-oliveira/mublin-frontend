import { useMantineColorScheme, Flex, Box, Group, Badge, Image, Text, Anchor } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconClock } from '@tabler/icons-react'

export function ProjectCard({ 
  mb, picture, name, username, type, city, region, confirmed
}) {

  const { colorScheme } = useMantineColorScheme();
  const imgPath = 'https://ik.imagekit.io/mublin/projects/tr:h-165,w-165,c-maintain_ratio/'

  return (
    <Flex mb={mb} gap={6} align="center">
      <Link to={{ pathname: `/${username}` }}>
        <Image
          radius='md'
          h={55}
          w={55}
          fit='contain'
          name='🎵'
          src={picture ? imgPath+picture : undefined} 
        />
      </Link>
      <Flex direction="column">
        <Anchor 
          underline='never'
          style={{lineHeight:'normal'}} 
          href={`/${username}`}
        >
          <Group gap={0}>
            <Text 
              size='0.85rem'
              fw='460' 
              c={colorScheme === 'light' ? 'dark' : 'gray'}
            >
              {name}
            </Text>
          </Group>
        </Anchor>
        <Box w={170}>
          {confirmed === 1 &&
            <>
              <Text size='11px' mt={3} mb={4} truncate='end' c={colorScheme === 'light' ? 'dark' : 'gray'}>
                {type}
              </Text>
              {city && 
                <Text size='10px' c='dimmed' truncate='end'>
                  {city && city} {region && `• ${region}`}
                </Text>
              }
            </>
          }
          {confirmed === 2 && 
            <Badge size='xs' variant='light' color='gray' leftSection={<IconClock size='10px' />}>
              Pendente
            </Badge>
          }
        </Box>
      </Flex>
    </Flex>
  );
}

export default ProjectCard;