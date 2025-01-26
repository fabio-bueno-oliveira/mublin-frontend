import { Flex, Text, ActionIcon, rem } from '@mantine/core'
import { IconBrandInstagram } from '@tabler/icons-react'

function Footer () {

  return (
    <Flex gap={10} mt={20} mb={30} justify='center' align='center'>
      <Text ta='center' c='dimmed' size='xs'>
        © 2025 Mublin
      </Text>
      <ActionIcon 
        size='md'
        variant='subtle'
        color='gray'
        radius='xl'
        component='a'
        target='blank'
        href='https://instagram.com/mublin'
        title='instagram.com/mublin'
      >
        <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ActionIcon>
    </Flex>
  )
}

export default Footer