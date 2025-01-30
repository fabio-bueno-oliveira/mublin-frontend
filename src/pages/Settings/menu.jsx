import React from 'react'
import { NavLink, Flex, Badge, Text } from '@mantine/core'
import { IconUser, IconLock, IconAdjustmentsHorizontal, IconCamera, IconHeartHandshake, IconPackages, IconTargetArrow } from '@tabler/icons-react'

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
        color='violet'
        href='/settings/picture'
        label='Foto de perfil'
        leftSection={<IconCamera size='1rem' stroke={1.5} />}
        active={props.page === 'profilePicture'}
      />
      <NavLink
        color='violet'
        href='/settings/preferences'
        label='Preferências musicais'
        leftSection={<IconAdjustmentsHorizontal size='1rem' stroke={1.5} />}
        active={props.page === 'preferences'}
      />
      <NavLink
        color='violet'
        href='/settings/availability'
        label='Disponibilidade'
        leftSection={<IconTargetArrow size='1rem' stroke={1.5} />}
        active={props.page === 'availability'}
      />
      <NavLink
        color='violet'
        href='#required-for-focus'
        label='Parceiros e Endorsements'
        leftSection={<IconHeartHandshake size='1rem' stroke={1.5} />}
        active={props.page === 'endorsements'}
      />
      <NavLink
        color='violet'
        href='/settings/my-gear'
        label='Meu equipamento'
        leftSection={<IconPackages size='1rem' stroke={1.5} />}
        active={props.page === 'myGear'}
      />
      <NavLink
        color='violet'
        href='/settings/password'
        label='Senha'
        leftSection={<IconLock size='1rem' stroke={1.5} />}
        active={props.page === 'password'}
      />
      {/* <NavLink
        color='violet'
        href='#required-for-focus'
        label='Privacidade'
        leftSection={<IconEye size='1rem' stroke={1.5} />}
        active={props.page === 'privacy'}
      /> */}
    </>
  );
};

export default SettingsMenu;