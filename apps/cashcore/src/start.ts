import 'dotenv/config';

import('./server.ts').catch(err =>
    console.error('Error loading server: ', err)
);
