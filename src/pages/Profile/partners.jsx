import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Title, Text, Image } from '@mantine/core';

function PartnersModule ({ 
    partners, 
    loading
}) {

  return (
    <Paper 
      radius="md" 
      mb={25}
      style={{ backgroundColor: 'transparent' }}
    >
      <Title order={5} mb={8}>Parceiros</Title>
      {loading ? ( 
        <Text size='sm'>Carregando...</Text>
      ) : (
        <>
          {partners.total ? ( 
            <>
              {partners.result.map((partner, key) =>
                <div key={key}>
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