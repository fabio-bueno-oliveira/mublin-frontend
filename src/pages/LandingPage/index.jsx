import React from 'react';
import { Container } from '@mantine/core';
import FooterLandingPage from './modules/Footer';

function LandingPage () {

    document.title = 'Mublin';

    return (
        <>
          <main id='landingPage'>
            <h1>Mublin</h1>
            <Container>Default Container</Container>
          </main>
          <FooterLandingPage />
        </>
    );
};

export default LandingPage;