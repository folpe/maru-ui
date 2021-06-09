import React from 'react'

import { Button } from '.'

export default {
  title: 'Atoms',
  component: Button,
}

const Template = (args) => <Button {...args} />

export const ButtonBasic = Template.bind({})
ButtonBasic.args = {
  children: 'Valider',
}
