import { Flex, Box, Group, Badge, Image, Text, Anchor } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconClock } from '@tabler/icons-react'

export function ProjectCard({ 
  mb, picture, isPictureFullUrl, name, username, type, city, region, confirmed, size, genre
}) {

  const imgPath = 'https://ik.imagekit.io/mublin/projects/tr:h-165,w-165,c-maintain_ratio/'

  const imageSrc = isPictureFullUrl ? (picture ? picture : undefined) : (picture ? imgPath+picture : undefined);

  return (
    <Flex mb={mb} gap={6} align='center'>
      <Link to={{ pathname: `/${username}` }}>
        <Image
          radius='md'
          h={55}
          w={55}
          fit='contain'
          name='🎵'
          src={imageSrc} 
        />
      </Link>
      <Flex direction='column'>
        <Anchor 
          underline='never'
          style={{lineHeight:'normal'}} 
          href={`/${username}`}
        >
          <Group gap={0}>
            <Text size='0.97rem' fw={570} className='lhNormal'>
              {name}
            </Text>
          </Group>
        </Anchor>
        <Box w={170}>
          <Text size='xs' fw={400} className='lhNormal' truncate='end'>
            {type} {genre && `• ${genre}`}
          </Text>
          {city && 
            <Text size='xs' fw={400} c='dimmed' className='lhNormal' truncate='end'>
              {city && city} {region && `• ${region}`}
            </Text>
          }
          {confirmed === 2 && 
            <Badge size='xs' color='gray' variant='light' leftSection={<IconClock size='10px' />}>
              Pendente
            </Badge>
          }
        </Box>
      </Flex>
    </Flex>
  )
}

export default ProjectCard