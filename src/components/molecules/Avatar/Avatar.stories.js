import React from 'react'

import Avatar from './Avatar'
import imageFile from '../../../../static/avatar.jpg'

const image = {
  src: imageFile,
  alt: 'my image',
}

const img = <img src={image.src} alt={image.alt} />

export default {
  title: 'Molecules',
  component: Avatar,
}

const Template = (args) => <Avatar {...args} />

export const AvatarBasic = Template.bind({})
AvatarBasic.args = {
  name: 'Shiba',
  lastname: 'Maru',
}

export const AvatarImage = Template.bind({})
AvatarImage.args = {
  image: img,
}
