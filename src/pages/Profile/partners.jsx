import React from 'react'
import { Link } from 'react-router-dom'
import { Paper, Title, Text, Flex, Image } from '@mantine/core'
import { truncateString } from '../../utils/formatter'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/skyblue'

function PartnersModule ({ 
    partners,
    showTitle,
    mt,
    mb,
    loading
}) {

  return (
    <Paper 
      radius="md" 
      mt={mt}
      mb={mb}
      pt={4}
      style={{ backgroundColor: 'transparent' }}
    >
      {showTitle &&
        <Title order={6} mb={8}>Parceiros</Title>
      }
      {loading ? ( 
        <Text size='sm'>Carregando...</Text>
      ) : (
        <>
          {partners.total ? ( 
            <Splide 
              options={{
                drag   : 'free',
                snap: false,
                perPage: 3,
                autoWidth: true,
                arrows: false,
                gap: '6px',
                dots: false,
                pagination: false,
              }}
              className='carousel-roles'
            >
              {partners.result.map(partner =>
                <SplideSlide 
                  key={partner.brandId} 
                  // style={{backgroundColor:'white',padding:'3px',borderRadius:'10px'}}
                >
                  <Flex gap={3} direction='column' align='center'>
                    <Link to={{ pathname: `/gear/brand/${partner.brandSlug}` }}>
                      <Image 
                        src={partner.brandLogo} 
                        radius="xl"
                        h={32}
                        w={32}
                        fit="contain"
                        title={partner.brandName}
                        alt={partner.brandName}
                      />
                    </Link>
                    <Text size='10px' fw={450}>{truncateString(partner.brandName, 11)}</Text>
                    <Text size='9px' fw={200}>{partner.type}</Text>
                  </Flex>
                </SplideSlide>
              )}
            </Splide>
          ) : (
            <Text size='xs'>Nenhum parceiro no momento</Text>
          )}
        </>
      )}
    </Paper>
  );
};

export default PartnersModule;