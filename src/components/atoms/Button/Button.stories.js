import React from 'react'

import Button from './Button'

export default {
  title: 'Atoms',
  component: Button,
}

const Template = (args) => <Button {...args} />

export const ButtonBasic = Template.bind({})
ButtonBasic.args = {
  children: 'Valider',
}
