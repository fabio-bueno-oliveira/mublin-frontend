import React from 'react'
import { NavLink, Text, Divider } from '@mantine/core'
import { IconUser, IconLock, IconAdjustmentsHorizontal, IconCamera, IconHeartHandshake, IconPackages, IconCalendarCheck, IconArrowLeft } from '@tabler/icons-react'

function SettingsMenu (props) {

  const user = JSON.parse(localStorage.getItem('userInfo'))

  return (
    <>
      <NavLink
        color='mublinColor'
        href={`/${user.username}`}
        label={<Text fw={500}>Voltar ao meu perfil</Text>}
        leftSection={<IconArrowLeft size='1.4rem' stroke={1.5} />}
        variant='subtle'
      />
      <Divider my={10} />
      <NavLink
        color='mublinColor'
        href='/settings'
        label={<Text fw={500}>Minha conta</Text>}
        leftSection={<IconUser size='1.4rem' stroke={1.5} />}
        active={props.page === 'profileEdit'}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/picture'
        label={<Text fw={500}>Foto de perfil</Text>}
        leftSection={<IconCamera size='1.4rem' stroke={1.5} />}
        active={props.page === 'profilePicture'}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/preferences'
        label={<Text fw={500}>Preferências musicais</Text>}
        leftSection={<IconAdjustmentsHorizontal size='1.4rem' stroke={1.5} />}
        active={props.page === 'preferences' ? true : false}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/availability'
        label={<Text fw={500}>Disponibilidade</Text>}
        leftSection={<IconCalendarCheck size='1.4rem' stroke={1.5} />}
        active={props.page === 'availability'}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/endorsements'
        label={<Text fw={500}>Parceiros e Endorsements</Text>}
        leftSection={<IconHeartHandshake size='1.4rem' stroke={1.5} />}
        active={props.page === 'endorsements'}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/my-gear'
        label={<Text fw={500}>Meu equipamento</Text>}
        leftSection={<IconPackages size='1.4rem' stroke={1.5} />}
        active={props.page === 'myGear'}
        variant='subtle'
      />
      <NavLink
        color='mublinColor'
        href='/settings/password'
        label={<Text fw={500}>Senha</Text>}
        leftSection={<IconLock size='1.4rem' stroke={1.5} />}
        active={props.page === 'password'}
        variant='subtle'
      />
      {/* <NavLink
        color='mublinColor'
        href='#required-for-focus'
        label={<Text fw={500}>Privacidade</Text>}
        leftSection={<IconEye size='1.4rem' stroke={1.5} />}
        active={props.page === 'privacy'}
        variant='subtle'
      /> */}
    </>
  );
};

export default SettingsMenu;