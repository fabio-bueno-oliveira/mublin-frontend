import React from 'react'
import { useParams } from 'react-router'
import { useMantineColorScheme, Flex, Menu, Text, Avatar } from '@mantine/core'
import { IconLayoutDashboard, IconMoon, IconArrowLeft, IconBrightnessUp } from '@tabler/icons-react'

function ProjectDashboardHeader (props) {

  const params = useParams()
  const username = params?.username
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const { colorScheme, setColorScheme } = useMantineColorScheme()

  return (
    <Flex justify='space-between' mb={26}>
      <Text size='sm' c='dimmed' mb={20}>Painel de Controle / {props.page}</Text>
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
          <Menu.Label>Painel de Controle</Menu.Label>
          <Menu.Item leftSection={<IconLayoutDashboard size={14} />} component='a' href={`/dashboard/${username}`}>
            Home do Painel
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Aparência</Menu.Label>
          {colorScheme === 'dark' && 
            <Menu.Item leftSection={<IconBrightnessUp size={14} />} onClick={() => {setColorScheme('light')}}>
              Mudar para tema claro
            </Menu.Item>
          }
          {colorScheme === 'light' && 
            <Menu.Item leftSection={<IconMoon size={14} />} onClick={() => {setColorScheme('dark')}}>
              Mudar para tema escuro
            </Menu.Item>
          }
          <Menu.Divider />
          <Menu.Item leftSection={<IconArrowLeft size={14} />} component='a' href='/home'>
            Voltar para a home do Mublin
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}

export default ProjectDashboardHeader