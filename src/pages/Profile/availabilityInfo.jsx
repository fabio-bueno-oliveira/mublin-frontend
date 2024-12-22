import React from 'react'
import { useSelector } from 'react-redux'
import { Flex, Group, Box, Badge, Text } from '@mantine/core'

function AvailabilityInfo (props) {

  const profile = useSelector(state => state.profile)

  return (
    <Box mt={props.mt}>
      <Text size='0.83em' fw={300} mb={8}>
        Principais estilos musicais:
      </Text>
      {profile.genres[0].id ? (
        <>
          {profile.requesting ? (
            <Text size='xs' mx={0} c='dimmed'>Carregando...</Text>
          ) : (
            <Flex gap={3} mx={0} pt={2}>
              {profile.genres[0].id && profile.genres.map((genre, key) =>
                <Badge variant='default' size='md' key={key}>
                  <Text fz='0.64rem' fw='400'>{genre.name}</Text>
                </Badge>
              )}
            </Flex>
          )}
        </>
      ) : (
        <Text size='0.83em' fw={300} mx={0} c='dimmed'>
          Nenhum estilo cadastrado
        </Text>
      )}
      <Text size='0.83em' fw={300} mb={8} mt={14}>
        Tipos de projetos:
      </Text>
      <Group gap={4}>
        {profile.requesting ? (
          <Text size='xs' mx={0}>Carregando...</Text>
        ) : (
          <Flex gap={3} mx={0} pt={2}>
            {(profile.availabilityFocusId === 1 || profile.availabilityFocusId === 3) && 
              <Badge variant='default' size='md'>
                <Text fz='0.64rem' fw='400'>Autorais</Text>
              </Badge>
            }
            {(profile.availabilityFocusId === 2 || profile.availabilityFocusId === 3) && 
              <Badge variant='default' size='md'>
                <Text fz='0.64rem' fw='400'>Contrato</Text>
              </Badge>
            }
          </Flex>
        )}
      </Group>
      <Text fz='0.64rem' fw={300} mb={8} mt={14}>
        Tipos de trabalho:
      </Text>
      {profile.availabilityItems[0].id ? (
        <Flex gap={3} mx={0} pt={2}>
          {profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
            <Badge variant='default' size='md' key={key}>
              <Text fz='0.64rem' fw='400'>{item.itemName}</Text>
            </Badge>
          )}
        </Flex>
      ) : (
        <Text fz='0.64rem' fw={300} c='dimmed'>
          Não informado
        </Text>
      )}
    </Box>
  );
};

export default AvailabilityInfo;