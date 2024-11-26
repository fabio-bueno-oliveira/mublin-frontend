import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Title, Text, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import useEmblaCarousel from 'embla-carousel-react';

function PartnersModule ({ 
    partners, 
    loading
}) {

  const [emblaRef] = useEmblaCarousel(
    {
      active: true,
      loop: false, 
      dragFree: true, 
      align: 'start' 
    }
  )

  return (
    <Paper 
      radius="md" 
      mb={25}
      style={{ backgroundColor: 'transparent' }}
    >
      <Title order={5} mb={8}>Parceiros e Patrocínios</Title>
      {loading ? ( 
        <Text size='sm'>Carregando...</Text>
      ) : (
        <>
          {partners.total ? ( 
            <>
            {/* <Carousel
              withIndicators
              height={200}
              slideSize="33.333333%"
              slideGap="md"
              loop
              align="start"
              slidesToScroll={3}
            >
              {partners.result.map((partner, key) =>
                <Carousel.Slide>
                  <Image 
                    src={partner.brandLogoRectangular} 
                    w={'100%'}
                    mb={3}
                    title={partner.brandName}
                    alt={partner.brandName}
                  />
                </Carousel.Slide>
              )}
            </Carousel> */}
            <div className="embla partners" ref={emblaRef}>
              <div className="embla__container">
                {partners.result.map((partner, key) =>
                  <div className="embla__slide" key={key}>
                    <Link to={{ pathname: `/brand/${partner.brandId}` }}>
                      <Image 
                        src={partner.brandLogoRectangular} 
                        h={'42px'}
                        mb={3}
                        title={partner.brandName}
                        alt={partner.brandName}
                      />
                    </Link>
                    <Text size='10px'>{partner.type}</Text>
                  </div>
                )}
              </div>
            </div>
            </>
          ) : (
            <Text size='xs'>Nenhum parceiro no momento</Text>
          )}
        </>
      )}
    </Paper>
  );
};

export default PartnersModule;