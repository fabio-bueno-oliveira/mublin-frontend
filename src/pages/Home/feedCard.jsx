import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { Loader, Modal, Menu, Card, Flex, Box, Group, Anchor, Text, Badge, Image, Avatar, ScrollArea, rem, em } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconHeart, IconHeartFilled, IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconDotsVertical, IconTrash } from '@tabler/icons-react'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'

function FeedCard ({ item, likes }) {

  const loggedUser = JSON.parse(localStorage.getItem('user'))

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const feed = useSelector(state => state.feed)

  const totalLikes = likes?.likes;
  const likedByMe = likes?.likedByMe;

  const [loadingLikeAction, isLoadingLikeAction] = useState(0);
  const [showModalLikes, setShowModalLikes] = useState(false);

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '5px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15), marginLeft: '5px' };

  const likeFeedPost = (feedId) => {
    isLoadingLikeAction(feedId);
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      }
    })
    .then(() => {
      dispatch(miscInfos.getFeedLikes());
      isLoadingLikeAction(0);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao curtir a postagem");
      isLoadingLikeAction(0);
    })
  }

  const unlikeFeedPost = (feedId) => {
    isLoadingLikeAction(feedId);
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loggedUser.token
      }
    })
    .then((response) => {
      dispatch(miscInfos.getFeedLikes())
      isLoadingLikeAction(0);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao curtir a postagem");
      isLoadingLikeAction(0);
    })
  }

  const openModalLikes = (idFeed) => {
    dispatch(miscInfos.getItemLikes(idFeed));
    setShowModalLikes(true);
  }

  const goToProfile = (username) => {
    setShowModalLikes(false);
    navigate('/'+username);
  }

  return (
    <>
      <Card 
        key={item.id}
        radius='lg'
        withBorder
        px='15'
        py='11'
        mb='10'
        className='mublinModule'
      >
        <Flex gap={5} align='center' >
          <Link to={{ pathname: `/${item.relatedUserUsername}` }}>
            <Avatar 
              size='45px'
              radius="xl"
              src={item.relatedUserPicture ? item.relatedUserPicture : undefined}
              alt={'Foto de '+item.relatedUserName}
            />
          </Link>
          <Box style={{flexGrow:'1'}}>
            <Flex gap={4} align='center' mb={2}>
              <Text size={isMobile ? '1.04rem' : 'sm'}>
                <Anchor size='md' fw={460} style={{lineHeight:'normal'}} href={`/${item.relatedUserUsername}`}>
                  {item.relatedUserName} {item.relatedUserLastname}
                </Anchor>
              </Text>
              {item.relatedUserPlan === "Pro" && <Badge size='xs' variant='light' color='gray'>PRO</Badge>}
            </Flex>
            <Text c='dimmed' size='11px' fw={420} mb={3}>
              {item.relatedUserMainRole} {item.relatedUserCity && `• ${item.relatedUserCity}`}{item.relatedUserRegion && `, ${item.relatedUserRegion}`}
            </Text>
            <Text 
              c='dimmed' 
              size='11px' 
              title={format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}
            >
              há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
            </Text>
          </Box>
          {item.relatedUserUsername === loggedUser.username && 
            <Menu shadow="md" position="bottom-end" width={200}>
              <Menu.Target className='point'>
                <IconDotsVertical style={{ width: rem(18), height: rem(18), marginTop: '-20px', opacity: '0.5'}} />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}>
                  Deletar post
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
        </Flex>
        {(item.action && item.categoryId !== 8) && 
          <Text size='0.85em' mt='7px' style={{lineHeight:'1.25em',opacity:'0.8'}}>
            {item.action} {item.category === 'project' ? item.relatedProjectName : (<a href='/'>{item.relatedEventTitle}</a>)}
          </Text>
        }
        {(item.categoryId === 8) && 
          <Text size='0.89em' mt='7px' style={{lineHeight:'1.25em',opacity:'0.8'}}>
            {item.extraText}
          </Text>
        }
        {item.relatedProjectPicture && 
          <Link to={{ pathname: `/project/${item.relatedProjectUsername}` }} style={{width:'fit-content'}}>
            <Card className='mublinModule' withBorder p={8} mt={8} radius='md' style={{width:'fit-content'}}>
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
        {(item.category === 'gear' && item.relatedGearPicture) && 
          <Link to={{ pathname: `/gear/product/${item.relatedGearId}` }} style={{width:'fit-content'}}>
            <Card className='mublinModule' withBorder p={8} mt={8} radius='md' style={{width:'fit-content'}}>
              <Flex gap={4} align='center'>
                <Image 
                  radius='md'
                  h={70}
                  w={70}
                  fit='contain'
                  size='66px'
                  src={item.relatedGearPicture}
                />
                <Box>
                  <Text size='xs' fw={500}>{item.relatedGearName}</Text>
                  <Text size='xs' c='dimmed'>{item.relatedGearBrand}</Text>
                </Box>
              </Flex>
            </Card>
          </Link>
        }
        {/* START Like/Unlike */}
        {(item.categoryId !== 6 && item.categoryId !== 7 && !feed.requesting) && 
          <Flex 
            align='center'
            gap={4}
            mt={12}
          >
            {loadingLikeAction === item.id ? (
              <Loader color='violet' size={18} />
            ) : (
              <>
                {likedByMe ? (
                  <IconHeartFilled
                    size={20}
                    color='#E32636'
                    style={{cursor:'pointer'}}
                    onClick={() => unlikeFeedPost(item.id)}
                  />
                ) : (
                  <IconHeart
                    size={20}
                    style={{cursor:'pointer'}}
                    onClick={() => likeFeedPost(item.id)}
                  />
                )}
              </>
            )}
            {totalLikes > 0 && 
              <Text 
                size='13px' 
                c='dimmed' 
                pt={1} 
                className='point'
                onClick={() => openModalLikes(item.id)}
              >
                {totalLikes}
              </Text>
            }
          </Flex> 
        }
      </Card>
      <Modal
        centered
        opened={showModalLikes}
        onClose={() => setShowModalLikes(false)}
        title={feed.requestingLikes ? 'Carregando...' : feed.itemLikes.total + ' curtiram'}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {feed.requestingLikes ? (
          <Text size='xs'>Carregando...</Text>
        ) : (
          feed.itemLikes.list.map((user, key) => 
            <Flex key={key} align={'center'} gap={7} mb={6} onClick={() => goToProfile(user.username)}>
              <Avatar 
                className='point' 
                radius='xl' 
                size='md' 
                src={user.picture ? user.picture : undefined} 
              />
              <Flex direction={'column'} className='point'>
                <Group gap={0}>
                  <Text size='sm' fw={450}>
                    {user.name} {user.lastname}
                  </Text>
                  {user.verified &&
                    <IconRosetteDiscountCheckFilled color='blue' style={iconVerifiedStyle} />
                  }
                  {user.legend_badge &&
                    <IconShieldCheckFilled style={iconLegendStyle} />
                  }
                </Group>
                <Text size='xs'>
                  {'@'+user.username}
                </Text>
              </Flex>
            </Flex>
          )
        )}
      </Modal>
    </>
  );
};

export default FeedCard;