import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { useParams } from 'react-router';
import { gearInfos } from '../../store/actions/gear';
import { useDispatch, useSelector } from 'react-redux';
import { Container, NativeSelect, Grid, Anchor, Center, BackgroundImage, Flex, Avatar, Card, Image, Text, Group, ColorSwatch, em } from '@mantine/core';
import { IconShieldCheckFilled, IconRosetteDiscountCheckFilled, IconUsers, IconLink, IconTagStarred } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';

function BrandPage () {

  let navigate = useNavigate();
  const params = useParams();
  const brandUrlName = params?.brandUrlName;
  const brand = useSelector(state => state.brand);
  const largeScreen = useMediaQuery('(min-width: 60em)');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [isLoaded, setIsLoaded] = useState(false);
  const [brands, setBrands] = useState([]);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(gearInfos.getBrandInfo(brandUrlName));
    dispatch(gearInfos.gerBrandProducts(brandUrlName));
    dispatch(gearInfos.gerBrandPartners(brandUrlName));
    dispatch(gearInfos.gerBrandOwners(brandUrlName));
    dispatch(gearInfos.getBrandColors(brandUrlName));
  }, [brandUrlName]);

  useEffect(() => {
    fetch("https://mublin.herokuapp.com/gear/brands")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setBrands(result)
        },
        (error) => {
          setIsLoaded(true)
          console.error(error)
        }
      )
  }, [])

  return (
    <>
      <Header />
      <Container size='lg' mt={largeScreen ? 20 : 0} mb={110}>
        <BackgroundImage
          src={brand.cover ? 'https://ik.imagekit.io/mublin/products/brands/'+brand.cover : 'https://ik.imagekit.io/mublin/bg/tr:w-1920,h-200,bg-F3F3F3,fo-bottom/open-air-concert.jpg'}
          radius='lg'
          h={140}
          pt={62}
        >
          <Flex align='center' justify='center'>
            <Avatar 
              variant='white' 
              src={brand.logo ? brand.logo : undefined} 
              alt={brand.name} 
              size='140px'
            />
          </Flex>
        </BackgroundImage>
        <Grid mt={78}>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <NativeSelect
              onChange={(e) => navigate('/gear/brand/'+e.target.options[e.target.selectedIndex].value)}
              value={brandUrlName}
              variant="filled"
              size='md'
              fw={500}
            >
              {(!isLoaded) &&
                <option>Carregando marcas...</option>
              } 
              <option value=''>Marcas</option>
              {isLoaded && brands.map((brand,key) =>
                <option key={key} value={brand.slug}>{brand.name}</option>
              )}
            </NativeSelect>
            {/* <Title order={2}>
              {brand.name}
            </Title> */}
            {/* <Text size='sm' fw={500}>Website</Text> */}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
            {brand.website &&
              <Group mt={largeScreen ? 14 : 0} justify='flex-end'>
                <Anchor
                  href={brand.website}
                  underline='hover'
                  target='_blank'
                  // className='websiteLink'
                >
                  <Flex gap={2} align='center'>
                    <IconLink size={13} />
                    <Text size='sm'>
                      {brand.website}
                    </Text>
                  </Flex>
                </Anchor>
              </Group>
            }
            {/* {brand.description &&
              <Text size='xs'>
                {brand.description}
              </Text>
            } */}
          </Grid.Col>
        </Grid>
        {brand.partners.total && 
          <>
            <Flex align='center' gap={5} mt={14}>
              <IconTagStarred style={{width:'15px',height:'15px'}} />
              <Text size='xs'>
                Parceiros e Endorsees
              </Text>
            </Flex>
            <Splide 
              options={{
                drag: 'free',
                snap: false,
                perPage: isMobile ? 3 : 3,
                autoWidth: true,
                arrows: false,
                gap: '3px',
                dots: false,
                pagination: false,
              }}
            >
              {brand.partners.result.map(user =>
                <SplideSlide>
                  <Card className='mublinModule' withBorder py={5} px={7} radius='xl' mt={6}>
                    <Flex gap={5} align='center'>
                      <Link to={{ pathname: `/${user.username}` }}>
                        <Avatar src={user.picture ? 'https://ik.imagekit.io/mublin/tr:h-40,w-40,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : undefined} />
                      </Link>
                      <Flex direction='column'>
                        <Group gap={0}>
                          <Text size='xs' fw={500}>{user.name} {user.lastname}</Text>
                          {!!user.verified && 
                            <IconRosetteDiscountCheckFilled 
                              className='iconVerified small'
                            />
                          }
                          {!!user.legend && 
                            <IconShieldCheckFilled
                              className='iconLegend small'
                            />
                          }
                        </Group>
                        <Text size='xs'>{user.username}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </SplideSlide>
              )}
            </Splide>
          </>
        }
        <ResponsiveMasonry
          columnsCountBreakPoints={{350: 2, 750: 3, 900: 4}}
          style={{marginTop:'18px'}}
        >
          <Masonry gutter='8px'>
            {brand.products.map(product =>
              <Card
                withBorder
                className='mublinModule gearDetailCard'
                px={10}
                pb={10}
                pt={0}
                key={product.id}
              >
                <Card.Section>
                  <Center pt={20}>
                    <Link to={{ pathname: `/gear/product/${product.id}` }}>
                      <Image
                        src={product.picture}
                        h={150}
                        w='auto'
                        fit='contain'
                        alt={product.name}
                      />
                    </Link>
                  </Center>
                </Card.Section>
                {brand.colors.total > 0 &&
                  <Link to={{ pathname: `/gear/product/${product.id}` }}>
                    <Group gap={5} mt={14}>
                      {brand.colors.result.filter((x) => { return x.productId === product.id }).map(color => 
                        <ColorSwatch
                          color={color.sample ? undefined : color.rgb}
                          title={color.name}
                          className={color.sample ? 'removeAlpha' : undefined}
                          style={{backgroundSize:'28px 28px', backgroundImage: "url(" + 'https://ik.imagekit.io/mublin/products/colors/'+color.sample + ")",width:'14px',minWidth:'14px',height:'14px',minHeight:'14px'}}
                        />
                      )}
                    </Group>
                  </Link>
                }
                <Group justify='space-between' mt='xs'>
                  <Text size='sm' fw={500}>{product.name}</Text>
                </Group>
                <Flex gap={3} mt={4} align='center' justify='space-between'>
                  <Text size='xs' c='dimmed'>
                    {product.categoryName}
                  </Text>
                  <Flex c='dimmed' gap={3} align='center' title={product.totalOwners + ' pessoas possuem'}>
                    <IconUsers style={{width:'13px',height:'13px'}} />
                    <Text size='xs'>
                      {product.totalOwners}
                    </Text>
                  </Flex>
                </Flex>
                <Flex justify='flex-end' mt={6}>
                  <Avatar.Group>
                    {brand.owners.result.filter(x => x.productId === product.id).map(user =>
                      <Link to={{ pathname: `/${user.username}` }}>
                        <Avatar size={35} src={user.picture ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+user.id+'/'+user.picture : undefined} title={user.name + ' ' + user.lastname} />
                      </Link>
                    )}
                  </Avatar.Group>
                </Flex>
              </Card>
            )}
          </Masonry>
        </ResponsiveMasonry>
      </Container>
      <FooterMenuMobile />
    </>
  );
};

export default BrandPage;