import React from 'react'
import { useSelector } from 'react-redux'
import { Flex, Group, Box, Badge, Text } from '@mantine/core'

function AvailabilityInfo (props) {

  const profile = useSelector(state => state.profile)

  return (
    <Box mt={props.mt} className={props.screen === 'largeScreen' ? 'showOnlyInLargeScreen' : 'showOnlyInMobile'}>
      <Text size='0.83em' fw='500' mb={8}>
        Principais estilos musicais:
      </Text>
      {profile.genres[0].id ? (
        <>
          {profile.requesting ? (
            <Text size='xs' mx={0} c='dimmed'>Carregando...</Text>
          ) : (
            <Flex gap={3} mx={0} pt={1}>
              {profile.genres[0].id && profile.genres.map((genre, key) =>
                <Badge variant='light' color='dark' key={key} className='availability'>
                  {genre.name}
                </Badge>
              )}
            </Flex>
          )}
        </>
      ) : (
        <Text size='0.83em' fw='390' mt='5' c='dimmed'>
          Nenhum estilo cadastrado
        </Text>
      )}
      <Text size='0.83em' fw='500' mb={8} mt={14}>
        Tipos de projetos:
      </Text>
      <Group gap={4}>
        {profile.requesting ? (
          <Text size='xs' mx={0}>Carregando...</Text>
        ) : (
          <Flex gap={3} mx={0} pt={1}>
            {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
              <Badge variant='light' color='dark' size='md' className='availability'>
                Projetos próprios
              </Badge>
            }
            {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
              <Badge variant='light' color='dark' size='md' className='availability'>
                Contrato/Sideman
              </Badge>
            }
          </Flex>
        )}
      </Group>
      <Text size='0.83em' fw='500' mb={8} mt={14}>
        Tipos de trabalho:
      </Text>
      {profile.availabilityItems[0].id ? (
        <Flex gap={3} mx={0} pt={1}>
          {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
            <Badge variant='light' color='dark' key={key} className='availability'>
              {item.itemName}
            </Badge>
          )}
        </Flex>
      ) : (
        <Text size='0.83em' fw='390' mt='5' c='dimmed'>
          Não informado
        </Text>
      )}
    </Box>
  );
};

export default AvailabilityInfo;