import { Flex, Box, Skeleton } from '@mantine/core'

export function UserCardLoading({ 
  mt, mb
}) {

  return (
    <Flex mt={mt} mb={mb} gap={6} align='center'>
      <Skeleton height={46} circle />
      <Flex direction='column'>
        <Box w={170}>
          <Skeleton height={11} width={160} radius='xl' mb={7} />
          <Skeleton height={7} width={110} mb={7} radius='xl' />
          <Skeleton height={7} width={130} radius='xl' />
        </Box>
      </Flex>
    </Flex>
  )
}

export default UserCardLoading