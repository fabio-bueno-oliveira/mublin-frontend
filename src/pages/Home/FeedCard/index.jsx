import React, { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { miscInfos } from '../../../store/actions/misc'
import { feedActions } from '../../../store/actions/feed'
import { Modal, Menu, Card, Skeleton, Flex, Box, Group, Anchor, Text, Badge, Image, Avatar, ScrollArea, TextInput, Button, Spoiler, Indicator, rem, em } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMediaQuery } from '@mantine/hooks'
import { IconHeart, IconHeartFilled, IconRosetteDiscountCheckFilled, IconShieldCheckFilled, IconDotsVertical, IconTrash, IconUserCircle, IconBrandYoutubeFilled, IconClock, IconSend, IconMessageCircle, IconPiano, IconPlus } from '@tabler/icons-react'
import { formatDistance, format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import linkifyStr from "linkify-string"
import parse from 'html-react-parser'
// import ReactPlayer from 'react-player/youtube'

function FeedCard ({ item, compact }) {

  const token = localStorage.getItem('token')

  const decoded = jwtDecode(token)
  const loggedUserId = decoded.result.id
  const loggedUsername = decoded.result.username

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const feed = useSelector(state => state.feed)

  const [loadingAction, isLoadingAction] = useState(0)
  const [deletingPost, setDeletingPost] = useState(0)
  const [postingComment, setPostingComment] = useState(false)
  
  const [showModalLikes, setShowModalLikes] = useState(false)
  const [showModalComments, setShowModalComments] = useState(false)

  const [comment, setComment] = useState('')

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const iconVerifiedStyle = { width: rem(15), height: rem(15), marginLeft: '1px' }
  const iconLegendStyle = { color: '#DAA520', width: rem(15), height: rem(15) }

  const likeFeedPost = (feedId) => {
    dispatch(feedActions.addLikedNow(feedId))
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      // dispatch(feedActions.addLikedNow(feedId));
    }).catch(err => {
      console.error(err);
      alert('Ocorreu um erro ao curtir a postagem');
    })
  }

  const unlikeFeedPost = (feedId) => {
    fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      dispatch(feedActions.removeLikedNow(feedId))
    }).catch(err => {
      console.error(err)
      alert('Ocorreu um erro ao curtir a postagem')
    })
  }

  const openModalLikes = (idFeed) => {
    dispatch(miscInfos.getItemLikes(idFeed))
    setShowModalLikes(true)
  }

  const openModalComments = (idFeed) => {
    dispatch(feedActions.getItemComments(idFeed))
    setShowModalComments(true)
  }

  const goToProfile = (username) => {
    setShowModalLikes(false)
    navigate('/'+username)
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

  const postComment = (feedId) => {
    if (!comment) {
      notifications.show({
        title: 'Ops!',
        message: 'O comentário não pode ser vazio',
        color: 'red',
        position: 'top-center'
      })
    } else {
      setPostingComment(true)
      fetch('https://mublin.herokuapp.com/feed/'+feedId+'/postComment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({text: comment})
      })
      .then(() => {
        dispatch(feedActions.getItemComments(feedId))
        setComment('')
        setPostingComment(false)
      }).catch(err => {
        console.error(err)
        alert('Ocorreu um erro ao curtir a postagem')
        setPostingComment(false)
      })
    }
  }

  const deleteFeedComment = (commentId) => {
    setDeletingPost(commentId)
    fetch('https://mublin.herokuapp.com/feed/'+commentId+'/deletePostComment', {
      method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      setDeletingPost(0)
      dispatch(feedActions.removeComment(commentId))
    }).catch(err => {
      console.error(err)
      setDeletingPost(0)
      alert("Ocorreu um erro ao remover o comentário. Tente novamente em instantes")
    })
  }

  // const getYoutubeId = (url) => {
  //   url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  //   return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]
  // }

  // const shortcodeToInstaID = (Shortcode) => {
  //   var char
  //   var id = 0
  //   var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  //   for (var i = 0; i < Shortcode.length; i++) {
  //     char = Shortcode[i]
  //     var mul = id * 64
  //     id = mul + alphabet.indexOf(char)
  //   }
  //   return console.log(id)
  // }

  const [followedUsers, setFollowedUsers] = useState([888])

  const followUser = (profileId) => {
    setFollowedUsers([profileId])

    fetch('https://mublin.herokuapp.com/profile/'+profileId+'/follow', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        // setIsLoading(false);
      }).catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao tentar seguir o usuário");
      })
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
        className='mublinModule feedCard'
        width={compact ? {height:'50%'} : undefined}
        style={compact ? {height:'100%'} : undefined}
      >
        {!!item.suggested && 
          <Text ml='15' fz='0.74rem' c='dimmed' mb={10}>Publicação sugerida</Text>
        }
        <Flex px='15' gap={5} align='center' >
          <Link to={{ pathname: `/${item.relatedUserUsername}` }}>
            <Indicator
              position='bottom-center'
              inline
              label={<Text size='0.48rem' >{item.relatedUserOpenToWorkText}</Text>}
              color='lime'
              size={18}
              withBorder
              // disabled={!item.relatedUserOpenToWork}
              disabled
            >
              <Avatar
                size='45px'
                radius='xl'
                src={item.relatedUserPicture ? item.relatedUserPicture : undefined}
                alt={'Foto de '+item.relatedUserName}
              />
            </Indicator>
          </Link>
          <Box style={{flexGrow:'1'}}>
              <Flex gap={2} align='center' mb={2}>
                <Text 
                  size='0.96rem' 
                  fw={570}
                  style={{lineHeight:'normal',width:'fit-content',display:'block'}}
                  component='a'
                  href={`/${item.relatedUserUsername}`}
                >
                  {item.relatedUserName} {item.relatedUserLastname}
                </Text>
                {!!item.relatedUserVerified &&
                  <IconRosetteDiscountCheckFilled color='#0977ff' style={iconVerifiedStyle} title='Verificado' />
                }
                {!!item.relatedUserLegend &&
                  <IconShieldCheckFilled style={iconLegendStyle} title='Lenda da música' />
                }
                {item.relatedUserPlan === 'Pro' && 
                  <IconPiano className='iconMublinPiano small point' title='Mublin PRO' />
                }
                {(!item.followingId && item.relatedUserUsername !== loggedUsername && !followedUsers.find((x) => x === item.relatedUserId)) && 
                  <Button
                    color='primary'
                    variant='light'
                    size='compact-xs'
                    ml='3'
                    leftSection={<IconPlus size={12} />}
                    onClick={() => followUser(item.relatedUserId)}
                  >
                    Seguir
                  </Button>
                }
              </Flex>
            <Text size='0.75rem' c='dimmed' fw='420'>
              {item.relatedUserMainRole} {item.relatedUserCity && `• ${item.relatedUserCity}`}{item.relatedUserRegion && `, ${item.relatedUserRegion}`}
            </Text>
            <Flex gap={2} align='flex-end'>
              <Text
                c='dimmed'
                size='0.74rem'
                fw='420'
                mt='4'
                className='fitContent'
              >
                há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
              </Text>
              <IconClock color='gray' style={{width:'12px',height:'12px'}} title={format(item.created * 1000, 'dd/MM/yyyy HH:mm:ss')} />
            </Flex>
          </Box>
          {!compact &&
            <Menu shadow='md' position='bottom-end' width={200}>
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
                    {item.relatedUserUsername === loggedUsername ? (
                      <>Ver meu perfil</>
                    ) : (
                      <>Ver perfil de {item.relatedUserName}</>
                    )}
                  </Menu.Item>
                }
                {item.relatedUserUsername === loggedUsername && 
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
        {(item.action && item.categoryId !== 8 && item.categoryId !== 10) && 
          <Text px='15' fz='0.85em' className='lhNormal' mt='7px'>
            {item.relatedUserName} {item.relatedUserLastname} {item.action} {item.category === 'project' ? item.relatedProjectName : (<a href='/'>{item.relatedEventTitle}</a>)}
          </Text>
        }
        {(item.categoryId === 8) && 
          <>
            <Spoiler
              maxHeight={68}
              px={15}
              mb={0}
              showLabel={
                <Text px={15} fz={isMobile ? '0.9em' : '0.85em'}>...mais</Text>
              }
              hideLabel={false}
              transitionDuration={0}
            >
              <Text
                fz={isMobile ? '0.9em' : '0.85em'}
                mt='12px'
                className='lhNormal'
                style={{whiteSpace:'pre-wrap'}}
              >
                {parse(linkifyStr(item.text, {target: '_blank'}))}
              </Text>
            </Spoiler>
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
              <>
              {/* <div className='player-wrapper' style={{marginTop:'10px'}}>
                <ReactPlayer
                  pip={true}
                  className='react-player'
                  stopOnUnmount={false}
                  width='100%'
                  height='100%'
                  url={item.videoUrl}
                />
              </div> */}
              {/* <iframe style={{marginTop:'10px'}} height='300' width='auto' src="https://www.instagram.com/p/DExcdqQM6iz/embed" scrolling="no" allowtransparency="true" allowfullscreen="false" frameborder="0">Iframe not supported</iframe>  */}
              </>
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
                    <Text fz='0.7rem' fw={500} mb={4}>
                      {item.relatedUserName} {item.relatedUserLastname} {item.action} {item.category === 'project' ? item.relatedProjectName : (<a href='/'>{item.relatedEventTitle}</a>)}
                    </Text>
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
        <Flex px='15' justify='flex-start' align='flex-end'>
          {/* START Like/Unlike */}
          {(item.categoryId !== 6 && item.categoryId !== 7 && !feed.requesting) && 
            <>
              <Flex 
                align='center'
                gap='7'
                mt='12'
              >
                {((item.likedByMe || (feed.likedNow.items.includes(item.id))) && !feed.likedNow.removeLikedByMe.includes(item.id)) ? (
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
                {(item.likes > 0 || feed.likedNow.items.includes(item.id)) && 
                  <Text
                    size='13px'
                    fw='500'
                    pt='1'
                    className='point'
                    onClick={() => openModalLikes(item.id)}
                  >
                    {(feed.likedNow.items.includes(item.id) && !item.likedByMe) ? (
                      item.likes + 1
                    ) : (
                      (feed.likedNow.removeLikedByMe.includes(item.id) && item.likedByMe) ? item.likes - 1 : item.likes
                    )}
                  </Text>
                }
              </Flex>
              <Flex 
                align='center'
                gap='7'
                mt='12'
                ml='15'
              >
                <IconMessageCircle
                  size={20}
                  style={{cursor:'pointer'}}
                  onClick={() => openModalComments(item.id)}
                />
                {item.totalComments > 1 && 
                  <Text
                    size='13px'
                    fw='500'
                    pt='1'
                    className='point'
                    onClick={() => openModalComments(item.id)}
                  >
                    {item.totalComments === 1 ? '1 comentário' : item.totalComments + ' comentários'}
                  </Text>
                }
              </Flex>
            </>
          }
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
                    <IconRosetteDiscountCheckFilled color='#0977ff' style={iconVerifiedStyle} />
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
      <Modal
        opened={showModalComments}
        onClose={() => setShowModalComments(false)}
        title={<>
          <Text>{feed.requestingComments ? 'Carregando...' : `${feed.itemComments.total} comentários`}</Text>
          <Text size='xs' c='dimmed'>Postagem de {item.relatedUserName} {item.relatedUserLastname}</Text>
        </>
        }
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Box mb={10}>
          <TextInput
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
            onKeyDown={(e) => (e.key === 'Enter') ? postComment(item.id) : undefined}
            maxLength={300}
          />
          <Flex justify='flex-end' mt={5}>
            <Button
              loading={postingComment}
              color='violet'
              size='xs'
              onClick={() => postComment(item.id)}
              rightSection={<IconSend size={14} />}
            >
              Publicar
            </Button>
          </Flex>
        </Box>
        {feed.requestingComments ? (
          <Flex gap={6} align='center'>
            <Skeleton height={46} circle />
            <Flex direction='column'>
              <Box w={170}>
                <Skeleton height={10} width={160} radius='xl' mb={7} />
                <Skeleton height={10} width={110} mb={7} radius='xl' />
              </Box>
            </Flex>
          </Flex>
        ) : (
          feed.itemComments.total ? feed.itemComments.list.map((comment, key) => 
            <Flex key={key} align='flex-start' gap={7} mb={14}>
              <Avatar
                className='point'
                radius='xl'
                size='35px'
                src={comment.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-35,w-35,c-maintain_ratio/'+comment.picture : undefined}
              />
              <Box>
                <Text size='sm'>
                  <span className='point' style={{fontWeight:'550'}}>{comment.username}</span> {!!comment.verified &&
                    <IconRosetteDiscountCheckFilled color='#0977ff' style={{ width: rem(13), height: rem(13) }} />
                  } {!!comment.legend_badge &&
                    <IconShieldCheckFilled style={{ color: '#DAA520', width: rem(13), height: rem(13) }} />
                  } {comment.text}
                </Text>
                <Text size='11px' c='dimmed' fw='550' mt={5}>
                  {comment.created} {(comment.userId === loggedUserId) && <span className='point' onClick={() => deleteFeedComment(comment.id)}>| Remover</span>} {deletingPost === comment.id && " | Removendo..."}
                </Text>
              </Box>
            </Flex>
          ) : (<Text size='sm' c='dimmed' ta='center'>Nenhum comentário até o momento</Text>)
        )}
      </Modal>
    </>
  );
};

export default FeedCard;