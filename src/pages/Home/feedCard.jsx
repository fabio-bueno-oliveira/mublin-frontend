import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../store/actions/misc'
import { Loader, Modal, Menu, Card, Flex, Box, Group, Anchor, Button, Text, Badge, Image, Avatar, ScrollArea, rem } from '@mantine/core'
import { IconHeart, IconHeartFilled, IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconDotsVertical, IconTrash, IconUserCircle, IconBrandYoutubeFilled } from '@tabler/icons-react'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import ReactPlayer from 'react-player/youtube'
import { truncateString } from '../../utils/formatter'

function FeedCard ({ item, likes, compact }) {

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const feed = useSelector(state => state.feed)

  const totalLikes = likes?.likes;
  const likedByMe = likes?.likedByMe;

  const [loadingAction, isLoadingAction] = useState(0);
  const [showModalLikes, setShowModalLikes] = useState(false);

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '1px' };
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) };

  const likeFeedPost = (feedId) => {
    isLoadingAction(feedId);
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      dispatch(miscInfos.getFeedLikes());
      isLoadingAction(0);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao curtir a postagem");
      isLoadingAction(0);
    })
  }

  const unlikeFeedPost = (feedId) => {
    isLoadingAction(feedId);
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      dispatch(miscInfos.getFeedLikes())
      isLoadingAction(0);
    }).catch(err => {
      console.error(err);
      alert("Ocorreu um erro ao curtir a postagem");
      isLoadingAction(0);
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

  const deleteFeedPost = (postId) => {
    isLoadingAction(true)
    fetch('https://mublin.herokuapp.com/feed/'+postId+'/deleteFeedItem', {
      method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      isLoadingAction(false)
      dispatch(miscInfos.getFeed())
    }).catch(err => {
      console.error(err)
      isLoadingAction(false)
      alert("Ocorreu um erro ao remover o post. Tente novamente em instantes")
    })
  }

  const getYoutubeId = (url) => {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  return (
    <>
      <Card 
        key={item.id}
        radius='lg'
        withBorder
        px='0'
        py='11'
        mb='10'
        className='mublinModule'
        width={compact ? {height:'50%'} : undefined}
        style={compact ? {height:'100%'} : undefined}
      >
        {!!item.suggested && 
          <Text ml='15' fz='0.8rem' c='dimmed' mb='8'>Publicação sugerida</Text>
        }
        <Flex px='15' gap={5} align='center' >
          <Link to={{ pathname: `/${item.relatedUserUsername}` }}>
            <Avatar 
              size='45px'
              radius='xl'
              src={item.relatedUserPicture ? item.relatedUserPicture : undefined}
              alt={'Foto de '+item.relatedUserName}
            />
          </Link>
          <Box style={{flexGrow:'1'}}>
            <Flex gap={2} align='center' mb={2}>
              <Text size='0.93rem'>
                <Anchor 
                  fw='600' 
                  style={{lineHeight:'normal'}} 
                  href={`/${item.relatedUserUsername}`}
                >
                  {item.relatedUserName} {item.relatedUserLastname}
                </Anchor>
              </Text>
              {!!item.relatedUserVerified &&
                <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} title='Perfil verificado' />
              }
              {!!item.relatedUserLegend &&
                <IconShieldCheckFilled style={iconLegendStyle} title='Lenda da música' />
              }
              {/* {item.relatedUserPlan === 'Pro' && <Badge size='xs' variant='light' color='gray'>PRO</Badge>} */}
            </Flex>
            <Text size='0.76rem' fw='420'>
              {item.relatedUserMainRole} {item.relatedUserCity && `• ${item.relatedUserCity}`}{item.relatedUserRegion && `, ${item.relatedUserRegion}`}
            </Text>
            <Text 
              c='dimmed' 
              size='0.74rem'
              fw='420'
              mt='4'
              title={format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}
              className='fitContent'
            >
              há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
            </Text>
          </Box>
          {!compact &&
            <Menu shadow="md" position="bottom-end" width={200}>
              <Menu.Target className='point'>
                <IconDotsVertical style={{ width: rem(18), height: rem(18), marginTop: '-20px', opacity: '0.5'}} />
              </Menu.Target>
              <Menu.Dropdown>
                {!compact && 
                  <Menu.Item
                    disabled={loadingAction}
                    leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => goToProfile(item.relatedUserUsername)}
                  >
                    {item.relatedUserUsername === userInfo.username ? (
                      <>Ver meu perfil</>
                    ) : (
                      <>Ver perfil de {item.relatedUserName}</>
                    )}
                  </Menu.Item>
                }
                {item.relatedUserUsername === userInfo.username && 
                  <Menu.Item
                    disabled={loadingAction}
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => deleteFeedPost(item.id)}
                  >
                    Deletar post
                  </Menu.Item>
                }
              </Menu.Dropdown>
            </Menu>
          }
        </Flex>
        {(item.action && item.categoryId !== 8) && 
          <Text px='15' size='0.85em' mt='7px' style={{lineHeight:'1.25em',opacity:'0.8'}}>
            {item.action} {item.category === 'project' ? item.relatedProjectName : (<a href='/'>{item.relatedEventTitle}</a>)}
          </Text>
        }
        {(item.categoryId === 8) && 
          <>
            <Box>
              <Text 
                lineClamp={compact ? 2 : undefined} 
                px='15' size='0.87em' mt='12px' 
                style={{lineHeight:'1.25em',opacity:'0.8'}}
              >
                {item.extraText}
              </Text>
            </Box>
            {(item.image && !compact) && 
              <Image
                mt='10'
                mb='8'
                w='100%'
                fit='cover'
                src={item.image}
              />
            }
            {(item.image && compact) && 
              <Image
                mt='10'
                mb='8'
                ml='15'
                h={90}
                w={120}
                fit='contain'
                src={item.image}
              />
            }
            {(item.videoUrl && !compact) && 
              <div className='player-wrapper' style={{marginTop:'10px'}}>
                <ReactPlayer
                  className='react-player'
                  stopOnUnmount={true}
                  width='100%'
                  height='100%'
                  url={item.videoUrl}
                />
              </div>
            }
            {(item.videoUrl && compact) && (
              <Group gap='8' ml='15'>
                <Image
                  src={`https://img.youtube.com/vi/${getYoutubeId(item.videoUrl)}/mqdefault.jpg`}
                  h={90}
                  w={120}
                  fit='contain'
                />
                <IconBrandYoutubeFilled />
              </Group>
            )}
          </>
        }
        {item.relatedProjectPicture && 
          <Box px='15'>
            <Link to={{ pathname: `/project/${item.relatedProjectUsername}` }} style={{display:'block',width:'fit-content'}}>
              <Card className='mublinModule' withBorder p={8} mt={8} radius='md' style={{display:'block',width:'fit-content'}}>
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
                    <Text size='0.8rem' fw='500'>{item.relatedProjectName}</Text>
                    <Text size='xs' c='dimmed'>{item.relatedProjectType}</Text>
                  </Box>
                </Flex>
              </Card>
            </Link>
          </Box>
        }
        {item.relatedGearPicture && 
          <Box px='15'>
            <Link to={{ pathname: `/gear/product/${item.relatedGearId}` }} style={{display:'block',width:'fit-content'}}>
              <Card className='mublinModule' withBorder p={8} mt={8} radius='md' style={{display:'block',width:'fit-content'}}>
                <Flex gap={4} align='center'>
                  <Image 
                    radius='md'
                    h='70'
                    w='70'
                    fit='contain'
                    size='66px'
                    src={item.relatedGearPicture}
                  />
                  <Box>
                    <Text size='0.8rem' fw='500'>{item.relatedGearName}</Text>
                    <Text size='xs' c='dimmed'>{item.relatedGearBrand}</Text>
                    {!!item.relatedGearForSale && 
                      <Group mt='3' gap='2'>
                        <Badge size='xs' color='gray'>À venda!</Badge>
                        {!!item.relatedGearPrice && 
                          <Text size='10px' fw={300}>
                            {item.relatedGearPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                          </Text>
                        }
                      </Group>
                    }
                  </Box>
                </Flex>
              </Card>
            </Link>
          </Box>
        }
        <Flex justify='space-between' align='flex-end'>
        {/* START Like/Unlike */}
        {(item.categoryId !== 6 && item.categoryId !== 7 && !feed.requesting && !compact) && 
          <Flex 
            align='center'
            gap='9'
            mt='12'
            px='15'
          >
            {loadingAction === item.id ? (
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
                fw='500'
                c='dimmed' 
                pt='1'
                className='point'
                onClick={() => openModalLikes(item.id)}
              >
                {totalLikes}
              </Text>
            }
          </Flex> 
        }
        {/* <Text 
          c='dimmed' 
          size='11px'
          px='20'
          mb='3'
          ta='right'
          title={format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')}
          className='fitContent op80'
        >
          há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
        </Text> */}
        </Flex>
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
                    <IconRosetteDiscountCheckFilled color='#7950f2' style={iconVerifiedStyle} />
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