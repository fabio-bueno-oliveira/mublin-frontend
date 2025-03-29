import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { miscInfos } from '../../store/actions/misc'
import { Flex, Group, Box, Badge, Text } from '@mantine/core'
// import { IconCheck } from '@tabler/icons-react'

function AvailabilityInfo (props) {

  let dispatch = useDispatch()

  const profile = useSelector(state => state.profile)
  const jobs = useSelector(state => state.availabilityOptions)

  useEffect(() => { 
    dispatch(miscInfos.getAvailabilityItems())
  }, [])

  return (
    <Box mt={props.mt} mb={props.mb} className={props.screen === 'largeScreen' ? 'showOnlyInLargeScreen' : 'showOnlyInMobile'}>
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
                <Badge color='mublinColor' key={key} className='availability'>
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
        Vínculos de trabalho:
      </Text>
      <Group gap={4}>
        {profile.requesting ? (
          <Text size='xs' mx={0}>Carregando...</Text>
        ) : (
          <Flex gap={3} mx={0} pt={1}>
            {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
              <Badge color='mublinColor' size='md' className='availability'>
                Projetos Autorais
              </Badge>
            }
            {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
              <Flex direction='column'>
                <Badge color='mublinColor' size='md' className='availability'>
                  Contrato
                </Badge>
                <Text fz='10px'>
                  {profile.gender === 'f' ? 'Sidewoman/Sub' : 'Sideman/Sub'}
                </Text>
              </Flex>
            }
          </Flex>
        )}
      </Group>
      <Text size='0.83em' fw='500' mb={8} mt={14}>
        Tipos de trabalhos:
      </Text>
      {jobs.requesting ? (
        <Text size='0.83em' fw='390' mt='5' c='dimmed'>Carregando...</Text>
      ) : (
        <Flex gap={4} mx={0} pt={1} wrap='wrap'>
          {jobs.items.map(job =>
            <Badge
              key={job.id}
              size='md'
              pl='4px'
              pr='7px'
              leftSection={profile.availabilityItems.filter((i) => { return i.itemId === job.id }).length ? <IconCheck size={12} /> : undefined}
              variant={profile.availabilityItems.filter((i) => { return i.itemId === job.id }).length ? 'filled' : 'light'}
              color={profile.availabilityItems.filter((i) => { return i.itemId === job.id }).length ? 'mublinColor' : 'gray'}
            >
              {job.name}
            </Badge>
          )}
        </Flex>
      )}
    </Box>
  )
}

export default AvailabilityInfo