import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router';
import { gearInfos } from '../../store/actions/gear';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, NativeSelect, Grid, Anchor, Center, BackgroundImage, Flex, Avatar, Card, Image, Text, Group } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Header from '../../components/header';
import FooterMenuMobile from '../../components/footerMenuMobile';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'

function BrandPage () {

  let navigate = useNavigate();
  const params = useParams();
  const brandUrlName = params?.brandUrlName;
  const brand = useSelector(state => state.brand);
  const largeScreen = useMediaQuery('(min-width: 60em)');

  const [isLoaded, setIsLoaded] = useState(false);
  const [brands, setBrands] = useState([]);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(gearInfos.getBrandInfo(brandUrlName));
    dispatch(gearInfos.gerBrandProducts(brandUrlName));
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
        <Grid mt={70}>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <NativeSelect
              onChange={(e) => navigate('/gear/brand/'+e.target.options[e.target.selectedIndex].value)}
              value={brandUrlName}
              variant="filled"
              size='lg'
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
              <Text ta={largeScreen ? 'right' : 'left'} size='sm' mt={largeScreen ? 14 : 0}>
                <Anchor href={brand.website} underline='hover' target='_blank'>
                  {brand.website}
                </Anchor>
              </Text>
            }
            {brand.description &&
              <Text size='xs'>
                {brand.description}
              </Text>
            }
          </Grid.Col>
        </Grid>
        <ResponsiveMasonry
          columnsCountBreakPoints={{350: 2, 750: 3, 900: 4}}
          style={{marginTop:'20px'}}
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
                <Group justify='space-between' mt='md'>
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