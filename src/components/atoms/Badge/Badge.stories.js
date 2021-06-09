import React from 'react'

import Badge from './Badge'

export default {
  title: 'Atoms',
  component: Badge,
}

const Template = (args) => <Badge {...args} />

export const BadgeBasic = Template.bind({})
BadgeBasic.args = {
  children: '01',
}
