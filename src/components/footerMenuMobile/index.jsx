import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userActions } from '../../store/actions/user'
import { miscInfos } from '../../store/actions/misc'
import { userProjectsInfos } from '../../store/actions/userProjects'
import { Drawer, Box, Flex, Button, Text, Avatar } from '@mantine/core'
import { IconMusicPlus, IconCubePlus, IconHome, IconSearch, IconUser, IconHexagonPlusFilled, IconMusic, IconPencilPlus } from '@tabler/icons-react'
import './styles.scss'

const FooterMenuMobile = (props) => {

  const dispatch = useDispatch()
  let navigate = useNavigate()
  let currentPath = window.location.pathname

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const [drawerNewIsOpen, setDrawerNewIsOpen] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const handleHomeClick = () => {
    navigate("/home")
    // setRefreshCounter(refreshCounter + 1)
    setDrawerNewIsOpen(false)
  }

  useEffect(() => {
    if (props.page === 'home' && refreshCounter > 0) {
      dispatch(userActions.getInfo())
      dispatch(miscInfos.getFeed())
      dispatch(userProjectsInfos.getUserProjects(loggedUserId, 'all'))
    }
  }, [refreshCounter])

  return (
    <>
      <footer className='menuMobile mantine-hidden-from-sm'>
        <div>
          <div
            className={currentPath === '/home' ? 'active' : undefined} 
            onClick={() => handleHomeClick()}
          >
            <IconHome />
          </div>
          <div 
            className={currentPath === '/search' ? 'active' : undefined} 
            onClick={() => navigate("/search")}
          >
            <IconSearch />
          </div>
          <div
            className={currentPath === '/new' ? 'active plus' : 'plus'} 
            onClick={() => setDrawerNewIsOpen(prevCheck => !prevCheck)}
          >
            <IconHexagonPlusFilled />
          </div>
          <div
            className={
              (currentPath === '/projects' || currentPath.includes('/project')) 
                ? 'active' 
                : undefined
            } 
            onClick={() => navigate("/projects")}
          >
            <IconMusic />
          </div>
          <div 
            className={currentPath === '/menu' ? 'active' : undefined} 
            // onClick={() => navigate("/menu")}
          >
            {/* <IconUser /> */}
            <Avatar
              onClick={() => navigate("/menu")}
              w={35}
              h={35}
              className='point'
              src={userInfo.picture ? 'https://ik.imagekit.io/mublin/tr:h-76,w-76,r-max,c-maintain_ratio/users/avatars/'+userInfo.picture : undefined}
              alt={userInfo.username}
            />
          </div>
        </div>
      </footer>
      <Drawer
        offset={8}
        radius='md'
        opened={drawerNewIsOpen}
        onClose={() => setDrawerNewIsOpen(false)}
        title='O que deseja criar?'
        position='bottom'
      >
        <Flex mb={40} mt={4} direction='column' gap={18}>
          <Box>
            <Button
              variant='filled'
              color='mublinColor'
              size='md'
              radius='md'
              leftSection={<IconMusicPlus size={19} />}
              fullWidth
              onClick={() => navigate('/new/project')}
            >
              Novo projeto
            </Button>
            <Text ta='center' size='xs' c='dimmed' mt={5} px={10}>
              Ingresse em projetos de música novos ou em atividade
            </Text>
          </Box>
          <Box>
            <Button
              variant='filled'
              color='mublinColor'
              size='md'
              radius='md'
              leftSection={<IconPencilPlus size={19} />}
              fullWidth
              onClick={() => navigate('/new/post')}
            >
              Nova postagem
            </Button>
            <Text ta='center' size='xs' c='dimmed' mt={5} px={10}>
              Escreva um novo post
            </Text>
          </Box>
          <Box>
            <Button
              variant='filled'
              color='mublinColor'
              size='md'
              radius='md'
              leftSection={<IconCubePlus size={22} />}
              fullWidth
              onClick={() => navigate('/new/gear')}
            >
              Novo equipamento
            </Button>
            <Text ta="center" size="xs" c="dimmed" mt={5} px={10}>
              Cadastre um novo item do seu equipamento
            </Text>
          </Box>
        </Flex>
      </Drawer>
    </>
  );
};

export default FooterMenuMobile;