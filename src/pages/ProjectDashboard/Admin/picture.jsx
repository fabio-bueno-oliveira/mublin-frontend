import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { userActions } from '../../../store/actions/user'
import { projectInfos } from '../../../store/actions/project'
import { useDispatch, useSelector } from 'react-redux'
import { useMantineColorScheme, Grid, Group, Box, Card, Center, Title, Text, Image, Skeleton, Loader, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMenu2 } from '@tabler/icons-react'
import Header from '../header'
import Navbar from '../navbar'
import MublinLogoBlack from '../../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../../assets/svg/mublin-logo-w.svg'
import '../styles.scss'

function ProjectDashboardSetlistPage () {

  const params = useParams()
  const username = params?.username

  let dispatch = useDispatch()

  const project = useSelector(state => state.project)

  useEffect(() => {
    dispatch(userActions.getInfo())
    dispatch(projectInfos.getProjectAdminAccessInfo(username))
    dispatch(projectInfos.getProjectInfo(username))
  }, []);

  const { colorScheme } = useMantineColorScheme()

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs">
        <Navbar mobile page='setlist' />
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
            <Navbar desktop page='setlist' />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5, lg: 9.5 }} pl={30} pr={50} py={30}>
          <Header page='Músicas pra tirar (setlists)' />
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
              <Box mb={30}>
                <Title fz='h2'>Setlists do projeto {project.name}</Title>
                <Text size='sm' c='dimmed'>Músicas para ensaiar e tocar nas apresentações</Text>
              </Box>
              <Text size='sm' c='dimmed'>
                Informações não disponíveis no momento
              </Text>
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ProjectDashboardSetlistPage