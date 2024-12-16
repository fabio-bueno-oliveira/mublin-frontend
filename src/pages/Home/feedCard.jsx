import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { Card, Flex, Box, Anchor, Text, Badge, Image, Avatar, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

function FeedCard (props) {

  const loggedUser = JSON.parse(localStorage.getItem('user'))

  let dispatch = useDispatch()

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const feed = useSelector(state => state.feed)
  const item = props.item

  const likeFeedPost = (feedId) => {
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      }
    })
    .then(() => {
      dispatch(miscInfos.getFeed());
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao curtir a postagem")
    })
  }

  const unlikeFeedPost = (feedId) => {
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      }
    })
    .then((response) => {
      dispatch(miscInfos.getFeed())
    }).catch(err => {
      console.error(err)
      alert("Ocorreu um erro ao curtir a postagem")
    })
  }

  return (
    <Card 
      key={item.id}
      radius={isMobile ? 0 : 'md'}
      withBorder={isMobile ? false : true}
      px={isMobile ? 15 : 15} 
      pt={isMobile ? 13 : 11}
      pb={isMobile ? 10 : 11}
      mb={isMobile ? 8 : 12}
      style={isMobile ? {borderTop:'1px solid #dee2e6',borderBottom:'1px solid #dee2e6'} : undefined}
      className='mublinModule'
      id='feed'
    >
      <Flex gap={5} align='center'>
        <Link to={{ pathname: `/${item.relatedUserUsername}` }}>
          <Avatar 
            size='45px'
            radius="xl"
            src={item.relatedUserPicture ? item.relatedUserPicture : undefined}
            alt={'Foto de '+item.relatedUserName}
          />
        </Link>
        <Box>
          <Flex gap={4} align='center'>
            <Text size='sm'>
              <Anchor fw='500' href={`/${item.relatedUserUsername}`}>
                {item.relatedUserName} {item.relatedUserLastname}
              </Anchor>
            </Text>
            {item.relatedUserPlan === "Pro" && <Badge size='xs' variant='light' color='gray'>PRO</Badge>}
          </Flex>
          <Text c='dimmed' size='11px' fw={420} mb={3}>
            {item.relatedUserMainRole} {item.relatedUserCity && `• ${item.relatedUserCity}`}{item.relatedUserRegion && `, ${item.relatedUserRegion}`}
          </Text>
          <Text c='dimmed' size='11px' title={format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}>
            há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
          </Text>
        </Box>
      </Flex>
      {(item.action && item.categoryId !== 8) && 
        <Text size='0.85em' mt='7px' style={{lineHeight:'1.25em',opacity:'0.8'}}>
          {item.action} {item.category === 'project' ? item.relatedProjectName : (<a href='/'>{item.relatedEventTitle}</a>)}
        </Text>
      }
      {(item.categoryId === 8) && 
        <Text size='0.85em' mt='7px' style={{lineHeight:'1.25em',opacity:'0.8'}}>
          {item.extraText}
        </Text>
      }
      {(item.relatedProjectPicture) && 
        <Link to={{ pathname: `/project/${item.relatedProjectUsername}` }}>
          <Card withBorder p={8} mt={8} radius='md'>
            <Flex gap={4} align='center'>
              <Image 
                radius='md'
                h={70}
                w={70}
                fit='contain'
                size='66px'
                src={item.relatedProjectPicture}
              />
              <Box>
                <Text size='xs' fw={500}>{item.relatedProjectName}</Text>
                <Text size='xs' c='dimmed'>{item.relatedProjectType}</Text>
              </Box>
            </Flex>
          </Card>
        </Link>
      }
      {(item.categoryId !== 6 && item.categoryId !== 7 && !feed.requesting) && 
        <Flex 
          align='center'
          gap={3}
          mt={8}
        >
          {item.likedByMe ? (
            <IconHeartFilled
              size={18}
              color='#7950f2'
              style={{cursor:'pointer'}}
              onClick={() => unlikeFeedPost(item.id)}
            />
          ) : (
            <IconHeart
              size={18}
              style={{cursor:'pointer'}}
              onClick={() => likeFeedPost(item.id)}
            />
          )}
          {item.likes > 0 && 
            <Text size='13px' c='dimmed'>{item.likes}</Text>
          }
        </Flex> 
      }
    </Card>
  );
};

export default FeedCard;