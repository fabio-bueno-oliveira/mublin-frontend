import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Box, Flex, Title, Text, Avatar, Anchor, rem } from '@mantine/core';
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled } from '@tabler/icons-react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

function RelatedProfiles ({ 
  relatedUsers
}) {

  const truncateString = (input, maxLength) => input.length > maxLength ? `${input.substring(0, maxLength)}...` : input

  return (
    <Box mb='18'>
      <Divider mt={20} />
      <Title fz='1.06rem' fw='490' mt='md' mb='xs'>Mais perfis pra você</Title>
      <Splide 
        options={{
          drag: 'free',
          snap: false,
          perPage: 2,
          autoWidth: true,
          arrows: false,
          gap: '3px',
          dots: false,
          pagination: false,
        }}
      >
        {relatedUsers?.map(user =>
          <SplideSlide key={user.id}>
            <Flex mr='7' gap='5' justify='flex-start' align='center' mt='5'>
              <Link to={{ pathname: `/${user.username}` }}>
                <Avatar
                  w={42}
                  h={42}
                  src={user.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-84,w-84,c-maintain_ratio/'+user.id+'/'+user.picture : undefined}
                />
              </Link>
              <Flex direction='column' justify='flex-start' align='flex-start'>
                <Anchor 
                  underline='never'
                  fw={460}
                  style={{lineHeight:'normal'}}
                  href={`/${user.username}`}
                >
                  <Text ta='center' size='0.83rem' fw='490' className='lhNormal'>
                    {/* {truncateString(user.name + ' ' + user.lastname, 12)} */}
                    {user.name + ' ' + user.lastname}
                  </Text>
                </Anchor>
                <Flex gap='1' align='center' mt='1'>
                  <Text ta='center' size='0.74rem' fw='400' c='dimmed'>
                    {truncateString(user.username, (user.verified || user.legendBadge) ? 9 : 12)}
                  </Text>
                  {!!user.verified && 
                    <IconRosetteDiscountCheckFilled title='Usuário verificado' color='#7950f2' style={{ width: rem(13), height: rem(13) }} />
                  }
                  {!!user.legendBadge && 
                    <IconShieldCheckFilled title='Lenda da Música' style={{ color: '#DAA520', width: rem(13), height: rem(13) }} />
                  }
                </Flex>
              </Flex>
            </Flex>
          </SplideSlide>
        )}
      </Splide>
    </Box>
  )
}

export default RelatedProfiles