import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Menu, Box, Center, Flex, Title, Button, Text, Image, Skeleton, Avatar, Loader, ThemeIcon, Indicator, Divider, Drawer, Burger, rem, em } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconPhoto, IconCalendar, IconTrash, IconArrowsLeftRight, IconSearch, IconMessageCircle, IconSettings, IconMusic, IconMoon, IconBrightnessUp, IconMenu2 } from '@tabler/icons-react'
import Navbar from './navbar'
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
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

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

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs">
        <Navbar mobile />
      </Drawer>
      <Grid id='dashboard' gutter={0}>
        <Grid.Col span={{ base: 12, md: 2.5, lg: 2.5 }} id='desktopSidebar' p={14}>
          <Group align='center' gap={6} className='showOnlyInMobile'>
            <Image
              radius='md'
              h={30}
              w='auto'
              fit='contain'
              src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
              ml={6}
            />
            <IconMenu2 size={26} onClick={open} />
          </Group>
          <Box className='showOnlyInLargeScreen'>
            <Navbar desktop />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          <Flex justify='space-between' mb={26}>
            <Text size='sm' c='dimmed' mb={20}>Painel do projeto / Início</Text>
            <Group gap={8}>
              {colorScheme === 'dark' && 
                  <Button
                    size='sm'
                    color='primary'
                    variant='filled'
                    leftSection={<IconBrightnessUp style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => {setColorScheme('light')}}
                  >
                    Tema claro
                  </Button>
                }
                {colorScheme === 'light' && 
                  <Button
                    size='sm'
                    color='primary'
                    variant='filled'
                    leftSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => {setColorScheme('dark')}}
                  >
                    Tema escuro
                  </Button>
                }
              <Menu shadow='md' width={200} position='bottom-end'>
                <Menu.Target>
                  <Avatar
                    w={34}
                    h={34}
                    className='point'
                    src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-68,w-68,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefined}
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
            </Group>
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
              <Flex justify='space-between'>
                <Box>
                  <Title fz='xl'>Dashboard de {project.name}</Title>
                  <Text size='sm'>Informações sobre o projeto</Text>
                </Box>
                <Button 
                  size='sm' 
                  color='primary' 
                  variant='outline' 
                  leftSection={<IconCalendar size={14} />}
                  disabled
                >
                  {currentDate}
                </Button>
              </Flex>
              <Grid mt={34}>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                      <Text size='sm' mb={6} fw={600}>Status do projeto:</Text>
                      {project.activityStatusId &&
                        <>
                          <Flex
                            align='center'
                            justify='flex-start'
                            gap={6}
                          >
                            <Indicator
                              inline
                              processing={project.activityStatusId === 1 || project.activityStatusId === 3}
                              color={project.activityStatusColor}
                              size={7}
                              ml={5}
                              mr={4}
                            />
                            <Text
                              size='sm'
                              className='lhNormal'
                              pt='1px'
                            >
                              {project.activityStatus}
                            </Text>
                          </Flex>
                          <Divider mt={16} />
                        </>
                      }
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Group gap={6}>
                        <ThemeIcon size='lg' radius='md' variant='filled' color='mublinColor'>
                          <IconCalendar style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Title>3</Title>
                      </Group>
                      <Text size='sm'>Eventos próximos</Text>
                      <Text size='xs' c='dimmed'>19 no total</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Group gap={6}>
                        <ThemeIcon size='lg' radius='md' variant='filled' color='mublinColor'>
                          <IconMusic style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Title>1</Title>
                      </Group>
                      <Text size='sm'>Músicas</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Group gap={6}>
                        <ThemeIcon size='lg' radius='md' variant='filled' color='mublinColor'>
                          <IconMusic style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Title>{activeMembers.length}</Title>
                      </Group>
                      <Text size='sm'>Integrantes ativos no projeto</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <Group gap={6}>
                        <ThemeIcon size='lg' radius='md' variant='filled' color='mublinColor'>
                          <IconCalendar style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Title>14</Title>
                      </Group>
                      <Text size='sm'>Eventos cadastrados</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                      <Text size='sm' mb={6} fw={600}>Recados:</Text>
                      <Text size='sm' c='dimmed'>
                        Nenhum recado no momento
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }} pr={isMobile ? 0 : 100}>
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
                  <Text mb={6} size='sm'>
                    Propósito: <Text span c='dimmed'>{project.purpose}</Text>
                  </Text>
                  <Text size='sm' my={10}>
                    Bio: <Text span c='dimmed'>{project.bio}</Text>
                  </Text>
                  <Avatar.Group spacing={10} mt={6}>
                    {activeMembers.map(member =>
                      <Avatar
                        key={member.id}
                        size='45'
                        name={member.name}
                        title={`${member.name} ${member.lastname} - ${member.role1}`}
                        src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-82,w-82,c-maintain_ratio/'+member.id+'/'+member.picture} 
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