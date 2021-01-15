import React from 'react'

import Button from './Button'

export default {
  title: 'Atoms',
  component: Button,
}

const Template = (args) => <Button {...args} />

export const BasicButton = Template.bind({})
BasicButton.args = {
  children: 'Valider',
}
