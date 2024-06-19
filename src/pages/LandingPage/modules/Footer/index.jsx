import React from 'react';
import { Container } from '@mantine/core';

function FooterLandingPage () {

    document.title = 'Mublin';

    return (
        <>
          <main id='landingPage'>
            <h1>Mublin</h1>
            <Container>FooterLandingPage</Container>
          </main>
          <FooterCentered />
        </>
    );
};

export default FooterLandingPage;