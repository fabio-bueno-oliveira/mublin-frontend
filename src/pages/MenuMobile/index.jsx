import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import { userInfos } from '../../store/actions/user';
import { useMantineColorScheme, Container, Flex, Center, Stack, Button, Text, Anchor, Avatar, Badge, ActionIcon } from '@mantine/core';
import { IconUser, IconLock, IconEye, IconAdjustmentsHorizontal, IconCamera,  IconHeartHandshake, IconPackages, IconCalendarMonth,
  IconChevronRight, IconLogout, IconBrightnessUp, IconMoon, IconEdit } from '@tabler/icons-react';
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

  const user = useSelector(state => state.user);

  return (
    <>
      <Container
        size={'lg'}
        mb={100}
        mt={20}
      >
        <Center>
          <Avatar 
            radius="lg"
            size='82px'
            src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture}
            alt='Foto de perfil'
          />
        </Center>
        <Center style={{position:'relative',marginTop:'-16px',marginLeft:'80px'}}>
          <ActionIcon variant="filled" radius="xl" aria-label="Settings" color="violet">
            <IconCamera style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Center>
        <Text ta='center' size='lg' mt={7}>
          Olá, <span style={{fontWeight:'500'}}>{user.name}</span>!
        </Text>
        <Center>
          {user.plan === "Pro" ? (
            <Badge color='violet' size='sm'>conta pro</Badge>
          ) : (
            <Flex direction="column" align="center" mt={8}>
              <Badge color='gray' size='sm'>conta grátis</Badge>
              <Anchor 
                href={`https://buy.stripe.com/8wM03sfPadmmc4EaEE?client_reference_id=${user.id}&prefilled_email=${user.email}&utm_source=gear`} 
                target="_blank"
                underline="hover"
              >
                <Text size="sm" c="violet">
                  Quero me tornar Mublin PRO
                </Text>
              </Anchor>
            </Flex>
          )}
        </Center>
        <Center mt={15}>
          {colorScheme === 'dark' && 
            <Button
              size="xs"
              fw="500"
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
              fw="500"
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
          mt={30}
        >
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='compact-sm' justify="space-between" leftSection={<IconUser style={{width:17,height:17}} />} rightSection={<IconChevronRight/>} component="a" href="/settings" fw="500">
            Ir para meu perfil
          </Button>
          <Button variant='transparent' color={colorScheme === 'light' ? 'dark' : 'light'} size='compact-sm' justify="space-between" leftSection={<IconEdit style={{width:17,height:17}} />} rightSection={<IconChevronRight/>} component="a" href="/settings" fw="500">
            Editar meus dados
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconAdjustmentsHorizontal style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Preferências musicais
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconCalendarMonth style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Disponibilidade para gigs
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconHeartHandshake style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Parceiros e Endorsements
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconPackages style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Meus equipamentos
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconLock style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Senha
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconEye style={{width:17,height:17}} />} rightSection={<IconChevronRight />} fw="500">
            Privacidade da conta
          </Button>
          <Button variant='transparent' color='dark' size='compact-sm' justify="space-between" leftSection={<IconLogout style={{width:17,height:17}} />} rightSection={<IconChevronRight />} onClick={() => logout()}>
            Sair
          </Button>
        </Stack>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default MenuMobile;