import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useMantineColorScheme, Text, Image, Badge, NavLink, Accordion } from '@mantine/core'
import { IconLayoutDashboard, IconUsersGroup, IconCalendarPlus, IconCalendarWeek, IconPhoto, IconPictureInPictureTop, IconPencil, IconMusicPlus, IconList,  IconReportMoney, IconPlus, IconMusic, IconLock, IconHeadphones } from '@tabler/icons-react'
import MublinLogoBlack from '../../assets/svg/mublin-logo.svg'
import MublinLogoWhite from '../../assets/svg/mublin-logo-w.svg'

function ProjectDashboardMenu (props) {

  const params = useParams()
  const username = params?.username

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const project = useSelector(state => state.project)

  const { colorScheme } = useMantineColorScheme()

  const isAdmin = project.members.some((member) => { return member.id === loggedUserId && member.confirmed === 1 && member.admin === 1 && !member.leftIn })

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

      <Accordion defaultValue='daily' mt={16}>
        <Accordion.Item value='daily'>
          <Accordion.Control icon={<IconMusic />}>Funções do Dia a dia</Accordion.Control>
          <Accordion.Panel>
            <NavLink
              active={props.page === 'home'}
              href={`/dashboard/${username}`}
              label='Resumo'
              leftSection={<IconLayoutDashboard size={16} stroke={1.5} />}
              color='mublinColor'
            />
            <NavLink
              active={props.page === 'team'}
              href={`/dashboard/${username}/team`}
              label='Equipe'
              leftSection={<IconUsersGroup size={16} stroke={1.5} />}
              color='mublinColor'
            />
            <NavLink
              active={props.page === 'setlist'}
              href={`/dashboard/${username}/setlist`}
              label='Músicas pra tirar'
              leftSection={<IconHeadphones size={16} stroke={1.5} />}
              color='mublinColor'
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='admin'>
          <Accordion.Control icon={<IconLock />} disabled={!isAdmin}>Funções administrativas</Accordion.Control>
          <Accordion.Panel>
            {isAdmin && 
              <>
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Dados do projeto</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Informações'
                  leftSection={<IconPencil size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <NavLink
                  active={props.page === 'adminPicture'}
                  href={`/dashboard/${username}/admin/picture`}
                  label='Foto de perfil'
                  leftSection={<IconPhoto size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <NavLink
                  href='#required-for-focus'
                  label='Foto de capa'
                  leftSection={<IconPictureInPictureTop size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Pessoas e funções</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Gerenciar pessoas'
                  leftSection={<IconUsersGroup size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Vagas e oportunidades</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Criar nova vaga'
                  leftSection={<IconPlus size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Eventos</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Criar novo evento'
                  leftSection={<IconCalendarPlus size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <NavLink
                  href='#required-for-focus'
                  label='Ver eventos'
                  leftSection={<IconCalendarWeek size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Músicas</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Cadastrar nova música'
                  leftSection={<IconMusicPlus size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <NavLink
                  href='#required-for-focus'
                  label='Ver músicas'
                  leftSection={<IconList size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
                <Text ml={10} my={8} c='dimmed' size='xs' tt='uppercase'>Financeiro</Text>
                <NavLink
                  href='#required-for-focus'
                  label='Gerenciar finanças'
                  leftSection={<IconReportMoney size={16} stroke={1.5} />}
                  color='mublinColor'
                  disabled
                />
              </>
            }
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default ProjectDashboardMenu