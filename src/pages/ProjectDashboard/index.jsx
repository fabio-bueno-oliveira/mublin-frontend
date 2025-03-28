import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Menu, Box, Center, Flex, Title, Button, Card, Text, Image, Skeleton, Avatar, NavLink, Anchor, Loader, ThemeIcon } from '@mantine/core'
import { IconLayoutDashboard, IconUsersGroup, IconCalendarPlus, IconCalendarWeek, IconArrowLeft, IconPhoto, IconPictureInPictureTop, IconPencil, IconCalendar, IconMusicPlus, IconList, IconTrash, IconArrowsLeftRight, IconSearch, IconMessageCircle, IconSettings, IconMusic, IconUserPlus, IconPlus } from '@tabler/icons-react'
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import './styles.scss'

function ProjectDashboardPage () {

  const params = useParams();
  const username = params?.username;

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username));
    dispatch(projectInfos.getProjectMembers(username));
  }, []);

  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const project = useSelector(state => state.project);

  const activeMembers = project.members.filter(
    (member) => { return member.confirmed === 1 && !member.leftIn }
  )
  const pendingMembers = project.members.filter(
    (member) => { return member.confirmed === 2 }
  )
  const pastMembers = project.members.filter(
    (member) => { return member.confirmed === 1 && member.leftIn }
  )

  const currentDate = dayjs().format('DD/MM/YYYY')

  return (
    <>
      <Grid id='dashboard' gutter={0}>
        <Grid.Col span={{ base: 12, md: 2.5, lg: 2.5 }} id='desktopSidebar' p={14}>
          <Image
            radius='md'
            h={30}
            w='auto'
            fit='contain'
            src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
            mt={16}
            mb={6}
            ml={8}
          />
          <Anchor c='dimmed' href='/home' underline="hover" fz='xs' ml={10}>
            Voltar ao Mublin
          </Anchor>
          <NavLink
            mt={16}
            active
            href={`/dashboard/${username}`}
            label='Início'
            leftSection={<IconLayoutDashboard size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Dados do projeto</Text>
          <NavLink
            href='#required-for-focus'
            label='Informações'
            leftSection={<IconPencil size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <NavLink
            href='#required-for-focus'
            label='Foto de perfil'
            leftSection={<IconPhoto size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <NavLink
            href='#required-for-focus'
            label='Foto de capa'
            leftSection={<IconPictureInPictureTop size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Pessoas e funções</Text>
          <NavLink
            href='#required-for-focus'
            label='Gerenciar pessoas'
            leftSection={<IconUsersGroup size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Vagas e oportunidades</Text>
          <NavLink
            href='#required-for-focus'
            label='Criar nova vaga'
            leftSection={<IconPlus size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Eventos</Text>
          <NavLink
            href='#required-for-focus'
            label='Criar novo evento'
            leftSection={<IconCalendarPlus size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <NavLink
            href='#required-for-focus'
            label='Ver eventos'
            leftSection={<IconCalendarWeek size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Músicas</Text>
          <NavLink
            href='#required-for-focus'
            label='Cadastrar nova música'
            leftSection={<IconMusicPlus size={16} stroke={1.5} />}
            color='mublinColor'
          />
          <NavLink
            href='#required-for-focus'
            label='Ver músicas'
            leftSection={<IconList size={16} stroke={1.5} />}
            color='mublinColor'
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          {/* <Button size='xs' color='primary' variant='outline' leftSection={<IconArrowLeft size={14} />}>
            Voltar ao Mublin
          </Button> */}
          <Flex justify='space-between'>
            <Text size='sm' c='dimmed' mb={20}>Painel de Controle / Início</Text>
            <Menu shadow='md' width={200} position='bottom-end'>
              <Menu.Target>
                <Avatar
                  w={38}
                  h={38}
                  className='point'
                  src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-76,w-76,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
                  alt={userInfo.username}
                  ml={8}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Item leftSection={<IconMessageCircle size={14} />}>
                  Messages
                </Menu.Item>
                <Menu.Item leftSection={<IconPhoto size={14} />}>
                  Gallery
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconSearch size={14} />}
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘K
                    </Text>
                  }
                >
                  Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={<IconArrowsLeftRight size={14} />}
                >
                  Transfer my data
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                >
                  Delete my account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          {project.requesting ? (
            <>
              <Skeleton w={280} h={26} radius='xl' />
              <Skeleton w={190} h={18} radius='xl' mt={6} />
              <Center mt={140}>
                <Loader color='mublinColor' type='bars' />
              </Center>
            </>
          ) : (
            <>
              <Title fz='xl'>Dashboard de {project.name}</Title>
              <Text size='sm'>Informações sobre o projeto</Text>
              <Text>{currentDate}</Text>
              <Grid mt={34}>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <ThemeIcon size='lg' radius='md' variant='light' color='mublinColor'>
                        <IconCalendar style={{ width: '70%', height: '70%' }} />
                      </ThemeIcon>
                      <Title>3</Title>
                      <Text size='sm'>Eventos próximos</Text>
                      <Text size='xs' c='dimmed'>19 no total</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <ThemeIcon size='lg' radius='md' variant='light' color='mublinColor'>
                        <IconMusic style={{ width: '70%', height: '70%' }} />
                      </ThemeIcon>
                      <Title>1</Title>
                      <Text size='sm'>Músicas</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <ThemeIcon size='lg' radius='md' variant='light' color='mublinColor'>
                        <IconMusic style={{ width: '70%', height: '70%' }} />
                      </ThemeIcon>
                      <Title>14</Title>
                      <Text size='sm'>Eventos cadastrados</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <ThemeIcon size='lg' radius='md' variant='light' color='mublinColor'>
                        <IconCalendar style={{ width: '70%', height: '70%' }} />
                      </ThemeIcon>
                      <Title>14</Title>
                      <Text size='sm'>Eventos cadastrados</Text>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }} pr={100}>
                  <Box>
                    <Image
                      radius='lg'
                      h={120}
                      w='auto'
                      fit='contain'
                      src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
                      mb={14}
                    />
                  </Box>
                  <Text mb={6} size='sm'>
                    Tipo: <Text span c='dimmed'>{project.typeName}</Text>
                  </Text>
                  <Text mb={6} size='sm'>
                    Ano de fundação: <Text span c='dimmed'>{project.foundationYear}</Text> {!!project.endDate && <Text span c='dimmed'>(encerrado em {project.endDate})</Text>}
                  </Text>
                  <Text size='sm' my={10}>
                    {project.bio}
                  </Text>
                  <Avatar.Group spacing={10} mt={6}>
                    {activeMembers.map(member =>
                      <Avatar
                        key={member.id}
                        size='30'
                        name={member.name}
                        title={`${member.name} ${member.lastname} - ${member.role1}`}
                        src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-100,w-100,c-maintain_ratio/'+member.id+'/'+member.picture} 
                        component='a'
                        href={`/${member.username}`}
                      />
                    )}
                    {/* <Avatar size='30'>+5</Avatar> */}
                  </Avatar.Group>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ProjectDashboardPage;