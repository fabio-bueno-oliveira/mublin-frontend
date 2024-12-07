import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import { userInfos } from '../../store/actions/user';
import { useMantineColorScheme, Container, Center, Stack, Button, Text, Avatar, Badge, ActionIcon } from '@mantine/core';
import { IconUser, IconLock, IconEye, IconAdjustmentsHorizontal, IconCamera,  IconHeartHandshake, IconPackages, IconCalendarMonth,
  IconChevronRight, IconLogout, IconBrightnessUp, IconMoon } from '@tabler/icons-react';
import FooterMenuMobile from '../../components/footerMenuMobile';

function MenuMobile () {

  document.title = 'Menu | Mublin';

  const dispatch = useDispatch();

  const { colorScheme, setColorScheme,  } = useMantineColorScheme();

  useEffect(() => { 
    dispatch(userInfos.getInfo());
  }, []);

  const setNewColorTheme = (option) => {
    setColorScheme(option);
    setMobileMenuOpen(false);
  }

  const logout = () => {
    setColorScheme('light');
    dispatch(userActions.logout());
  }

  const userInfo = useSelector(state => state.user);

  return (
    <>
      <Container
        size={'lg'}
        mb={100}
        mt={30}
      >
        <Center>
          <Avatar 
            radius="lg"
            size='82px'
            src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture}
            alt='Foto de perfil'
          />
        </Center>
        <Center style={{position:'relative',marginTop:'-16px',marginLeft:'80px'}}>
          <ActionIcon variant="filled" radius="xl" aria-label="Settings" color="violet">
            <IconCamera style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Center>
        <Text ta='center' size='lg' mt={7}>
          Olá, <strong>{userInfo.name}</strong>!
        </Text>
        <Center>
          {userInfo.plan === "Pro" ? (
            <Badge color='violet' size='sm'>conta pro</Badge>
          ) : (
            <Badge color='gray' size='sm'>conta grátis</Badge>
          )}
        </Center>
        <Center mt={10}>
          {colorScheme === 'dark' && 
            <Button
              size="xs"
              variant="outline"
              radius="xl"
              color='violet'
              leftSection={<IconBrightnessUp size="1.5rem" stroke={1.5} />}
              onClick={() => setNewColorTheme('light')}
            >
              Mudar para o tema claro
            </Button>
          }
          {colorScheme === 'light' && 
            <Button
              size="xs"
              variant="outline"
              radius="xl"
              color='violet'
              leftSection={<IconMoon size="1.5rem" stroke={1.5} />}
              onClick={() => setNewColorTheme('dark')}
            >
              Mudar para o tema escuro
            </Button>
          }
        </Center>
        <Stack
          h={300}
          justify='flex-start'
          gap='md'
          mt={40}
        >
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='compact-md' justify="space-between" leftSection={<IconUser />} rightSection={<IconChevronRight/>} component="a" href="/settings">
            Editar meus dados
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconAdjustmentsHorizontal />} rightSection={<IconChevronRight />}>
            Preferências musicais
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconCalendarMonth />} rightSection={<IconChevronRight />}>
            Disponibilidade para gigs
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconHeartHandshake />} rightSection={<IconChevronRight />}>
            Parceiros e Endorsements
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconPackages />} rightSection={<IconChevronRight />}>
            Meus equipamentos
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconLock />} rightSection={<IconChevronRight />}>
            Senha
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconEye />} rightSection={<IconChevronRight />}>
            Privacidade da conta
          </Button>
          <Button variant='transparent' color='dark' size='compact-md' justify="space-between" leftSection={<IconLogout />} rightSection={<IconChevronRight />} onClick={() => logout()}>
            Sair
          </Button>
        </Stack>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MenuMobile;