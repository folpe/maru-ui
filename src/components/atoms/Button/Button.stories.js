import React from 'react'

import Button from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
}

const Template = (args) => <Button {...args}>Valider</Button>

export const Variant = Template.bind({})
Variant.args = {
  variant: 'text',
  children: 'Toto',
}

export const Default = () => <Button>Coucou</Button>

export const Contained = () => <Button variant='contained'>Hello</Button>
export const Outlined = () => <Button variant='outlined'>Hello</Button>
export const Secondary = () => (
  <Button color='secondary' size='large'>
    Coucou
  </Button>
)
export const Full = () => (
  <Button variant='contained' color='secondary' full>
    Hello
  </Button>
)
