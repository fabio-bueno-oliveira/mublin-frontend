import React from 'react';
import { NavLink, Flex, Badge, Text } from '@mantine/core';
import { IconUser, IconLock, IconAdjustmentsHorizontal, IconCamera, IconHeartHandshake, IconPackages, IconTargetArrow } from '@tabler/icons-react';

function SettingsMenu (props) {
  return (
    <>
      <NavLink
        color='violet'
        href='/settings'
        label='Minha conta'
        leftSection={<IconUser size='1rem' stroke={1.5} />}
        active={props.page === 'profileEdit'}
      />
      <NavLink
        color="violet"
        href="#required-for-focus"
        label="Foto de perfil"
        leftSection={<IconCamera size="1rem" stroke={1.5} />}
        active={props.page === 'profilePicture'}
      />
      <NavLink
        color="violet"
        href="#required-for-focus"
        label="Preferências musicais"
        leftSection={<IconAdjustmentsHorizontal size="1rem" stroke={1.5} />}
        active={props.page === 'musicalPreferences'}
      />
      <NavLink
        color="violet"
        href="#required-for-focus"
        label="Disponibilidade"
        leftSection={<IconTargetArrow size="1rem" stroke={1.5} />}
        active={props.page === 'availability'}
      />
      <NavLink
        color="violet"
        href="#required-for-focus"
        label="Parceiros e Endorsements"
        leftSection={<IconHeartHandshake size="1rem" stroke={1.5} />}
        active={props.page === 'endorsements'}
      />
      <NavLink
        color='violet'
        href='/settings/my-gear'
        label={
          <Flex align='flex-start' gap='4'>
            <Text>Meus equipamentos</Text>
            <Badge 
              radius='xs' 
              mt='4' 
              size='xs' 
              variant='outline' 
              color='gray' 
              title='Usuário PRO'
            >
              PRO
            </Badge>
          </Flex>
        }
        leftSection={<IconPackages size='1rem' stroke={1.5} />}
        active={props.page === 'myGear'}
      />
      <NavLink
        color="violet"
        href="#required-for-focus"
        label="Senha"
        leftSection={<IconLock size="1rem" stroke={1.5} />}
        active={props.page === 'passwordChange'}
      />
      {/* <NavLink
        color="violet"
        href="#required-for-focus"
        label="Privacidade"
        leftSection={<IconEye size="1rem" stroke={1.5} />}
        active={props.page === 'privacy'}
      /> */}
    </>
  );
};

export default SettingsMenu;