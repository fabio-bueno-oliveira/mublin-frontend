import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { projectInfos } from '../../store/actions/project'
import { useDispatch } from 'react-redux'
import { useMantineColorScheme, Group, Text, Image, Badge, NavLink, Anchor, Accordion } from '@mantine/core'
import { IconLayoutDashboard, IconUsersGroup, IconCalendarPlus, IconCalendarWeek, IconArrowLeft, IconPhoto, IconPictureInPictureTop, IconPencil, IconMusicPlus, IconList,  IconReportMoney, IconPlus, IconSettings, IconMusic, IconLock, IconHeadphones } from '@tabler/icons-react'
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg'

function ProjectDashboardMenu (props) {

  const params = useParams()
  const username = params?.username

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(projectInfos.getProjectInfo(username))
    dispatch(projectInfos.getProjectMembers(username))
  }, [])

  const { colorScheme } = useMantineColorScheme()

  return (
    <>
      {!!props.desktop &&
        <Image
          radius='md'
          h={30}
          w='auto'
          fit='contain'
          src={colorScheme === 'light' ? MublinLogoBlack : MublinLogoWhite} 
          mt={16}
          ml={6}
        />
      }
      <Group c='dimmed' gap={3} align='center' ml={10} mt={10}>
        <IconArrowLeft size={13} />
        <Anchor c='dimmed' href='/home' underline='never'>
          <Text fz='sm' c='dimmed'>Voltar ao Mublin</Text>
        </Anchor>
      </Group>

      <Accordion defaultValue='daily' mt={16}>
        <Accordion.Item value='daily'>
          <Accordion.Control icon={<IconMusic />}>Dia a dia</Accordion.Control>
          <Accordion.Panel>
            <NavLink
              active
              href={`/dashboard/${username}`}
              label='Início'
              leftSection={<IconLayoutDashboard size={16} stroke={1.5} />}
              color='mublinColor'
            />
            <NavLink
              href={`/dashboard/${username}`}
              label='Músicas pra tirar'
              leftSection={<IconHeadphones size={16} stroke={1.5} />}
              color='mublinColor'
            />
            <NavLink
              href={`/dashboard/${username}`}
              label='Time atual'
              leftSection={<IconUsersGroup size={16} stroke={1.5} />}
              color='mublinColor'
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='admin'>
          <Accordion.Control icon={<IconLock />} disabled>Funções administrativas</Accordion.Control>
          <Accordion.Panel>

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
            <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Financeiro</Text>
            <NavLink
              href='#required-for-focus'
              label='Gerenciar finanças'
              leftSection={<IconReportMoney size={16} stroke={1.5} />}
              rightSection={<Badge size='xs' variant='light' color='mublinColor'>Em breve</Badge>}
              color='mublinColor'
            />

          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

    </>
  )
}

export default ProjectDashboardMenu