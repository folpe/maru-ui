import React from 'react';

import Button from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
};

export const Basic = () => <Button onClick={() => console.log('ici')}>Coucou</Button>;
export const WithFunc = () => <Button onClick={() => console.log('ici')}>Hello</Button>;
