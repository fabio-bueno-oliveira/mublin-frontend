import React from 'react'
import { Card, Flex, Skeleton, Box } from '@mantine/core'

function FeedCardLoading () {
  return (
    <>
      <Card 
        px='md'
        pt='sm'
        mb='10px'
        radius='md'
        withBorder
        className='mublinModule'
        id='feed'
      >
        <Flex gap={5} align='center'>
          <Skeleton height={45} circle />
          <Box>
            <Skeleton height={13} radius="xl" />
            <Skeleton height={10} width={200} radius="xl" mt={10} />
          </Box>
        </Flex>
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
      </Card>
      <Card 
        px='md'
        pt='sm'
        mb='10px'
        radius='md'
        withBorder
        className='mublinModule'
        id='feed'
      >
        <Flex gap={5} align='center'>
          <Skeleton height={45} circle />
          <Box>
            <Skeleton height={13} radius="xl" />
            <Skeleton height={10} width={200} radius="xl" mt={10} />
          </Box>
        </Flex>
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
      </Card>
      <Card 
        px='md'
        pt='sm'
        mb='xs'
        radius='md'
        withBorder
        className='mublinModule'
        id='feed'
      >
        <Flex gap={5} align='center'>
          <Skeleton height={45} circle />
          <Box>
            <Skeleton height={13} radius="xl" />
            <Skeleton height={10} width={200} radius="xl" mt={10} />
          </Box>
        </Flex>
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
        <Skeleton height={10} width={300} radius="xl" mt={10} />
      </Card>
    </>
  )
}
    
export default FeedCardLoading